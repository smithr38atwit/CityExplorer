from database import models
from server import schemas
from sqlalchemy.orm import Session


def get_user(db: Session, user_id: int):
    return db.query(models.User).filter(models.User.id == user_id).first()


def get_user_by_email(db: Session, email: str):
    return db.query(models.User).filter(models.User.email == email).first()


def create_user(db: Session, user: schemas.UserCreate):
    fake_hashed_password = user.password + "notreallyhashed"
    db_user = models.User(fullname=user.fullname, email=user.email, hashed_password=fake_hashed_password)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user


def get_pins_by_user_id(db: Session, user_id: int, limit: int = 100):
    return db.query(models.Pin).filter(models.User.id == user_id).limit(limit).all()


def create_user_pin(db: Session, pin: schemas.PinCreate, user_id: int):
    db_pin = models.Pin(**pin.dict(), owner_id=user_id)
    db.add(db_pin)
    db.commit()
    db.refresh(db_pin)
    return db_pin
