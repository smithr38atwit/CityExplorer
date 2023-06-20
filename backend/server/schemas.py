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
    fullname: str
    email: str


class UserCreate(UserBase):
    password: str


class User(UserBase):
    id: int
    pins: list[Pin] = []

    class Config:
        orm_mode = True
