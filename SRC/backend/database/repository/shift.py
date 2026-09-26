from database.models import PlayerShiftState
from sqlalchemy import select, update
from sqlalchemy.ext.asyncio import AsyncSession

from schema.shift import ShiftType, ShiftPhase


class ShiftRepository:
    def __init__(self, db: AsyncSession) -> None:
        self.db = db

    async def create_player_shift_state(self, player_id: int):
        player_shift_state = PlayerShiftState(
            player_id=player_id,
            shift_type=ShiftType.DAY
        )
        self.db.add(player_shift_state)
        await self.db.commit()
        await self.db.refresh(player_shift_state)

    async def get_player_shift_state_by_id(self, player_id: int)  -> PlayerShiftState | None:
        result = await self.db.execute(select(PlayerShiftState).where(PlayerShiftState.player_id == player_id))
        return result.scalars().one_or_none()

    async def get_player_shift_state_by_phase(self, shift_phase: ShiftPhase):
        result = await self.db.execute(select(PlayerShiftState.player_id).where(PlayerShiftState.shift_phase == shift_phase))
        return result.scalars().one_or_none()

    async def update_phase_for_player_shift_state(self, player_id: int, shift_phase: ShiftPhase):
        await self.db.execute(
            update(PlayerShiftState).where(PlayerShiftState.player_id == player_id).values(shift_phase=shift_phase)
        )
        await self.db.commit()

    async def update_type_for_player_shift_state(self, player_id: int, shift_type: ShiftType):
        await self.db.execute(
            update(PlayerShiftState).where(PlayerShiftState.player_id == player_id).values(shift_type=shift_type)
        )
        await self.db.commit()
