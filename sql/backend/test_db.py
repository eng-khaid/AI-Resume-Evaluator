# backend/test_db.py
# Day 3 — run this to verify your DB is working
# Usage:  python test_db.py   (from the backend/ directory)
#
# What it does:
#   1. Creates the DB tables (if missing)
#   2. Inserts a test user
#   3. Queries it back and prints it
#   4. Deletes the test user so it doesn't pollute the DB

from sqlmodel import Session, select

from database import create_db, engine
from models import User
from auth_utils import hash_password

# Make sure tables exist
create_db()

TEST_EMAIL = "test_script@example.com"

with Session(engine) as session:
    # Clean up any leftover test user from a previous run
    existing = session.exec(select(User).where(User.email == TEST_EMAIL)).first()
    if existing:
        session.delete(existing)
        session.commit()

    # INSERT
    user = User(email=TEST_EMAIL, hashed_password=hash_password("testpass123"))
    session.add(user)
    session.commit()
    session.refresh(user)  # populates user.id from the DB

    print(f"Inserted user — id={user.id}, email={user.email}, role={user.role}")

    # SELECT ONE
    fetched = session.exec(select(User).where(User.email == TEST_EMAIL)).first()
    print(f"Fetched user  — {fetched}")

    # SELECT ALL
    all_users = session.exec(select(User)).all()
    print(f"All users     — {len(all_users)} in DB")

    # .first() on no match returns None
    ghost = session.exec(select(User).where(User.email == "nobody@x.com")).first()
    print(f".first() miss — {ghost}")   # None

    # DELETE
    session.delete(fetched)
    session.commit()
    print("Test user deleted. DB is clean.")
