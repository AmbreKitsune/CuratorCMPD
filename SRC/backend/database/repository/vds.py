from database.models import VDS
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession


class VDSRepository:
    def __init__(self, db: AsyncSession) -> None:
        self.db = db

    async def create_vds(
        self,
        code: str,
        vehicle_name: str,
        capacity_officer: int,
        capacity_prisoner: int,
    ):
        vds = VDS(
            code=code,
            vehicle_name=vehicle_name,
            capacity_officer=capacity_officer,
            capacity_prisoner=capacity_prisoner,
        )
        self.db.add(vds)
        await self.db.flush()
        await self.db.refresh(vds)
        return vds

    async def get_all_vds(self):
        res = await self.db.execute(select(VDS))
        return res.scalars().all()

    async def get_vds(self, vds_id: int):
        res = await self.db.execute(select(VDS).where(VDS.id == vds_id))
        return res.scalar_one_or_none()
