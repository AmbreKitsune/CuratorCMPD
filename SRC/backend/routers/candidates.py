from database.repository.candidates import CandidateRepository
from database.repository.officers import OfficerRepository
from database.session import get_db
from fastapi import APIRouter, Depends, HTTPException

from .ws import broadcast

router = APIRouter(prefix="/api/candidates", tags=["candidates"])


@router.get("/")
async def get_all_candidates(db=Depends(get_db)):
    cursor_candidate = CandidateRepository(db)

    candidates = await cursor_candidate.get_all_candidates()
    return candidates


@router.get("/{candidate_id}")
async def get_candidate(candidate_id: int, db=Depends(get_db)):
    cursor_candidate = CandidateRepository(db)
    
    candidate = await cursor_candidate.get_candidate(candidate_id)

    if candidate is None:
        raise HTTPException(
            status_code=404,
            detail="Кандидат не найден"
        )

    return candidate


@router.post("/{candidate_id}")
async def accept_candidate(candidate_id: int, db=Depends(get_db)):
    cursor_candidate = CandidateRepository(db)
    cursor_officer = OfficerRepository(db)

    candidate = await cursor_candidate.get_candidate(candidate_id)

    if candidate is None:
        raise HTTPException(
            status_code=404,
            detail="Кандидат не найден"
        )

    try:
        officer = await cursor_officer.create_officer(
            candidate.first_name,
            candidate.last_name,
            candidate.age,
            candidate.experience
        )

        await cursor_candidate.delete_candidate(candidate_id)

        await db.commit()
    except Exception:
        await db.rollback()
        raise

    await broadcast({"type": "candidates_update"})
    await broadcast({"type": "officers_update"})

    return {"officer_id": officer.id}
