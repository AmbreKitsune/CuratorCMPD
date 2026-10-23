from database.models import Officer
from sqlalchemy import case, select, update
from sqlalchemy.ext.asyncio import AsyncSession

from schema.officers import OfficersHealth, OfficersStatus


STATUS_ORDER = {
    "reserve": 0,
    "assigned": 1,
    "duty": 2,
    "treatment": 3,
    "therapy": 4,
    "suspended": 5,
    "dead": 6,
}


class OfficerRepository:
    def __init__(self, db: AsyncSession) -> None:
        self.db = db

    async def create_officer(
        self, first_name: str, last_name: str, age: int, experience: int
    ):
        officer = Officer(
            first_name=first_name,
            last_name=last_name,
            age=age,
            experience=experience,
            status=OfficersStatus.RESERVE,
            health=OfficersHealth.HEALTHY,
            joined_day=0,
            available_day=0,
        )
        self.db.add(officer)
        await self.db.flush()

        return officer

    async def get_all_officers(self):
        priority = case(
            STATUS_ORDER,
            value=Officer.status,
            else_=99,
        )

        result = await self.db.execute(
            select(Officer).order_by(
                priority,
                Officer.last_name,
                Officer.first_name,
                Officer.id,
            )
        )

        return result.scalars().all()

    async def get_officer(self, officer_id: int):
        res = await self.db.execute(select(Officer).where(Officer.id == officer_id))
        return res.scalar_one_or_none()

    async def get_officers_by_unit_id(self, unit_id: int):
        res = await self.db.execute(
            select(Officer).where(Officer.assigned_unit_id == unit_id)
        )
        return res.scalars().all()

    async def update_officer_status(self, officer_id: int, status: OfficersStatus):
        await self.db.execute(
            update(Officer).where(Officer.id == officer_id).values(status=status)
        )

    async def assign_officer_to_unit(self, officer_id: int, unit_id: int):
        await self.db.execute(
            update(Officer)
            .where(Officer.id == officer_id)
            .values(assigned_unit_id=unit_id)
        )

    async def unassign_officer(self, officer_id: int):
        await self.db.execute(
            update(Officer)
            .where(Officer.id == officer_id)
            .values(assigned_unit_id=None)
        )
