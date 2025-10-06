import asyncio
import logging
import sys
from aiogram import Bot, Dispatcher, types
from aiogram.filters import Command
from aiogram.types import InlineKeyboardButton, InlineKeyboardMarkup
from aiogram.client.default import DefaultBotProperties
from aiogram.enums import ParseMode
from database.read import get_requests, get_request_by_id
from db import AsyncSessionLocal
from core.config import settings
from services.request_service import approve_request_service, reject_request_service

bot = Bot(token=settings.TELEGRAM_BOT_TOKEN, default=DefaultBotProperties(parse_mode=ParseMode.HTML))
dp = Dispatcher()


@dp.message(Command("start"))
async def start_command(message: types.Message):
    if message.chat.id == settings.TELEGRAM_ADMIN_CHAT_ID:
        await message.answer("Админ-панель готова к работе!")

@dp.message(Command("requests"))
async def start_command(message: types.Message):
    await message.answer("🔨 Проверяю заявки...")
    async with AsyncSessionLocal() as session:
        try:
            requests = await get_requests(session)
            for req in requests:
                
            
                contacts_text = f"<b>🔗 Контакты:</b>\n"
                emoji_dict = {
                    'email' : '✉️',
                    'phone' : '📞'
                }


                for contact in req.data['baseInfo']['contacts']:
                    contacts_text+=f"  <b>{contact['name']}</b>\n"
                    contacts_text+=f"    {emoji_dict[contact['type']]} {contact['value']}\n"
    
                message_text = (
                "<b>📝 Новая заявка на создание ВУЗа</b>:\n\n"
                f"<b>🏛️ Полное название:</b> {req.data['baseInfo']['fullName']}\n"
                f"<b>🔖 Короткое название:</b> {req.data['baseInfo']['shortName']}\n"
                f"<b>🏷️ Тег:</b> {req.data['baseInfo']['universityTag']}\n\n"
                f"{contacts_text}\n"
                f"<b>📍 Адрес:</b> {req.data['baseInfo']['address']}\n"
                f"<b>📌 ID запроса:</b> {req.id}"
                )
                
                keyboard = InlineKeyboardMarkup(inline_keyboard=[
        [
            InlineKeyboardButton(text="✅ Принять", callback_data=f"approve_{req.id}"),
            InlineKeyboardButton(text="❌ Отклонить", callback_data=f"reject_{req.id}")
        ]
    ])

                await bot.send_message(
                        chat_id=settings.TELEGRAM_ADMIN_CHAT_ID,
                        text=message_text or 'Нет заявок',
                        reply_markup=keyboard
                    )
                
        except Exception as e:
            await message.answer(f"❌ Ошибка: {e}")
            print(e)


async def send_university_request(request_id: int):
    async with AsyncSessionLocal() as session:
        try:
            req = await get_request_by_id(session, id=request_id)
                
            contacts_text = f"<b>🔗 Контакты:</b>\n"
            emoji_dict = {
                'email' : '✉️',
                'phone' : '📞'
            }
    
            for contact in req.data['baseInfo']['contacts']:
                    contacts_text+=f"  <b>{contact['name']}</b>\n"
                    contacts_text+=f"    {emoji_dict[contact['type']]} {contact['value']}\n"
    
            message_text = (
                "<b>📝 Новая заявка на создание ВУЗа</b>:\n\n"
                f"<b>🏛️ Полное название:</b> {req.data['baseInfo']['fullName']}\n"
                f"<b>🔖 Короткое название:</b> {req.data['baseInfo']['shortName']}\n"
                f"<b>🏷️ Тег:</b> {req.data['baseInfo']['universityTag']}\n\n"
                f"{contacts_text}\n"
                f"<b>📍 Адрес:</b> {req.data['baseInfo']['address']}\n"
                f"<b>📌 ID запроса:</b> {req.id}"
                )

    
            keyboard = InlineKeyboardMarkup(inline_keyboard=[
        [
            InlineKeyboardButton(text="✅ Принять", callback_data=f"approve_{req.id}"),
            InlineKeyboardButton(text="❌ Отклонить", callback_data=f"reject_{req.id}")
        ]
    ])
    
            await bot.send_message(
                chat_id=settings.TELEGRAM_ADMIN_CHAT_ID,
                text=message_text,
                reply_markup=keyboard
    )
        except Exception as e:
            await bot.send_message(
                chat_id=settings.TELEGRAM_ADMIN_CHAT_ID,
                text=f"❌ Ошибка: {e}"
                )

@dp.callback_query(lambda c: c.data.startswith('approve_') or c.data.startswith('reject_'))
async def handle_approval(callback_query: types.CallbackQuery):
    request_id = int(callback_query.data.split('_')[1])
    action = callback_query.data.split('_')[0]

    async with AsyncSessionLocal() as session: 
        try:
            # Получаем запрос для формирования сообщения
            request = await get_request_by_id(session, id=request_id)
            
            if not request:
                await callback_query.answer("Заявка не найдена!")
                return
            
            if action == "approve":
                # Используем сервисную функцию
                approved_request = await approve_request_service(request_id, session)
                response_text = f"✅ Заявка ВУЗа одобрена!"
            else:
                # Используем сервисную функцию
                rejected_request = await reject_request_service(request_id, session)
                response_text = f"❌ Заявка ВУЗа отклонена!"
            
            await callback_query.message.edit_text(
                text=f"🔄 {response_text}",
                reply_markup=None
            )
            await callback_query.answer(response_text)
            
        except Exception as e:
            await session.rollback()
            await callback_query.answer(f"Ошибка: {str(e)}")
            
            
async def main() -> None:
    await dp.start_polling(bot)


if __name__ == "__main__":
    try:
        logging.basicConfig(level=logging.INFO, stream=sys.stdout)
        asyncio.run(main())
    except KeyboardInterrupt:
        print('Bot shutting down..')