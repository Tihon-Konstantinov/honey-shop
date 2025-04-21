from database import init_db, SessionLocal, Product

def init_products():
    db = SessionLocal()
    try:
        # Создаем тестовые продукты
        products = [
            {
                "name": 'Набор "Вкусные моменты"',
                "description": 'Весенний набор с мёдом и сладостями',
                "price": 1200,
                "image_url": 'https://example.com/images/product1.jpg',
                "category": 'all'
            },
            {
                "name": 'Набор "Сладкое желание"',
                "description": 'Подарочный набор с мёдом и чаем',
                "price": 1890,
                "image_url": 'https://example.com/images/product2.jpg',
                "category": 'women'
            },
            {
                "name": 'Набор "Большой сюрприз"',
                "description": 'Премиум набор с мёдом и деликатесами',
                "price": 3670,
                "image_url": 'https://example.com/images/product3.jpg',
                "category": 'all'
            },
            {
                "name": 'Набор "Карусель-1" с фруктами',
                "description": 'Подарочный набор с мёдом и сухофруктами',
                "price": 2540,
                "image_url": 'https://example.com/images/product4.jpg',
                "category": 'all'
            }
        ]

        for product_data in products:
            product = Product(**product_data)
            db.add(product)
        
        db.commit()
        print("Тестовые продукты успешно добавлены в базу данных")
    
    except Exception as e:
        print(f"Ошибка при добавлении продуктов: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    print("Инициализация базы данных...")
    init_db()
    print("Таблицы созданы успешно")
    print("Добавление тестовых продуктов...")
    init_products() 