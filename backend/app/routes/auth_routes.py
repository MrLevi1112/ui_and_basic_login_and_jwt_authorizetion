# נקודות קצה לאימות - לוגין ורישום
from fastapi import APIRouter, HTTPException, status
from app.database.schemas import LoginRequest, SignupRequest, TokenResponse
from app.auth.auth_service import create_user, authenticate_user
from app.auth.jwt import create_access_token

router = APIRouter(prefix="/api", tags=["Authentication"])

@router.post("/signup", response_model=TokenResponse)
def signup(req: SignupRequest):
    """רישום משתמש חדש"""
    print(f"🔵 DEBUG: Signup request received - username: {req.username}, email: {req.email}")
    
    try:
        # יצירת המשתמש
        user = create_user(
            username=req.username,
            email=req.email,
            password=req.password,
            role="user"
        )
        
        print(f"✅ DEBUG: User created successfully - {user['username']}")
        
        # יצירת טוקן
        token = create_access_token(
            {"sub": user["username"], "role": user["role"]}
        )
        
        response = {
            "access_token": token,
            "token_type": "bearer",
            "role": user["role"],
            "username": user["username"],
        }
        
        print(f"✅ DEBUG: Returning response with token")
        return response
        
    except HTTPException as e:
        print(f"❌ DEBUG: HTTPException - {e.detail}")
        raise
    except Exception as e:
        print(f"❌ DEBUG: Unexpected error - {str(e)}")
        import traceback
        traceback.print_exc()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Unexpected error: {str(e)}"
        )

@router.post("/login", response_model=TokenResponse)
def login(req: LoginRequest):
    """התחברות למערכת"""
    print(f"🔵 DEBUG: Login request received - username: {req.username}")
    
    try:
        # אימות משתמש
        user = authenticate_user(req.username, req.password)
        
        if not user:
            print(f"❌ DEBUG: Authentication failed for {req.username}")
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="incorrect username or password",
            )
        
        print(f"✅ DEBUG: User authenticated - {user['username']}, role: {user.get('role', 'user')}")
        
        # יצירת טוקן
        token = create_access_token(
            {"sub": user["username"], "role": user.get("role", "user")}
        )
        
        response = {
            "access_token": token,
            "token_type": "bearer",
            "role": user.get("role", "user"),
            "username": user["username"],
        }
        
        print(f"✅ DEBUG: Returning response with token")
        return response
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"❌ DEBUG: Unexpected error - {str(e)}")
        import traceback
        traceback.print_exc()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Unexpected error: {str(e)}"
        )
