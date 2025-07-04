import asyncio
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker
from sqlalchemy.orm import declarative_base
from sqlalchemy.sql import text
from core.config import settings

Base = declarative_base()
engine = create_async_engine(settings.sync_url, echo=True)
AsyncSessionLocal = async_sessionmaker(engine, expire_on_commit=False)

async def create_database():
    admin_engine = create_async_engine(settings.admin_url, isolation_level="AUTOCOMMIT")
    async with admin_engine.connect() as conn:
        result = await conn.execute(
            text("SELECT 1 FROM pg_database WHERE datname=:dbname"),
            {"dbname": settings.db_name}
        )
        if result.scalar() != 1:
            await conn.execute(text(f'CREATE DATABASE "{settings.db_name}"'))
            print(f"БД '{settings.db_name}' создана")
        else:
            print(f"БД '{settings.db_name}' уже существует")
    await admin_engine.dispose()

async def init_db():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    print("Таблицы созданы")

async def main():
    await create_database()
    await init_db()

if __name__ == "__main__":
    asyncio.run(main())
