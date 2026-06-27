# backend/database.py
# Day 2 — SQLite: create the real database
# -------------------------------------------------------
# The engine is created once at module level.
# get_session is a FastAPI dependency — it opens a fresh
# Session for each request and closes it automatically.

from sqlmodel import SQLModel, create_engine, Session

DATABASE_URL = "sqlite:///./resume_evaluator.db"

# echo=True prints every SQL statement to the console.
# Useful for learning; set to False in production.
engine = create_engine(DATABASE_URL, echo=True)


def create_db() -> None:
    """
    Create all tables that are defined by SQLModel models
    and do not yet exist in the database.

    Safe to call multiple times — it never drops or alters
    existing tables (for that you would need Alembic migrations).
    """
    SQLModel.metadata.create_all(engine)


def get_session():
    """
    FastAPI dependency that provides a database Session.

    Why yield instead of return?
    yield pauses this generator and hands the session to the
    route handler. After the handler finishes (or raises),
    execution resumes here and the 'with' block closes the
    session — guaranteed cleanup even on exceptions.
    """
    with Session(engine) as session:
        yield session
