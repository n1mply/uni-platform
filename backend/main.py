from fastapi import FastAPI, Request, Response
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
from routes.uni_router import uni_router
from routes.auth_router import auth_router
from routes.bot_router import bot_router
from contextlib import asynccontextmanager
from aiogram.types import Update
from bot import bot, dp
from core.config import settings
from aiogram import exceptions
from fastapi.staticfiles import StaticFiles
from core.config import settings


@asynccontextmanager
async def lifespan(app: FastAPI):
    print('Starting...')
    if settings.WEBHOOK_URL:
        try:
            await bot.set_webhook(f"{settings.webhook_url}/webhook")
        except exceptions.TelegramNetworkError:
            print("bot doesn't works!")
            await bot.delete_webhook()
    yield
    print('Closing...')

app = FastAPI(lifespan=lifespan)
app.include_router(auth_router)
app.include_router(bot_router)
app.include_router(uni_router)


app.mount("/static", StaticFiles(directory="static"), name="static")



app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://192.168.1.10:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.post("/webhook")
async def webhook(update: dict):
    telegram_update = Update(**update)
    await dp.feed_update(bot=bot, update=telegram_update)

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
