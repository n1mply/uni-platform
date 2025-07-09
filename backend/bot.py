# bot.py
from aiogram import Bot, Dispatcher, types
from aiogram.filters import Command
from aiogram.types import InlineKeyboardButton, InlineKeyboardMarkup
from db import AsyncSessionLocal
from routes.bot_router import approve_request, reject_request
from core.config import settings

bot = Bot(token=settings.TELEGRAM_BOT_TOKEN)
dp = Dispatcher()

pending_requests = {}

@dp.message(Command("start"))
async def start_command(message: types.Message):
    if message.chat.id == settings.TELEGRAM_ADMIN_CHAT_ID:
        pending_requests.clear()
        await message.answer("Админ-панель готова к работе!")

async def send_university_request(university_data, request_id: int):
    print(university_data.baseInfo)
    message_text = (
        "📝 Новая заявка на создание ВУЗа:\n\n"
        f"🏛️ Полное название: {university_data.baseInfo.fullName}\n"
        f"🔖 Короткое название: {university_data.baseInfo.shortName}\n"
        f"🏷️ Тег: {university_data.baseInfo.universityTag}\n"
        f"📍 Адрес: {university_data.baseInfo.address}\n"
        f"📌 ID запроса: {request_id}"
    )
    
    keyboard = InlineKeyboardMarkup(inline_keyboard=[
        [
            InlineKeyboardButton(text="✅ Принять", callback_data=f"approve_{request_id}"),
            InlineKeyboardButton(text="❌ Отклонить", callback_data=f"reject_{request_id}")
        ]
    ])
    
    pending_requests[request_id] = university_data
    
    await bot.send_message(
        chat_id=settings.TELEGRAM_ADMIN_CHAT_ID,
        text=message_text,
        reply_markup=keyboard
    )

@dp.callback_query(lambda c: c.data.startswith('approve_') or c.data.startswith('reject_'))
async def handle_approval(callback_query: types.CallbackQuery):
    request_id = int(callback_query.data.split('_')[1])
    action = callback_query.data.split('_')[0]
    
    if request_id not in pending_requests:
        await callback_query.answer("Заявка не найдена!")
        return
    
    university_data = pending_requests[request_id]
    async with AsyncSessionLocal() as session:
        try:
            if action == "approve":
                await approve_request(request_id=request_id, university=university_data, session=session)
                response_text = f"✅ Заявка ВУЗа {university_data.baseInfo.shortName} одобрена!"
            else:
                await reject_request(request_id, session)
                response_text = f"❌ Заявка ВУЗа {university_data.baseInfo.shortName} отклонена!"
            
            del pending_requests[request_id]
            
            await callback_query.message.edit_text(
                text=f"🔄 {response_text}",
                reply_markup=None
            )
            await callback_query.answer(response_text)
            
            
        except Exception as e:
            # await session.rollback()
            await callback_query.answer(f"Ошибка: {str(e)}")