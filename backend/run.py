"""
נקודת כניסה להרצת השרת
"""
import sys
import os
from pathlib import Path

# הוספת תיקיית backend ל-Python path
backend_dir = Path(__file__).parent
sys.path.insert(0, str(backend_dir))

# גם להוסיף ל-PYTHONPATH כדי שuvicorn יראה את זה
os.environ['PYTHONPATH'] = str(backend_dir)

if __name__ == "__main__":
    print("🚀 Starting Crash2Cost server...")
    print(f"📁 Backend directory: {backend_dir}")
    print(f"📁 Working directory: {os.getcwd()}")
    
    try:
        # בדיקת imports
        print("📦 Loading modules...")
        from app.main import app
        print("✅ Modules loaded successfully")
        
        import uvicorn
        print("🌐 Starting uvicorn...")
        
        # שימוש ב-app object ישירות
        uvicorn.run(
            app,
            host="127.0.0.1",
            port=8001
        )
    except Exception as e:
        print(f"❌ Error starting server: {e}")
        import traceback
        traceback.print_exc()
        import traceback
        traceback.print_exc()
        input("\nPress Enter to exit...")

