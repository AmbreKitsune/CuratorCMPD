from database.repository.player import PlayerRepository
from database.repository.shift import ShiftRepository
from database.session import AsyncSessionLocal

from services.recruitment import create_candidates


async def create_player():
    async with AsyncSessionLocal() as db:
        cursor_player = PlayerRepository(db)
        cursor_shift = ShiftRepository(db)

        player_id = await cursor_player.get_id_from_global_player()

        if player_id is not None:
            return

        new_player_id = await cursor_player.create_global_player()
        await cursor_shift.create_player_shift_state(player_id=new_player_id)

        await create_candidates()
