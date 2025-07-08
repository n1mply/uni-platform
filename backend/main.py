from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
from routes.auth import auth
from contextlib import asynccontextmanager
import os
from bot import bot, notify_about_university, dp
from aiogram.webhook.aiohttp_server import SimpleRequestHandler, setup_application
from aiohttp import web


@asynccontextmanager
async def lifespan(app: FastAPI):
    print('Starting...')
    # Инициализация бота
    app.state.bot = bot
    if os.getenv('WEBHOOK_MODE', 'false').lower() == 'true':
        await bot.set_webhook(f"{os.getenv('WEBHOOK_URL')}/webhook")
    yield
    print('Closing...')
    if os.getenv('WEBHOOK_MODE', 'false').lower() == 'true':
        await bot.delete_webhook()
    await bot.session.close()

app = FastAPI(lifespan=lifespan)
app.include_router(auth)

# Настройка CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://192.168.1.10:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Добавляем обработчик бота только в режиме вебхука
if os.getenv('WEBHOOK_MODE', 'false').lower() == 'true':
    @app.on_event("startup")
    async def on_startup():
        webhook_url = f"{os.getenv('WEBHOOK_URL')}/webhook"
        await bot.set_webhook(webhook_url)
        
    # Создаем aiohttp приложение для обработки вебхуков
    aioapp = web.Application()
    webhook_requests_handler = SimpleRequestHandler(
        dispatcher=dp,
        bot=bot,
    )
    webhook_requests_handler.register(aioapp, path="/webhook")
    setup_application(aioapp, dp, bot=bot)
    
    # Монтируем aiohttp приложение в FastAPI
    app.mount("/bot", aioapp)

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)