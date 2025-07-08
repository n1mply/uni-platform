from aiogram import Bot, Dispatcher, types, F
from aiogram.types import InlineKeyboardMarkup, InlineKeyboardButton
from aiogram.enums.parse_mode import ParseMode
import os

from dotenv import load_dotenv
load_dotenv()

BOT_TOKEN = os.getenv("TELEGRAM_BOT_TOKEN")
ADMIN_CHAT_ID = int(os.getenv("TELEGRAM_ADMIN_CHAT_ID"))

bot = Bot(token=BOT_TOKEN)
dp = Dispatcher()



# Кнопки
def build_action_keyboard(university_tag: str):
    return InlineKeyboardMarkup(inline_keyboard=[
        [
            InlineKeyboardButton(
                text="✅ Одобрить",
                callback_data=f"approve:{university_tag}"
            ),
            InlineKeyboardButton(
                text="❌ Отклонить",
                callback_data=f"reject:{university_tag}"
            )
        ]
    ])

# Обработка кнопок
@dp.callback_query(F.data.startswith("approve:"))
async def approve_handler(callback: types.CallbackQuery):
    university_tag = str(callback.data.split(":")[1])
    await callback.answer("ВУЗ одобрен ✅")
    await callback.message.edit_reply_markup(reply_markup=None)
    await bot.send_message(
        callback.from_user.id,
        f"Заявка #{university_tag} была одобрена."
    )

@dp.callback_query(F.data.startswith("reject:"))
async def reject_handler(callback: types.CallbackQuery):
    university_tag = str(callback.data.split(":")[1])
    await callback.answer("ВУЗ отклонён ❌")
    await callback.message.edit_reply_markup(reply_markup=None)
    await bot.send_message(
        callback.from_user.id,
        f"Заявка #{university_tag} была отклонена."
    )

# Отправка уведомления о заявке
async def notify_about_university(university: dict):
    message = (
        f"🎓 <b>Новая заявка на регистрацию ВУЗа</b>\n\n"
        f"🏛️ <b>Название:</b> {university['full_name']}\n"
        f"🔖 <b>Тег:</b> {university['tag']}\n"
        f"📬 <b>Email:</b> {university['email']}\n"
        f"📍 <b>Адрес:</b> {university['address']}\n"
        f"🕒 <i>Создано: {university['created_at']}</i>"
    )

    await bot.send_message(
        chat_id=ADMIN_CHAT_ID,
        text=message,
        reply_markup=build_action_keyboard(university["tag"]),
        parse_mode=ParseMode.HTML
    )