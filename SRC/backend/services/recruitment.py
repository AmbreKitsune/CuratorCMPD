import random

from routers.ws import broadcast

from database.session import AsyncSessionLocal
from database.repository.candidates import CandidateRepository


CONFIG = {
    "first_name": [
        "Иван",
        "Руслан",
        "Андрей",
        "Джон",
        "Александр",
        "Алексей",
        "Михаил",
        "Максим",
        "Дмитрий",
        "Сергей",
        "Николай",
        "Виктор",
        "Артём",
        "Даниил",
        "Егор",
        "Павел",
        "Роман",
        "Илья",
        "Кирилл",
        "Владислав",
        "Денис",
        "Антон",
        "Никита",
        "Тимур",
        "Арман",
        "Данияр",
        "Нурлан",
        "Алихан",
        "Дамир",
        "Арсен",
    ],
    "last_name": [
        "Лисицын",
        "Иванов",
        "Петров",
        "Соколов",
        "Волков",
        "Орлов",
        "Морозов",
        "Кузнецов",
        "Новиков",
        "Фёдоров",
        "Павлов",
        "Смирнов",
        "Васильев",
        "Алексеев",
        "Михайлов",
        "Козлов",
        "Захаров",
        "Белов",
        "Громов",
        "Егоров",
        "Ковалёв",
        "Макаров",
        "Никитин",
        "Воронов",
        "Королёв",
        "Тихонов",
        "Ермаков",
        "Романов",
        "Ахметов",
        "Садыков",
    ],
}


async def create_candidates():
    async with AsyncSessionLocal() as db:
        cursor_candidate = CandidateRepository(db)

        try:
            await cursor_candidate.delete_all_candidates()

            for _ in range(5):
                first_name = random.choice(CONFIG["first_name"])
                last_name = random.choice(CONFIG["last_name"])
                age = random.randint(20, 45)

                await cursor_candidate.create_candidate(
                    first_name=first_name, last_name=last_name, age=age, experience=0
                )

            await db.commit()
            await broadcast({"type": "candidates_update"})
        except Exception:
            await db.rollback()
            raise
