import asyncio
from time import monotonic

from database.session import AsyncSessionLocal
from database.repository.vds import VDSRepository
from database.repository.units import UnitRepository
from database.repository.shift import ShiftRepository
from database.repository.officers import OfficerRepository

from schema.shift import ShiftPhase
from schema.units import UnitStatus, UnitTarget
from schema.officers import OfficersStatus

from routers.ws import broadcast


RETURN_SECONDS = 10
POLL_SECONDS = 1


async def create_units():
    async with AsyncSessionLocal() as db:
        cursor_unit = UnitRepository(db)
        cursor_vds = VDSRepository(db)

        new_vds = None
        vds = await cursor_vds.get_all_vds()
        units = await cursor_unit.get_all_units()

        if not vds:
            new_vds = await cursor_vds.create_vds(
                "ALPHA", "Легковая патрульная машина", 2, 2
            )  # Пока одна. Но надо будет записать всех, а то забудем.
            await db.commit()

        if units:
            return

        for i in range(2):
            try:
                await cursor_unit.create_unit(
                    name=f"Экипаж №{i + 1}",
                    vds_id=(new_vds.id if new_vds else vds[0].id),
                )

                await db.commit()
            except Exception:
                await db.rollback()
                raise


async def units_loop():
    return_deadlines: dict[int, float] = {}

    while True:
        async with AsyncSessionLocal() as db:
            cursor_unit = UnitRepository(db)
            cursor_officer = OfficerRepository(db)
            cursor_shift = ShiftRepository(db)

            active_player_id = await cursor_shift.get_player_shift_state_by_phase(
                ShiftPhase.ACTIVE
            )
            shift_active = active_player_id is not None

            units = await cursor_unit.get_all_units()

            for unit in units:
                changed = False
                officers_changed = False
                started_return = False
                finished_return = False

                try:
                    # 1. Экипаж на базе
                    if unit.status == UnitStatus.ON_BASE:
                        if unit.target_state == UnitTarget.ON_PATROL:
                            officers = await cursor_officer.get_officers_by_unit_id(
                                unit.id
                            )

                            if not officers:
                                # Некому принять приказ.
                                await cursor_unit.update_unit_target_state(
                                    unit.id, UnitTarget.ON_BASE
                                )
                                changed = True

                            elif shift_active and all(
                                officer.status == OfficersStatus.ASSIGNED
                                for officer in officers
                            ):
                                await cursor_unit.update_unit_status(
                                    unit.id, UnitStatus.ON_PATROL
                                )

                                for officer in officers:
                                    await cursor_officer.update_officer_status(
                                        officer.id, OfficersStatus.DUTY
                                    )

                                changed = True
                                officers_changed = True

                    # 2. Экипаж на патруле
                    elif unit.status == UnitStatus.ON_PATROL:
                        if unit.target_state == UnitTarget.ON_BASE or not shift_active:
                            await cursor_unit.update_unit_status(
                                unit.id, UnitStatus.RETURNING
                            )

                            if not shift_active:
                                await cursor_unit.update_unit_target_state(
                                    unit.id, UnitTarget.ON_BASE
                                )

                            started_return = True
                            changed = True

                    # 3. Экипаж возвращается
                    elif unit.status == UnitStatus.RETURNING:
                        deadline = return_deadlines.get(unit.id)

                        if deadline is None:
                            return_deadlines[unit.id] = monotonic() + RETURN_SECONDS

                        elif monotonic() >= deadline:
                            await cursor_unit.update_unit_status(
                                unit.id, UnitStatus.ON_BASE
                            )

                            officers = await cursor_officer.get_officers_by_unit_id(
                                unit.id
                            )

                            for officer in officers:
                                if officer.status == OfficersStatus.DUTY:
                                    await cursor_officer.update_officer_status(
                                        officer.id, OfficersStatus.ASSIGNED
                                    )
                                    officers_changed = True

                            finished_return = True
                            changed = True

                    # 4. Сохраняем изменения
                    if changed:
                        await db.commit()

                        if started_return:
                            return_deadlines[unit.id] = monotonic() + RETURN_SECONDS

                        if finished_return:
                            return_deadlines.pop(unit.id, None)

                        await broadcast({"type": "units_update"})

                        if officers_changed:
                            await broadcast({"type": "officers_update"})

                except Exception:
                    await db.rollback()
                    raise

        await asyncio.sleep(POLL_SECONDS)
