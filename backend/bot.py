# bot.py
from aiogram import Bot, Dispatcher, types
from aiogram.filters import Command
from aiogram.types import InlineKeyboardButton, InlineKeyboardMarkup
from core.config import settings

bot = Bot(token=settings.TELEGRAM_BOT_TOKEN)
dp = Dispatcher()

pending_requests = {}

@dp.message(Command("start"))
async def start_command(message: types.Message):
    if message.chat.id == settings.TELEGRAM_ADMIN_CHAT_ID:
        await message.answer("Админ-панель готова к работе!")

async def send_university_request(university_data: dict):
    university_id = university_data["id"]
    message_text = (
        "📝 Новая заявка на создание ВУЗа:\n\n"
        f"🏛️ Полное название: {university_data['full_name']}\n"
        f"🔖 Короткое название: {university_data['short_name']}\n"
        f"🏷️ Тег: {university_data['university_tag']}\n"
        f"📍 Адрес: {university_data['address']}\n"
        f"📌 ID: {university_id}"
    )
    
    keyboard = InlineKeyboardMarkup(inline_keyboard=[
        [
            InlineKeyboardButton(text="✅ Принять", callback_data=f"approve_{university_id}"),
            InlineKeyboardButton(text="❌ Отклонить", callback_data=f"reject_{university_id}")
        ]
    ])
    
    pending_requests[university_id] = university_data
    
    await bot.send_message(
        chat_id=settings.TELEGRAM_ADMIN_CHAT_ID,
        text=message_text,
        reply_markup=keyboard
    )

@dp.callback_query(lambda c: c.data.startswith('approve_') or c.data.startswith('reject_'))
async def handle_approval(callback_query: types.CallbackQuery):
    university_id = int(callback_query.data.split('_')[1])
    action = callback_query.data.split('_')[0]
    
    if university_id not in pending_requests:
        await callback_query.answer("Заявка не найдена!")
        return
    
    university_data = pending_requests[university_id]
    
    if action == "approve":
        response_text = f"✅ Заявка ВУЗа {university_data['full_name']} одобрена!"
        # Здесь можно добавить логику обновления статуса в БД
    else:
        response_text = f"❌ Заявка ВУЗа {university_data['full_name']} отклонена!"
        # Здесь можно добавить логику удаления/отмены заявки
    
    # Удаляем из временного хранилища
    del pending_requests[university_id]
    
    await callback_query.message.edit_text(
        text=f"🔄 {callback_query.message.text}\n\n{response_text}",
        reply_markup=None
    )
    await callback_query.answer(response_text)