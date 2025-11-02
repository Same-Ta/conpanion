from fastapi import APIRouter, Header, HTTPException, status
from passlib.hash import bcrypt
from models.schemas import UserRegister, UserLogin
from config.database import supabase
import json
from pathlib import Path

router = APIRouter(prefix="/auth", tags=["인증"])

# Simple local fallback store for development when Supabase client is not available.
# Stores a list of user objects: {"user_id": ..., "password": ..., "onboarding_completed": bool}
DEV_USERS_FILE = Path(__file__).resolve().parent.parent.parent / "dev_users.json"


def _load_dev_users():
    if not DEV_USERS_FILE.exists():
        return []
    try:
        return json.loads(DEV_USERS_FILE.read_text(encoding="utf-8"))
    except Exception:
        return []


def _save_dev_users(users):
    DEV_USERS_FILE.write_text(json.dumps(users, ensure_ascii=False, indent=2), encoding="utf-8")


@router.post("/register", status_code=status.HTTP_201_CREATED)
async def register(user_data: UserRegister):
    """회원가입"""
    try:
        # If Supabase client is available, use it; otherwise fall back to a simple local JSON store
        if supabase:
            existing_user = supabase.table("users").select("*").eq("user_id", user_data.user_id).execute()
            if existing_user.data:
                raise HTTPException(
                    status_code=status.HTTP_409_CONFLICT,
                    detail={"error": "이미 존재하는 아이디입니다", "code": "DUPLICATE_USER_ID"}
                )

            hashed_password = bcrypt.hash(user_data.password)

            supabase.table("users").insert({
                "user_id": user_data.user_id,
                "password": hashed_password
            }).execute()

            supabase.table("user_specs").insert({
                "user_id": user_data.user_id,
                "onboarding_completed": False
            }).execute()

            return {
                "message": "회원가입이 완료되었습니다",
                "user_id": user_data.user_id
            }
        else:
            users = _load_dev_users()
            if any(u.get("user_id") == user_data.user_id for u in users):
                raise HTTPException(
                    status_code=status.HTTP_409_CONFLICT,
                    detail={"error": "이미 존재하는 아이디입니다", "code": "DUPLICATE_USER_ID"}
                )

            hashed_password = bcrypt.hash(user_data.password)
            users.append({
                "user_id": user_data.user_id,
                "password": hashed_password,
                "onboarding_completed": False
            })
            _save_dev_users(users)

            return {
                "message": "(dev) 회원가입이 완료되었습니다",
                "user_id": user_data.user_id
            }
    
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail={"error": str(e), "code": "BAD_REQUEST"}
        )


@router.post("/login")
async def login(credentials: UserLogin):
    """로그인"""
    try:
        if supabase:
            user = supabase.table("users").select("*").eq("user_id", credentials.user_id).execute()

            if not user.data or not bcrypt.verify(credentials.password, user.data[0]["password"]):
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail={"error": "아이디 또는 비밀번호가 올바르지 않습니다", "code": "UNAUTHORIZED"}
                )

            user_spec = supabase.table("user_specs").select("onboarding_completed").eq("user_id", credentials.user_id).execute()
            onboarding_completed = user_spec.data[0]["onboarding_completed"] if user_spec.data else False

            return {
                "message": "로그인 성공",
                "user_id": credentials.user_id,
                "onboarding_completed": onboarding_completed
            }
        else:
            users = _load_dev_users()
            matched = [u for u in users if u.get("user_id") == credentials.user_id]
            if not matched or not bcrypt.verify(credentials.password, matched[0]["password"]):
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail={"error": "아이디 또는 비밀번호가 올바르지 않습니다", "code": "UNAUTHORIZED"}
                )

            onboarding_completed = matched[0].get("onboarding_completed", False)
            return {
                "message": "(dev) 로그인 성공",
                "user_id": credentials.user_id,
                "onboarding_completed": onboarding_completed
            }
    
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail={"error": str(e), "code": "UNAUTHORIZED"}
        )
