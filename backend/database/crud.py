from database import models
from server import schemas
from sqlalchemy.orm import Session


def get_user(db: Session, user_id: int):
    return db.query(models.User).filter(models.User.id == user_id).first()


def get_user_by_email(db: Session, email: str):
    return db.query(models.User).filter(models.User.email == email).first()


def get_all_users(db: Session, limit: int = 100):
    return db.query(models.User).limit(limit).all()


def create_user(db: Session, user: schemas.UserCreate):
    fake_hashed_password = user.password + "notreallyhashed"
    db_user = models.User(username=user.username, email=user.email, hashed_password=fake_hashed_password)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user


def get_pins_by_user_id(db: Session, user_id: int, limit: int = 100):
    return db.query(models.Pin).filter(models.User.id == user_id).limit(limit).all()


def create_user_pin(db: Session, pin: schemas.PinCreate):
    db_pin = models.Pin(**pin.dict())
    db.add(db_pin)
    db.commit()
    db.refresh(db_pin)
    return db_pin


def delete_pin(db: Session, pin_id: int, user_id: int):
    pin = db.query(models.Pin).filter(models.Pin.id == pin_id).first()
    if not pin or pin.owner_id != user_id:
        return False
    db.delete(pin)
    db.commit()
    return True
