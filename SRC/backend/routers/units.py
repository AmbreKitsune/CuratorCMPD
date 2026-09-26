from database.repository.units import UnitRepository
from database.repository.officers import OfficerRepository
from database.session import get_db
from fastapi import APIRouter, Depends, HTTPException

from .ws import broadcast

router = APIRouter(prefix="/api/units", tags=["units"])


@router.get("/")
async def get_all_units(db=Depends(get_db)):
    cursor_unit = UnitRepository(db)

    units = await cursor_unit.get_all_units()
    return units


@router.get("/{unit_id}")
async def get_unit(unit_id: int, db=Depends(get_db)):
    cursor_unit = UnitRepository(db)

    unit = await cursor_unit.get_unit(unit_id)
    
    if unit is None:
        raise HTTPException(
            status_code=404,
            detail="Юнит не найден"
        )
    
    return unit


@router.get("/{unit_id}/officers")
async def get_officers_unit(unit_id: int, db=Depends(get_db)):
    cursor_unit = UnitRepository(db)
    cursor_officer = OfficerRepository(db)

    unit = await cursor_unit.get_unit(unit_id)
        
    if unit is None:
        raise HTTPException(
            status_code=404,
            detail="Юнит не найден"
        )

    officers = await cursor_officer.get_officers_by_unit_id(unit_id)
    return officers
    


