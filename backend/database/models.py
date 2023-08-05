from database.database import Base
from sqlalchemy import Column, Float, ForeignKey, Integer, String
from sqlalchemy.orm import relationship


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)

    pins = relationship("Pin", back_populates="owner")


class Pin(Base):
    __tablename__ = "pins"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    address = Column(String, index=True)
    longitude = Column(Float, index=True)
    latitude = Column(Float, index=True)
    date_logged = Column(String)
    thumbs_up = Column(Integer, default=0)
    thumbs_down = Column(Integer, default=0)
    feature_id = Column(Integer, index=True)
    owner_id = Column(Integer, ForeignKey("users.id"))

    owner = relationship("User", back_populates="pins")
