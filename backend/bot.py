import asyncio
import logging
import sys
from aiogram import Bot, Dispatcher, types
from aiogram.filters import Command
from aiogram.types import InlineKeyboardButton, InlineKeyboardMarkup
from aiogram.client.default import DefaultBotProperties
from aiogram.enums import ParseMode
from database.read import get_requests
from db import AsyncSessionLocal, get_async_session
from routes.bot_router import approve_request, reject_request
from core.config import settings

bot = Bot(token=settings.TELEGRAM_BOT_TOKEN, default=DefaultBotProperties(parse_mode=ParseMode.HTML))
dp = Dispatcher()

pending_requests = {}

@dp.message(Command("start"))
async def start_command(message: types.Message):
    if message.chat.id == settings.TELEGRAM_ADMIN_CHAT_ID:
        pending_requests.clear()
        await message.answer("Админ-панель готова к работе!")

@dp.message(Command("requests"))
async def start_command(message: types.Message):
    await message.answer("🔨 Проверяю заявки...")
    async with AsyncSessionLocal() as session:
        try:
            requests = await get_requests(session)
            response = "\n".join(
                f"ID: {req.id}\nДанные: {req.data}\nДата: {req.created_at}\n"
                for req in requests
            )
            await message.answer(response or "Нет заявок")
        except Exception as e:
            await message.answer(f"❌ Ошибка: {e}")
            print(e)


async def send_university_request(university_data, request_id: int):
    contacts_text = f"<b>🔗 Контакты:</b>\n"
    emoji_dict = {
        'email' : '✉️',
        'phone' : '📞'
    }
    
    
    for i in university_data.baseInfo.contacts:
        contacts_text+=f"  <b>{i.name}</b>\n"
        contacts_text+=f"    {emoji_dict[i.type]} {i.value}\n"
    
    message_text = (
        "<b>📝 Новая заявка на создание ВУЗа</b>:\n\n"
        f"<b>🏛️ Полное название:</b> {university_data.baseInfo.fullName}\n"
        f"<b>🔖 Короткое название:</b> {university_data.baseInfo.shortName}\n"
        f"<b>🏷️ Тег:</b> {university_data.baseInfo.universityTag}\n\n"
        f"{contacts_text}\n"
        f"<b>📍 Адрес:</b> {university_data.baseInfo.address}\n"
        f"<b>📌 ID запроса:</b> {request_id}"
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
            
            
async def main() -> None:
    await dp.start_polling(bot)


if __name__ == "__main__":
    try:
        logging.basicConfig(level=logging.INFO, stream=sys.stdout)
        asyncio.run(main())
    except KeyboardInterrupt:
        print('Bot shutting down..')