from database import models
from server import schemas
from sqlalchemy.orm import Session


# Get user model by id
def get_user(db: Session, user_id: int):
    return db.query(models.User).filter(models.User.id == user_id).first()


# Get user model by email
def get_user_by_email(db: Session, email: str):
    return db.query(models.User).filter(models.User.email == email).first()


# Adds a new user to the database with user entered usernam, email, password
def create_user(db: Session, user: schemas.UserCreate):
    fake_hashed_password = user.password + "notreallyhashed"
    db_user = models.User(username=user.username, email=user.email, hashed_password=fake_hashed_password)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user


# Gets a users pinned locations by user id
def get_pins_by_user_id(db: Session, user_id: int, limit: int = 100):
    return db.query(models.Pin).filter(models.User.id == user_id).limit(limit).all()


# Adds a new pinned location to the database
def create_user_pin(db: Session, pin: schemas.PinCreate):
    db_pin = models.Pin(**pin.dict())
    db.add(db_pin)
    db.commit()
    db.refresh(db_pin)
    return db_pin


# Deletes a pin from the database
def delete_pin(db: Session, pin_id: int, user_id: int):
    pin = db.query(models.Pin).filter(models.Pin.id == pin_id).first()
    if not pin or pin.owner_id != user_id:
        return False
    db.delete(pin)
    db.commit()
    return True


# Add a new friend relationship
def add_friend(db: Session, user: models.User, friend: models.User):
    user.friends.append(friend)
    # Add friend relationship in both directions (could be modified later to allow for pending friend requests)
    friend.friends.append(user)
    db.commit()
    return True


# Remove a friend relationship
def remove_friend(db: Session, user: models.User, friend: models.User):
    if friend not in user.friends or user not in friend.friends:
        return False
    user.friends.remove(friend)
    friend.friends.remove(user)
    db.commit()
    return True
