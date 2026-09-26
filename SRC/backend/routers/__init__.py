from fastapi import APIRouter

from routers.officers import router as officers
from routers.candidates import router as candidates
from routers.units import router as units
from routers.shift import router as shift
from routers.ws import ws_router as ws

main_router = APIRouter()

main_router.include_router(candidates)
main_router.include_router(officers)
main_router.include_router(units)
main_router.include_router(shift)
main_router.include_router(ws)
