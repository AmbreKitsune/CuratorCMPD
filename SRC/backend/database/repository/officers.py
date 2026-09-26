from database.models import Officer
from sqlalchemy import select, update
from sqlalchemy.ext.asyncio import AsyncSession


class OfficerRepository:
    def __init__(self, db: AsyncSession) -> None:
        self.db = db

    async def create_officer(self, first_name: str, last_name: str, age: int, experience: int):
        officer = Officer(
            first_name=first_name,
            last_name=last_name,
            age=age,
            experience=experience,
            joined_day=0,
            available_day=0
        )
        self.db.add(officer)
        await self.db.flush()

        return officer

    async def get_all_officers(self):
        res = await self.db.execute(select(Officer))
        return res.scalars().all()

    async def get_officer(self, officer_id: int):
        res = await self.db.execute(
            select(Officer).where(Officer.id == officer_id)
        )
        return res.scalar_one_or_none()

    async def get_officers_by_unit_id(self, unit_id: int):
        res = await self.db.execute(
            select(Officer).where(Officer.assigned_unit_id == unit_id)
        )
        return res.scalars().all()

    async def assign_officer_to_unit(self, officer_id: int, unit_id: int):
        await self.db.execute(
            update(Officer).
            where(Officer.id == officer_id).
            values(assigned_unit_id=unit_id)
        )

    async def unassign_officer(self, officer_id: int):
        await self.db.execute(
            update(Officer).
            where(Officer.id == officer_id).
            values(assigned_unit_id=None)
        )
