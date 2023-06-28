from pydantic import BaseModel


class PinBase(BaseModel):
    title: str
    description: str | None = None
    latitude: float
    longitude: float


class PinCreate(PinBase):
    pass


class Pin(PinBase):
    id: int
    owner_id: int

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
