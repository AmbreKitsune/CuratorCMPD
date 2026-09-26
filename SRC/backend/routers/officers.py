from database.repository.officers import OfficerRepository
from database.repository.units import UnitRepository
from database.session import get_db
from fastapi import APIRouter, Depends, HTTPException

from .ws import broadcast

router = APIRouter(prefix="/api/officers", tags=["officers"])

STATUS_ORDER = {
    "base": 0,
    "awaits": 1,
    "duty": 2,
    "reserve": 3,
    "treatment": 4,
    "therapy": 5,
    "suspended": 6,
    "dead": 7,
}


@router.get("/")
async def get_all_officers(db=Depends(get_db)):
    cursor_officer = OfficerRepository(db)

    officers = await cursor_officer.get_all_officers()
    return officers


@router.get("/{officer_id}")
async def get_officer(officer_id: int, db=Depends(get_db)):
    cursor_officer = OfficerRepository(db)

    officer = await cursor_officer.get_officer(officer_id)
    
    if officer is None:
        raise HTTPException(
            status_code=404,
            detail="Офицер не найден"
        )
    
    return officer


@router.post("/{officer_id}/assign/{unit_id}")
async def assign_officer(officer_id: int, unit_id: int, db=Depends(get_db)):
    cursor_officer = OfficerRepository(db)
    cursor_unit = UnitRepository(db)

    try:
        officer = await cursor_officer.get_officer(officer_id)
        if officer is None:
            raise HTTPException(
                status_code=404,
                detail="Офицер не найден"
            )

        if officer.assigned_unit_id == unit_id:
            return

        unit = await cursor_unit.get_unit(unit_id)
        if unit is None:
            raise HTTPException(
                status_code=404,
                detail="Экипаж не найден"
            )

        officers_by_unit_id = await cursor_officer.get_officers_by_unit_id(unit_id) 
        if len(officers_by_unit_id) >= unit.max_personnel:
            raise HTTPException(
                status_code=409,
                detail="Не хватает места в машине"
            )

        await cursor_officer.assign_officer_to_unit(officer_id, unit_id)
        await db.commit()
    except Exception:
        await db.rollback()
        raise

    await broadcast({"type": "units_update"})
    await broadcast({"type": "officers_update"})

@router.post("/{officer_id}/unassign")
async def unassign_officer(officer_id: int, db=Depends(get_db)):
    cursor_officer = OfficerRepository(db)

    try:
        officer = await cursor_officer.get_officer(officer_id)
            
        if officer is None:
            raise HTTPException(
                status_code=404,
                detail="Офицер не найден"
            )

        if officer.assigned_unit_id is None:
            raise HTTPException(
                status_code=409,
                detail="Офицер не состоит в экипаже"
            )

        await cursor_officer.unassign_officer(officer_id)
        await db.commit()
    except Exception:
        await db.rollback()
        raise

    await broadcast({"type": "units_update"})
    await broadcast({"type": "officers_update"})
