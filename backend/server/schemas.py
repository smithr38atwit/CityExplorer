from pydantic import BaseModel


# --------- Pin Schemas ---------
class PinBase(BaseModel):
    name: str
    address: str
    longitude: float
    latitude: float
    date_logged: str | None = None
    thumbs_up: int = 0
    thumbs_down: int = 0
    feature_id: int
    creator_id: int


class PinCreate(PinBase):
    owner_id: int


class Pin(PinBase):
    class Config:
        orm_mode = True


# --------- User Schemas ---------
class UserBase(BaseModel):
    email: str


class UserCreate(UserBase):
    username: str
    password: str


class UserLogin(UserBase):
    password: str


# Schema for friends of user
class UserFriend(UserBase):
    username: str
    id: int
    pins: list[Pin] = []

    class Config:
        orm_mode = True


class User(UserBase):
    username: str
    id: int
    pins: list[Pin] = []
    friends: list[UserFriend] = []

    class Config:
        orm_mode = True
