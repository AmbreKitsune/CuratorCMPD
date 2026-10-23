from enum import Enum


class OfficersStatus(Enum):
    RESERVE = "reserve"
    ASSIGNED = "assigned"
    DUTY = "duty"
    TREATMENT = "treatment"
    THERAPY = "therapy"
    SUSPENDED = "suspended"
    DEAD = "dead"


class OfficersHealth(Enum):
    HEALTHY = "healthy"
    WOUNDED = "wounded"
    PSYCHOSIS = "psychosis"
    DEAD = "dead"
