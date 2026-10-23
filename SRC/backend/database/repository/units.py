from database.models import Unit
from sqlalchemy import update, select, delete
from sqlalchemy.ext.asyncio import AsyncSession

from schema.units import UnitStatus, UnitTarget


class UnitRepository:
    def __init__(self, db: AsyncSession) -> None:
        self.db = db

    async def delete_unit(self, unit_id: int):
        await self.db.execute(delete(Unit).where(Unit.id == unit_id))

    async def create_unit(self, name: str, vds_id: int):
        unit = Unit(
            name=name,
            vds_id=vds_id,
            status=UnitStatus.ON_BASE,
            target_state=UnitTarget.ON_BASE,
        )
        self.db.add(unit)
        await self.db.commit()
        await self.db.refresh(unit)

    async def get_all_units(self):
        res = await self.db.execute(select(Unit))
        return res.scalars().all()

    async def get_unit(self, unit_id: int):
        res = await self.db.execute(select(Unit).where(Unit.id == unit_id))
        return res.scalar_one_or_none()

    async def get_units_by_target_state(self, target_state: UnitTarget):
        res = await self.db.execute(
            select(Unit).where(Unit.target_state == target_state)
        )
        return res.scalars().all()

    async def update_unit_target_state(self, unit_id: int, target_state: UnitTarget):
        await self.db.execute(
            update(Unit).where(Unit.id == unit_id).values(target_state=target_state)
        )

    async def update_unit_status(self, unit_id: int, status: UnitStatus):
        await self.db.execute(
            update(Unit).where(Unit.id == unit_id).values(status=status)
        )
