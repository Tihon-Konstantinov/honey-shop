from sqlalchemy import create_engine, Column, Integer, String, Float, ForeignKey, DateTime
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, relationship
from datetime import datetime
from config import DATABASE_URL

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

class Product(Base):
    __tablename__ = "products"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    description = Column(String)
    price = Column(Float)
    image_url = Column(String)
    category = Column(String)

class Order(Base):
    __tablename__ = "orders"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, index=True)
    user_name = Column(String)
    phone = Column(String)
    email = Column(String)
    address = Column(String)
    total_amount = Column(Float)
    status = Column(String, default="new")
    created_at = Column(DateTime, default=datetime.utcnow)
    items = relationship("OrderItem", back_populates="order")

class OrderItem(Base):
    __tablename__ = "order_items"

    id = Column(Integer, primary_key=True, index=True)
    order_id = Column(Integer, ForeignKey("orders.id"))
    product_id = Column(Integer, ForeignKey("products.id"))
    quantity = Column(Integer)
    price = Column(Float)
    order = relationship("Order", back_populates="items")
    product = relationship("Product")

def init_db():
    Base.metadata.create_all(bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Функции для работы с продуктами
def get_products(db, skip: int = 0, limit: int = 100):
    return db.query(Product).offset(skip).limit(limit).all()

def get_product(db, product_id: int):
    return db.query(Product).filter(Product.id == product_id).first()

# Функции для работы с заказами
def create_order(db, order_data: dict):
    db_order = Order(
        user_id=order_data["user_id"],
        user_name=order_data["user_name"],
        phone=order_data["phone"],
        email=order_data["email"],
        address=order_data["address"],
        total_amount=order_data["total_amount"]
    )
    db.add(db_order)
    db.commit()
    db.refresh(db_order)
    
    for item in order_data["items"]:
        db_item = OrderItem(
            order_id=db_order.id,
            product_id=item["product_id"],
            quantity=item["quantity"],
            price=item["price"]
        )
        db.add(db_item)
    
    db.commit()
    return db_order 