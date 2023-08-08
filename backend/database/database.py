from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import DeclarativeBase, sessionmaker

# Path to database file
SQLALCHEMY_DATABASE_URL = "sqlite:///backend/sql_db.db"

# Start the database session; allows for connection to database file through sqlalchemy
engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base class for db table models
Base: DeclarativeBase = declarative_base()
