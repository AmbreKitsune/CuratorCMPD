from sqlalchemy import func, Enum, ForeignKey, Integer, String
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column

from schema.shift import ShiftPhase, ShiftType, ShiftSeason

import datetime


class Base(DeclarativeBase):
    pass


# -- ИГРОК --
class Player(Base):
    __tablename__ = "player"

    id: Mapped[int] = mapped_column(primary_key=True)

    nickname: Mapped[str]

    created_at: Mapped[datetime.datetime] = mapped_column(
        server_default=func.now()
    )


class PlayerShiftState(Base):
    __tablename__ = "player_shift_state"

    player_id: Mapped[int] = mapped_column(
        ForeignKey("player.id"),
        primary_key=True
    )

    shift_phase: Mapped[ShiftPhase] = mapped_column(default=ShiftPhase.RESTING)
    shift_type: Mapped[ShiftType] = mapped_column(default=ShiftType.DAY)

    day_number: Mapped[int] = mapped_column(default=1)
    season: Mapped[ShiftSeason] = mapped_column(default=ShiftSeason.SUMMER)
    year_number: Mapped[int] = mapped_column(default=0)


# --- ПЕРСОНАЛ ---
class Candidate(Base):
    __tablename__ = "candidates"

    id: Mapped[int] = mapped_column(primary_key=True)

    first_name: Mapped[str]
    last_name: Mapped[str]

    age: Mapped[int]

    experience: Mapped[int]


class Officer(Base):
    __tablename__ = "officers"

    id: Mapped[int] = mapped_column(primary_key=True)

    first_name: Mapped[str] = mapped_column(String)
    last_name: Mapped[str] = mapped_column(String)

    age: Mapped[int] = mapped_column(Integer)

    experience: Mapped[int] = mapped_column(Integer)

    # health: Mapped[str] = mapped_column(
    #     Enum("healthy", "wounded", "psychosis", "dead", name="health_status")
    # )  # Healthy / Wounded / Psychosis

    # status: Mapped[str] = mapped_column(
    #     Enum(
    #         "reserve",
    #         "base",
    #         "awaits",
    #         "duty",
    #         "treatment",
    #         "therapy",
    #         "suspended",
    #         "dead",
    #         name="person_status",
    #     )
    # )  # Reserve / Base / Awaits / Duty / Treatment / Therapy / Suspended / Dead

    assigned_unit_id: Mapped[int | None] = mapped_column(
        Integer, ForeignKey("units.id"), nullable=True
    )

    joined_day: Mapped[int] = mapped_column(Integer)
    available_day: Mapped[int] = mapped_column(Integer)


class Unit(Base):
    __tablename__ = "units"

    id: Mapped[int] = mapped_column(primary_key=True)

    name: Mapped[str] = mapped_column(String)

    type: Mapped[str] = mapped_column(String)

    code: Mapped[str] = mapped_column(String)
    status: Mapped[str] = mapped_column(String)

    max_personnel: Mapped[int] = mapped_column(Integer)
