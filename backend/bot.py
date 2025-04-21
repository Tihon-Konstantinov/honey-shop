from aiogram import Bot, Dispatcher, types
from aiogram.filters.command import Command
from aiogram.types import WebAppInfo
from config import BOT_TOKEN, WEBAPP_URL
from database import SessionLocal, create_order
import json
import logging

# Настройка логирования
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

# Инициализация бота и диспетчера
bot = Bot(token=BOT_TOKEN)
dp = Dispatcher()

# Обработчик команды /start
@dp.message(Command("start"))
async def cmd_start(message: types.Message):
    logger.debug(f"Получена команда /start от пользователя {message.from_user.id}")
    # Создаем кнопку для открытия веб-приложения
    keyboard = types.ReplyKeyboardMarkup(
        keyboard=[[
            types.KeyboardButton(
                text="Каталог",
                web_app=WebAppInfo(url=WEBAPP_URL)
            )
        ]],
        resize_keyboard=True
    )
    
    logger.debug("Отправляем приветственное сообщение")
    await message.answer(
        "Добро пожаловать в наш магазин Медовый домик! 🍯\n"
        "Мы собираем со своей пасеки не только вкуснейший мёд, "
        "но и создаем для вас подарочные наборы с мёдом, вареньем, "
        "чаем, орехами и сладостями.\n\n"
        "Нажмите на кнопку 'Каталог' чтобы начать покупки.",
        reply_markup=keyboard
    )

# Обработчик данных от веб-приложения
@dp.message(lambda message: message.web_app_data is not None)
async def handle_webapp_data(message: types.Message):
    try:
        # Получаем данные от веб-приложения
        data = json.loads(message.web_app_data.data)
        
        # Создаем сессию базы данных
        db = SessionLocal()
        
        # Добавляем информацию о пользователе
        order_data = {
            "user_id": message.from_user.id,
            "user_name": f"{message.from_user.first_name} {message.from_user.last_name or ''}".strip(),
            **data
        }
        
        # Создаем заказ
        order = create_order(db, order_data)
        
        # Отправляем подтверждение
        await message.answer(
            f"Спасибо за заказ! Ваш заказ №{order.id} успешно оформлен.\n"
            f"Сумма заказа: {order.total_amount} ₽\n"
            "В ближайшее время с вами свяжется менеджер."
        )
        
    except Exception as e:
        logging.error(f"Error processing order: {e}")
        await message.answer(
            "Извините, произошла ошибка при оформлении заказа. "
            "Пожалуйста, попробуйте позже или свяжитесь с поддержкой."
        )

# Функция запуска бота
async def main():
    await dp.start_polling(bot)

if __name__ == "__main__":
    import asyncio
    asyncio.run(main()) 