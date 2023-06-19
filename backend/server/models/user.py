from pydantic import BaseModel, EmailStr


class Pin(BaseModel):
    title: str
    latitude: float
    longitude: float


class UserSchema(BaseModel):
    fullname: str
    email: EmailStr
    pinned_locations: list[Pin]
