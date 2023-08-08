from database.database import Base
from sqlalchemy import Column, Float, ForeignKey, Integer, String, Table
from sqlalchemy.orm import relationship

# Association table for the many-to-many relationship between users representing friends
user_friends = Table(
    "user_friends",
    Base.metadata,
    Column("user_id", ForeignKey("users.id"), primary_key=True),
    Column("friend_id", ForeignKey("users.id"), primary_key=True),
)


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)

    pins = relationship("Pin", back_populates="owner", foreign_keys="Pin.owner_id")

    friends = relationship(
        "User",  # Self-referential relationship to represent friends
        secondary="user_friends",  # The association table for the many-to-many relationship
        primaryjoin=(id == user_friends.c.user_id),
        secondaryjoin=(id == user_friends.c.friend_id),
        # back_populates="friend_of",
    )

    # Relationship for users who have added this user as a friend (unused)
    # friend_of = relationship(
    #     "User",
    #     secondary="user_friends",
    #     primaryjoin=(id == user_friends.c.friend_id),
    #     secondaryjoin=(id == user_friends.c.user_id),
    #     back_populates="friends",
    # )


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
    creator_id = Column(Integer, ForeignKey("users.id"))

    owner = relationship("User", back_populates="pins", foreign_keys=[owner_id])
