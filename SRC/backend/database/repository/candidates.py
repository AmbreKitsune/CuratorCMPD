from database.models import Candidate
from sqlalchemy import select, delete
from sqlalchemy.ext.asyncio import AsyncSession


class CandidateRepository:
    def __init__(self, db: AsyncSession) -> None:
        self.db = db

    async def delete_all_candidates(self):
        await self.db.execute(delete(Candidate))

    async def delete_candidate(self, candidate_id: int):
        await self.db.execute(delete(Candidate).where(Candidate.id == candidate_id))

    async def create_candidate(
        self, first_name: str, last_name: str, age: int, experience: int
    ):
        candidate = Candidate(
            first_name=first_name, last_name=last_name, age=age, experience=experience
        )
        self.db.add(candidate)
        await self.db.flush()

    async def get_all_candidates(self):
        res = await self.db.execute(select(Candidate))
        return res.scalars().all()

    async def get_candidate(self, candidate_id: int):
        res = await self.db.execute(
            select(Candidate).where(Candidate.id == candidate_id)
        )
        return res.scalar_one_or_none()
