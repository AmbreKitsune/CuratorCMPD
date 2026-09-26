from pydantic import BaseModel


class AssignRequest(BaseModel):
    person_id: int
    unit_id: int


class InBaseRequest(BaseModel):
    person_id: int


class UnitRequest(BaseModel):
    unit_id: int


class RecruitmentRequest(BaseModel):
    recruitment_id: int
