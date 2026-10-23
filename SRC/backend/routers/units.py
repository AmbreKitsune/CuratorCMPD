from fastapi import APIRouter, Depends, HTTPException, status

from database.repository.vds import VDSRepository
from database.repository.units import UnitRepository
from database.repository.officers import OfficerRepository
from database.session import get_db, AsyncSession

from schema.units import UnitTarget
from schema.officers import OfficersStatus

from .ws import broadcast

router = APIRouter(prefix="/api/units", tags=["units"])


@router.get("/")
async def get_all_units(db: AsyncSession = Depends(get_db)):
    cursor_unit = UnitRepository(db)
    cursor_vds = VDSRepository(db)

    units = await cursor_unit.get_all_units()
    vds = await cursor_vds.get_all_vds()

    return {"units": units, "vds": vds}


@router.get("/{unit_id}")
async def get_unit(unit_id: int, db: AsyncSession = Depends(get_db)):
    cursor_unit = UnitRepository(db)
    cursor_vds = VDSRepository(db)

    unit = await cursor_unit.get_unit(unit_id)

    if unit is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Экипаж не найден"
        )

    vds = await cursor_vds.get_vds(unit.vds_id)
    if vds is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="VDS не найден"
        )

    return {"unit": unit, "vds": vds}


@router.get("/{unit_id}/officers")
async def get_officers_unit(unit_id: int, db: AsyncSession = Depends(get_db)):
    cursor_unit = UnitRepository(db)
    cursor_officer = OfficerRepository(db)

    unit = await cursor_unit.get_unit(unit_id)

    if unit is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Экипаж не найден"
        )

    officers = await cursor_officer.get_officers_by_unit_id(unit_id)
    return officers


@router.post("/{unit_id}/target/{target_state}")
async def update_target_state(
    unit_id: int, target_state: UnitTarget, db: AsyncSession = Depends(get_db)
):
    cursor_unit = UnitRepository(db)
    cursor_officer = OfficerRepository(db)

    unit = await cursor_unit.get_unit(unit_id)

    if unit is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Экипаж не найден"
        )

    if target_state == UnitTarget.ON_PATROL:
        officers = await cursor_officer.get_officers_by_unit_id(unit_id)

        if not officers:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Нельзя отправить пустой экипаж на патруль",
            )

        if any(officer.status != OfficersStatus.ASSIGNED for officer in officers):
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Не все сотрудники экипажа готовы к патрулированию",
            )

    try:
        await cursor_unit.update_unit_target_state(unit_id, target_state)
        await db.commit()
    except Exception:
        await db.rollback()
        raise

    await broadcast({"type": "units_update"})
