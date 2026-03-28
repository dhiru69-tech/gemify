from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.orm import Session
from datetime import datetime, timezone, timedelta
from app.database import get_db
from app.models.user import User
from app.schemas.user import UserRegister, UserLogin, TokenResponse, UserPublic, RefreshRequest
from app.core.security import hash_password, verify_password, create_access_token, create_refresh_token, decode_token
from slowapi import Limiter
from slowapi.util import get_remote_address

router  = APIRouter(prefix="/auth", tags=["Auth"])
limiter = Limiter(key_func=get_remote_address)

def get_current_user(request: Request, db: Session = Depends(get_db)) -> User:
    auth = request.headers.get("Authorization", "")
    if not auth.startswith("Bearer "):
        raise HTTPException(401, "Authentication required")
    payload = decode_token(auth.split(" ")[1])
    if not payload or payload.get("type") != "access":
        raise HTTPException(401, "Invalid or expired token")
    user = db.query(User).filter(User.id == int(payload["sub"])).first()
    if not user or not user.is_active:
        raise HTTPException(401, "User not found")
    return user

@router.post("/register", response_model=UserPublic, status_code=201)
@limiter.limit("10/minute")
async def register(request: Request, body: UserRegister, db: Session = Depends(get_db)):
    if db.query(User).filter(User.username == body.username).first():
        raise HTTPException(400, "Username already taken")
    if db.query(User).filter(User.email == body.email).first():
        raise HTTPException(400, "Email already registered")
    user = User(username=body.username, email=body.email, hashed_password=hash_password(body.password))
    db.add(user)
    db.commit()
    db.refresh(user)
    return user

@router.post("/login", response_model=TokenResponse)
@limiter.limit("10/minute")
async def login(request: Request, body: UserLogin, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.username == body.username).first()
    if user and user.locked_until and user.locked_until > datetime.now(timezone.utc):
        mins = int((user.locked_until - datetime.now(timezone.utc)).total_seconds() / 60)
        raise HTTPException(403, f"Account locked for {mins} more minutes")
    if not user or not verify_password(body.password, user.hashed_password):
        if user:
            user.failed_attempts += 1
            if user.failed_attempts >= 5:
                user.locked_until = datetime.now(timezone.utc) + timedelta(minutes=15)
            db.commit()
        raise HTTPException(401, "Invalid username or password")
    if user.is_banned:
        raise HTTPException(403, "Account suspended")
    user.failed_attempts = 0
    user.locked_until = None
    user.last_active = datetime.now(timezone.utc)
    db.commit()
    td = {"sub": str(user.id), "username": user.username}
    return TokenResponse(access_token=create_access_token(td), refresh_token=create_refresh_token(td))

@router.post("/refresh", response_model=TokenResponse)
async def refresh(body: RefreshRequest, db: Session = Depends(get_db)):
    payload = decode_token(body.refresh_token)
    if not payload or payload.get("type") != "refresh":
        raise HTTPException(401, "Invalid refresh token")
    user = db.query(User).filter(User.id == int(payload["sub"])).first()
    if not user or not user.is_active:
        raise HTTPException(401, "User not found")
    td = {"sub": str(user.id), "username": user.username}
    return TokenResponse(access_token=create_access_token(td), refresh_token=create_refresh_token(td))
