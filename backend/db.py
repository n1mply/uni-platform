import asyncio
from sqlalchemy import inspect
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker
from sqlalchemy.orm import declarative_base
from sqlalchemy.sql import text
from sqlalchemy.ext.asyncio import AsyncSession
from core.config import settings

Base = declarative_base()
engine = create_async_engine(settings.sync_url, echo=True)
AsyncSessionLocal = async_sessionmaker(engine, expire_on_commit=False)

async def get_async_session() -> AsyncSession: # type: ignore
    async with AsyncSessionLocal() as session:
        yield session

async def check_tables_exist():
    """Проверка существования таблиц через асинхронный inspect"""
    async with engine.connect() as conn:
        tables = await conn.run_sync(
            lambda sync_conn: inspect(sync_conn).get_table_names()
        )
        print(f"Существующие таблицы: {tables}")
        return bool(tables)

async def create_database():
    admin_engine = create_async_engine(settings.admin_url, isolation_level="AUTOCOMMIT")
    async with admin_engine.connect() as conn:
        result = await conn.execute(
            text("SELECT 1 FROM pg_database WHERE datname=:dbname"),
            {"dbname": settings.DB_NAME}
        )
        if result.scalar() != 1:
            await conn.execute(text(f'CREATE DATABASE "{settings.DB_NAME}"'))
            print(f"БД '{settings.DB_NAME}' создана")
        else:
            print(f"БД '{settings.DB_NAME}' уже существует")
    await admin_engine.dispose()

async def init_db():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    print("Таблицы созданы")
    
async def reset_db():
    async with engine.begin() as conn: 
        await conn.run_sync(Base.metadata.reflect)
        
        for table in reversed(Base.metadata.sorted_tables):
            await conn.execute(table.delete())
            
        await conn.run_sync(Base.metadata.create_all)
    print("Таблицы удалены и созданы заново")

async def main():
    await create_database()
    # await reset_db()

if __name__ == "__main__":
    asyncio.run(main())
