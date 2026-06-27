# backend/routers/admin.py
# Admin endpoints — all protected by require_admin

from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select

from auth_utils import require_admin
from database import get_session
from models import Evaluation, EvaluationResponse, RoleUpdate, Tag, TagResponse, User, UserResponse

router = APIRouter(prefix="/admin", tags=["admin"])


@router.get("/users", response_model=list[UserResponse])
def list_users(
    _admin: User = Depends(require_admin),
    session: Session = Depends(get_session),
):
    users = session.exec(select(User)).all()
    return [UserResponse(email=u.email, role=u.role) for u in users]


@router.patch("/users/{email}/role")
def update_role(
    email: str,
    data: RoleUpdate,
    _admin: User = Depends(require_admin),
    session: Session = Depends(get_session),
):
    user = session.exec(select(User).where(User.email == email)).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    user.role = data.role
    session.add(user)
    session.commit()
    return {"message": f"Role updated to '{data.role}'"}


@router.delete("/users/{email}", status_code=status.HTTP_204_NO_CONTENT)
def delete_user(
    email: str,
    _admin: User = Depends(require_admin),
    session: Session = Depends(get_session),
):
    user = session.exec(select(User).where(User.email == email)).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    session.delete(user)
    session.commit()


# ------------------------------------------------------
# New: admin can view all evaluations and manage tags
# ------------------------------------------------------
@router.get("/evaluations", response_model=list[EvaluationResponse])
def list_evaluations(
    _admin: User = Depends(require_admin),
    session: Session = Depends(get_session),
):
    """Return every evaluation across all users, newest first."""
    evals = session.exec(
        select(Evaluation).order_by(Evaluation.created_at.desc())
    ).all()
    return [
        EvaluationResponse(
            id=e.id,
            score=e.score,
            feedback=e.feedback,
            created_at=e.created_at,
            tags=[TagResponse(id=t.id, name=t.name) for t in e.tags],
        )
        for e in evals
    ]


@router.get("/tags", response_model=list[TagResponse])
def list_tags(
    _admin: User = Depends(require_admin),
    session: Session = Depends(get_session),
):
    """Return all tags in the system."""
    tags = session.exec(select(Tag)).all()
    return [TagResponse(id=t.id, name=t.name) for t in tags]


@router.delete("/tags/{tag_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_tag(
    tag_id: int,
    _admin: User = Depends(require_admin),
    session: Session = Depends(get_session),
):
    tag = session.exec(select(Tag).where(Tag.id == tag_id)).first()
    if not tag:
        raise HTTPException(status_code=404, detail="Tag not found")
    session.delete(tag)
    session.commit()