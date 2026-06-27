# backend/models.py

from datetime import datetime
from typing import List, Optional
from sqlmodel import Field, Relationship, SQLModel


# -------------------------------------------------------
# Many-to-many join table: evaluation <-> tag
# No extra columns needed — just the two foreign keys.
# -------------------------------------------------------
class EvaluationTag(SQLModel, table=True):
    evaluation_id: Optional[int] = Field(
        default=None, foreign_key="evaluation.id", primary_key=True
    )
    tag_id: Optional[int] = Field(
        default=None, foreign_key="tag.id", primary_key=True
    )


# -------------------------------------------------------
# Tag table
# -------------------------------------------------------
class Tag(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str = Field(unique=True, index=True)

    # back-reference: tag.evaluations → all evaluations with this tag
    evaluations: List["Evaluation"] = Relationship(
        back_populates="tags", link_model=EvaluationTag
    )


# -------------------------------------------------------
# Evaluation table  (one user → many evaluations)
# -------------------------------------------------------
class Evaluation(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)

    # Foreign key → user.id  (cascade delete not set — keep evals even if user gone)
    user_id: int = Field(foreign_key="user.id", index=True)

    resume: str
    job_description: str
    score: int                     # 0-100
    feedback: str

    created_at: datetime = Field(default_factory=datetime.utcnow)

    # Relationships
    user: Optional["User"] = Relationship(back_populates="evaluations")
    tags: List[Tag] = Relationship(
        back_populates="evaluations", link_model=EvaluationTag
    )


# -------------------------------------------------------
# User table
# -------------------------------------------------------
class User(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    email: str = Field(unique=True, index=True)
    hashed_password: str
    role: str = "user"

    # back-reference: user.evaluations → all evaluations by this user
    evaluations: List[Evaluation] = Relationship(back_populates="user")


# -------------------------------------------------------
# Request / Response models (Pydantic-only, no table=True)
# -------------------------------------------------------
class RegisterRequest(SQLModel):
    email: str
    password: str

class LoginRequest(SQLModel):
    email: str
    password: str

class RoleUpdate(SQLModel):
    role: str

class TagResponse(SQLModel):
    id: int
    name: str

class EvaluationResponse(SQLModel):
    id: int
    score: int
    feedback: str
    created_at: datetime
    tags: List[TagResponse] = []

class UserResponse(SQLModel):
    email: str
    role: str