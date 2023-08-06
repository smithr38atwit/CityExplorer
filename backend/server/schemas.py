from pydantic import BaseModel


class PinBase(BaseModel):
    name: str
    address: str
    longitude: float
    latitude: float
    date_logged: str | None = None
    thumbs_up: int = 0
    thumbs_down: int = 0
    feature_id: int
    owner_id: int


class PinCreate(PinBase):
    pass


class Pin(PinBase):
    class Config:
        orm_mode = True


class UserBase(BaseModel):
    email: str


class UserCreate(UserBase):
    username: str
    password: str


class UserLogin(UserBase):
    password: str


class User(UserBase):
    username: str
    id: int
    pins: list[Pin] = []

    class Config:
        orm_mode = True
