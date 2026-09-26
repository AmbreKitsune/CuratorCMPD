from enum import Enum

from pydantic import BaseModel, Field


class ShiftPhase(str, Enum):
    RESTING = "RESTING"
    AVAILABLE = "AVAILABLE"
    ACTIVE = "ACTIVE"
    SIGNED_OFF = "SIGNED_OFF"


class ShiftType(str, Enum):
    DAY = "DAY"
    NIGHT = "NIGHT"


class ShiftSeason(str, Enum):
    WINTER = "WINTER"
    SPRING = "SPRING"
    SUMMER = "SUMMER"
    AUTUMN = "AUTUMN"


class ShiftState(BaseModel):
    shift_phase: ShiftPhase
    shift_type: ShiftType
    current_time_minutes: int = Field(ge=0, le=1439)

    day_number: int = Field(ge=1, le=28)
    season: ShiftSeason
