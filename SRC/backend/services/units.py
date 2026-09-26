from database.repository.units import UnitRepository
from database.session import AsyncSessionLocal


async def create_units():
    async with AsyncSessionLocal() as db:
        cursor_unit = UnitRepository(db)
        
        if bool(await cursor_unit.get_all_units()):
            return

        for i in range(2):
            await cursor_unit.create_unit(
                name=f"Экипаж №{i+1}",
                type="patrol",
                code=f"ADAM-{i+1}",
                status="on_base",
                max_personnel=2
            )



