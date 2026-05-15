from sqlalchemy.orm import Session
from app.models.category import Category
from app.schemas.category_schemas import CategoryCreate

def get_all_categories(db: Session):
    return db.query(Category).all()

def get_category_by_id(db: Session, category_id: int):
    return db.query(Category).filter(Category.id == category_id).first()

def create_category(db: Session, category_data: str):
    new_category = Category(name=category_data)
    db.add(new_category)
    db.commit()
    db.refresh(new_category)
    return new_category

def update_category(db: Session, category_id: int, new_name: str):
    db_category = db.query(Category).filter(Category.id == category_id).first()
    if db_category:
        db_category.name = new_name
        db.commit()
        db.refresh(db_category)
        return db_category
    return None

def delete_category(db: Session, category_id: int):
    category = db.query(Category).filter(Category.id == category_id).first()
    if category:
        db.delete(category)
        db.commit()
        return True
    return False