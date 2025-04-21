# Медовый домик - Telegram Bot

Telegram-бот для интернет-магазина "Медовый домик" с возможностью просмотра каталога товаров и оформления заказов через Web App.

## Требования

- Python 3.8+
- PostgreSQL
- Node.js (для разработки фронтенда)

## Установка

1. Клонируйте репозиторий:
```bash
git clone https://github.com/yourusername/honey-shop-bot.git
cd honey-shop-bot
```

2. Создайте виртуальное окружение и установите зависимости:
```bash
python -m venv venv
source venv/bin/activate  # для Linux/Mac
# или
venv\Scripts\activate  # для Windows
pip install -r requirements.txt
```

3. Создайте файл .env в корневой директории проекта со следующими параметрами:
```
BOT_TOKEN=your_telegram_bot_token
WEBAPP_URL=your_webapp_url
DB_HOST=localhost
DB_PORT=5432
DB_NAME=honey_shop
DB_USER=your_db_user
DB_PASS=your_db_password
```

4. Создайте базу данных PostgreSQL:
```sql
CREATE DATABASE honey_shop;
```

## Запуск

1. Запустите бота:
```bash
python -m backend.bot
```

2. Разверните веб-приложение на вашем сервере и укажите URL в .env файле.

## Структура проекта

```
tgbot/
├── backend/
│   ├── __init__.py
│   ├── bot.py
│   ├── database.py
│   └── config.py
├── frontend/
│   ├── index.html
│   ├── css/
│   │   └── style.css
│   └── js/
│       └── app.js
├── requirements.txt
└── README.md
```

## Функциональность

- Команда /start для начала работы с ботом
- Каталог товаров с категориями
- Корзина покупок
- Оформление заказа с выбором способа доставки и оплаты
- Интеграция с базой данных PostgreSQL

## Разработка

1. Для разработки фронтенда используйте любой локальный сервер:
```bash
python -m http.server 8000
```

2. Для тестирования Web App в Telegram используйте HTTPS. Можно использовать ngrok:
```bash
ngrok http 8000
```

## Лицензия

MIT 