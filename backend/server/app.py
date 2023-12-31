from database import crud, models
from database.database import SessionLocal, engine
from fastapi import Depends, FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from server import schemas
from sqlalchemy.orm import Session

models.Base.metadata.create_all(bind=engine)

app = FastAPI()

origins = [
    "http://localhost",
    "http://localhost:3000",
    "http://10.220.90.211:3000",
    "https://localhost:3000",
    "https://10.220.90.211:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Create a separate db session each time db is accessed, and close it when done
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@app.post("/register", response_model=schemas.User, status_code=201)
def create_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = crud.get_user_by_email(db, email=user.email)
    # Return 400 error if user already exists
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    return crud.create_user(db, user)


@app.post("/login", response_model=schemas.User)
async def login_user(user: schemas.UserLogin, db: Session = Depends(get_db)):
    # Check if the user exists
    db_user = crud.get_user_by_email(db, email=user.email)
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")

    # Check if the password is correct
    if db_user.hashed_password != (user.password + "notreallyhashed"):
        raise HTTPException(status_code=401, detail="Incorrect password")

    # Successful login
    return db_user


@app.post("/create_pin", response_model=schemas.Pin, status_code=201)
def create_user_pin(pin: schemas.PinCreate, db: Session = Depends(get_db)):
    return crud.create_user_pin(db, pin)


@app.post("/users/{user_id}/friend/{friend_email}", response_model=schemas.UserFriend, status_code=201)
def add_friend(user_id: int, friend_email: str, db: Session = Depends(get_db)):
    # Ensure friend and user exist
    friend = crud.get_user_by_email(db, email=friend_email)
    user = crud.get_user(db, user_id)
    if not friend and not user:
        raise HTTPException(status_code=404, detail="User not found")

    success = crud.add_friend(db, user, friend)

    if success:
        return friend
    else:
        raise HTTPException(status_code=500, detail="Error adding friend")


@app.delete("/users/{user_id}/friend/{friend_email}", status_code=204)
def remove_friend(user_id: int, friend_email: str, db: Session = Depends(get_db)):
    friend = crud.get_user_by_email(db, email=friend_email)
    user = crud.get_user(db, user_id)

    if not user or not friend:
        raise HTTPException(status_code=404, detail="User not found")

    success = crud.remove_friend(db, user, friend)

    if success:
        return
    else:
        raise HTTPException(status_code=400, detail="Users are not friends")


# ----------------------- CURRENTLY UNUSED END POINTS -----------------------

# @app.delete("/users/{user_id}/pins/{pin_id}", status_code=204)
# def delete_user_pin(user_id: int, pin_id: int, db: Session = Depends(get_db)):
#     deleted = crud.delete_pin(db, pin_id, user_id)
#     if deleted:
#         return {"message": "Pin successfully deleted"}
#     else:
#         raise HTTPException(
#             status_code=400,
#             detail="Pin could not be deleted, as it either belongs to another user or does not exist",
#         )


# @app.get("/users/{user_id}/pins/", response_model=list[schemas.Pin])
# def read_user_pins(user_id: int, limit: int = 100, db: Session = Depends(get_db)):
#     pins = crud.get_pins_by_user_id(db, user_id, limit)
#     return pins
