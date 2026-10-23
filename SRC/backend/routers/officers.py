from fastapi import APIRouter, Depends, HTTPException, status

from database.session import get_db, AsyncSession
from database.repository.vds import VDSRepository
from database.repository.units import UnitRepository
from database.repository.officers import OfficerRepository

from schema.units import UnitTarget
from schema.officers import OfficersStatus, OfficersHealth

from .ws import broadcast

router = APIRouter(prefix="/api/officers", tags=["officers"])


@router.get("/")
async def get_all_officers(db: AsyncSession = Depends(get_db)):
    cursor_officer = OfficerRepository(db)

    officers = await cursor_officer.get_all_officers()
    return officers


@router.get("/{officer_id}")
async def get_officer(officer_id: int, db: AsyncSession = Depends(get_db)):
    cursor_officer = OfficerRepository(db)

    officer = await cursor_officer.get_officer(officer_id)

    if officer is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Офицер не найден"
        )

    return officer


@router.post("/{officer_id}/assign/{unit_id}")
async def assign_officer(
    officer_id: int, unit_id: int, db: AsyncSession = Depends(get_db)
):
    cursor_officer = OfficerRepository(db)
    cursor_unit = UnitRepository(db)
    cursor_vds = VDSRepository(db)

    try:
        officer = await cursor_officer.get_officer(officer_id)
        if officer is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="Офицер не найден"
            )

        if officer.status not in [OfficersStatus.RESERVE, OfficersStatus.ASSIGNED]:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Офицера нельзя назначить в экипаж",
            )

        if officer.assigned_unit_id == unit_id:
            return

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

        officers_by_unit_id = await cursor_officer.get_officers_by_unit_id(unit_id)
        if len(officers_by_unit_id) >= vds.capacity_officer:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT, detail="Не хватает места в машине"
            )

        await cursor_officer.assign_officer_to_unit(officer_id, unit_id)
        await cursor_officer.update_officer_status(officer_id, OfficersStatus.ASSIGNED)

        await db.commit()
    except Exception:
        await db.rollback()
        raise

    await broadcast({"type": "units_update"})
    await broadcast({"type": "officers_update"})


@router.post("/{officer_id}/unassign")
async def unassign_officer(officer_id: int, db: AsyncSession = Depends(get_db)):
    cursor_officer = OfficerRepository(db)
    cursor_unit = UnitRepository(db)

    try:
        officer = await cursor_officer.get_officer(officer_id)

        if officer is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="Офицер не найден"
            )

        if officer.assigned_unit_id is None:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Офицер не состоит в экипаже",
            )

        if officer.status == OfficersStatus.DUTY:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Офицера нельзя снять с экипажа, во время несения службы",
            )

        await cursor_officer.unassign_officer(officer_id)
        await cursor_officer.update_officer_status(officer_id, OfficersStatus.RESERVE)

        remaining_officers = await cursor_officer.get_officers_by_unit_id(
            officer.assigned_unit_id
        )

        if not remaining_officers:
            await cursor_unit.update_unit_target_state(
                officer.assigned_unit_id,
                UnitTarget.ON_BASE,
            )

        await db.commit()
    except Exception:
        await db.rollback()
        raise

    await broadcast({"type": "units_update"})
    await broadcast({"type": "officers_update"})
