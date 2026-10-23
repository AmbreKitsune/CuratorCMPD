from fastapi import APIRouter, Depends

from database.session import get_db, AsyncSession
from database.repository.shift import ShiftRepository
from database.repository.player import PlayerRepository

from routers.ws import broadcast

from schema.shift import ShiftState, ShiftPhase


router = APIRouter(prefix="/api/shift", tags=["shift"])


@router.get("/")
async def get_shift(db: AsyncSession = Depends(get_db)):
    cursor_shift = ShiftRepository(db)
    cursor_player = PlayerRepository(db)

    global_player_id = await cursor_player.get_id_from_global_player()
    if global_player_id is None:
        return

    player_shift_state = await cursor_shift.get_player_shift_state_by_id(
        player_id=global_player_id
    )

    if player_shift_state is None:
        return

    return ShiftState(
        shift_phase=player_shift_state.shift_phase,
        shift_type=player_shift_state.shift_type,
        current_time_minutes=540,
        day_number=player_shift_state.day_number,
        season=player_shift_state.season,
    )


@router.post("/start")
async def start_shift(db: AsyncSession = Depends(get_db)):
    cursor_shift = ShiftRepository(db)
    cursor_player = PlayerRepository(db)

    global_player_id = await cursor_player.get_id_from_global_player()
    if global_player_id is None:
        return

    await cursor_shift.update_phase_for_player_shift_state(
        player_id=global_player_id, shift_phase=ShiftPhase.ACTIVE
    )

    await broadcast(
        {"type": "shift_update", "data": {"shift_phase": ShiftPhase.ACTIVE}}
    )
