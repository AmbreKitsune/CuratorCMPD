from enum import Enum


class UnitStatus(Enum):
    ON_BASE = "on_base"
    EN_ROUTE = "en_route"
    ON_PATROL = "on_patrol"
    RESPONDING = "responding"
    ON_SCENE = "on_scene"
    RETURNING = "returning"
    UNAVAILABLE = "unavailable"


class UnitTarget(str, Enum):
    ON_BASE = "on_base"
    ON_PATROL = "on_patrol"
