from database.models import Player
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession


class PlayerRepository:
    def __init__(self, db: AsyncSession) -> None:
        self.db = db

    async def get_id_from_global_player(self) -> int | None:
        result = await self.db.execute(
            select(Player.id).order_by(Player.id.asc()).limit(1)
        )
        return result.scalars().one_or_none()

    async def create_global_player(self) -> int:
        global_player = Player(nickname="CURATOR-001")
        self.db.add(global_player)
        await self.db.commit()
        await self.db.refresh(global_player)

        return global_player.id
