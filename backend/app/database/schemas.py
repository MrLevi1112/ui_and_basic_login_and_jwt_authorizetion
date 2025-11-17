# מודלים עבור בקשות API
from pydantic import BaseModel, EmailStr

class LoginRequest(BaseModel):
    """מודל לבקשת התחברות"""
    username: str
    password: str

class SignupRequest(BaseModel):
    """מודל לבקשת רישום משתמש חדש"""
    username: str
    password: str
    email: EmailStr  # ולידציה אוטומטית לפורמט אימייל

class TokenResponse(BaseModel):
    """מודל לתשובת טוקן"""
    access_token: str
    token_type: str
    role: str
    username: str
