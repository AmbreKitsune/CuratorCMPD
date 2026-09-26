from database.models import Unit
from sqlalchemy import select, delete
from sqlalchemy.ext.asyncio import AsyncSession


class UnitRepository:
    def __init__(self, db: AsyncSession) -> None:
        self.db = db

    async def delete_unit(self, unit_id: int):
        await self.db.execute(
            delete(Unit).where(Unit.id == unit_id)
        )

    async def create_unit(self, name: str, type: str, code: str, status: str, max_personnel: int):
        unit = Unit(
            name=name,
            type=type,
            code=code,
            status=status,
            max_personnel=max_personnel
        )
        self.db.add(unit)
        await self.db.commit()
        await self.db.refresh(unit)

    async def get_all_units(self):
        res = await self.db.execute(select(Unit))
        return res.scalars().all()

    async def get_unit(self, unit_id: int):
        res = await self.db.execute(
            select(Unit).where(Unit.id == unit_id)
        )
        return res.scalar_one_or_none()
