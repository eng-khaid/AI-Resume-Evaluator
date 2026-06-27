# backend/main.py
# FastAPI application entry point
#
# Run with:  uvicorn main:app --reload
# Swagger:   http://localhost:8000/docs

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from database import create_db
from routers import admin, auth, evaluate

app = FastAPI(title="Resume Evaluator API", version="1.0.0")

# -------------------------------------------------------
# CORS — allow the React dev server to call this API
# -------------------------------------------------------
app.add_middleware(
    CORSMiddleware,
   # allow_origins=["http://localhost:5173"],  # Vite default port#
   allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# -----------------------------------------------------
# Routers
# -----------------------------------------------------
app.include_router(auth.router)           # /auth/register, /auth/login, /auth/me
app.include_router(admin.router)          # /admin/users, /admin/users/{email}/role
app.include_router(evaluate.router)       # /evaluate


# -------------------------------------------------------
# Startup — create DB tables if they don't exist
# -------------------------------------------------------
@app.on_event("startup")
def on_startup():
    """
    Runs once when uvicorn starts.
    create_db() calls SQLModel.metadata.create_all(engine) which
    creates every table that doesn't exist yet.
    Safe to call multiple times — won't touch existing tables.
    """
    create_db()


@app.get("/")
def root():
    return {"status": "ok", "message": "Resume Evaluator API is running"}
