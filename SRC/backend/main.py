import asyncio
from contextlib import asynccontextmanager

import uvicorn
from database.models import Base
from database.session import engine
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import main_router

from services.shift import shift_loop
from services.player import create_player
from services.units import create_units, units_loop


@asynccontextmanager
async def lifespan(app: FastAPI):
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    await create_player()
    await create_units()

    shift_task = asyncio.create_task(shift_loop())
    units_task = asyncio.create_task(units_loop())

    try:
        yield
    finally:
        print("Завершение работы приложения")
        shift_task.cancel()
        units_task.cancel()
        await asyncio.gather(shift_task, units_task, return_exceptions=True)


app = FastAPI(
    lifespan=lifespan,
    title="Dispatcher",
    docs_url="/api/docs",
    openapi_url="/api/openapi.json",
)


app.include_router(main_router)


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


if __name__ == "__main__":
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
