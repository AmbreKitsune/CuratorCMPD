import asyncio

from routers.ws import broadcast

from database.repository.shift import ShiftRepository
from database.session import AsyncSessionLocal

from schema.shift import ShiftPhase

from services.recruitment import create_candidates


async def shift_stop(player_id: int, shift_time: int, cursor_shift: ShiftRepository):
    await cursor_shift.update_phase_for_player_shift_state(
        player_id=player_id, shift_phase=ShiftPhase.AVAILABLE
    )

    await create_candidates()

    await broadcast(
        {
            "type": "shift_update",
            "data": {
                "shift_phase": ShiftPhase.AVAILABLE,
                "current_time_minutes": shift_time,
            },
        }
    )


async def shift_loop():
    SHIFT_TIME = 540  # 9:00

    async with AsyncSessionLocal() as db:
        cursor_shift = ShiftRepository(db)

        while True:
            await asyncio.sleep(1)

            player_id = await cursor_shift.get_player_shift_state_by_phase(
                shift_phase=ShiftPhase.ACTIVE
            )

            if player_id is None:
                continue

            SHIFT_TIME = (SHIFT_TIME + 30) % 1440

            if SHIFT_TIME >= 1320:  # 22:00
                await shift_stop(player_id, SHIFT_TIME, cursor_shift)
                SHIFT_TIME = 540
                continue

            await broadcast(
                {"type": "shift_update", "data": {"current_time_minutes": SHIFT_TIME}}
            )
