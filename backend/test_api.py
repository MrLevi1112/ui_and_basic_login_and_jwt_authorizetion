"""
בדיקת תקינות API
"""
import requests
import json

def test_api_endpoints():
    """בדיקת כל נקודות הקצה"""
    base_url = "http://127.0.0.1:8000"
    
    print("=" * 60)
    print("🧪 בדיקת API endpoints")
    print("=" * 60)
    
    # 1. בדיקת נקודת test
    print("\n1️⃣ בודק /api/test...")
    try:
        response = requests.get(f"{base_url}/api/test")
        print(f"   Status: {response.status_code}")
        print(f"   Response: {response.json()}")
    except Exception as e:
        print(f"   ❌ Error: {e}")
    
    # 2. בדיקת signup
    print("\n2️⃣ בודק /api/signup...")
    try:
        import time
        signup_data = {
            "username": f"api_test_{int(time.time())}",
            "email": f"api_test_{int(time.time())}@test.com",
            "password": "test123"
        }
        response = requests.post(
            f"{base_url}/api/signup",
            json=signup_data,
            headers={"Content-Type": "application/json"}
        )
        print(f"   Status: {response.status_code}")
        if response.status_code == 200:
            data = response.json()
            print(f"   ✅ User created: {data.get('username')}")
            print(f"   Token: {data.get('access_token')[:20]}...")
            return data.get('access_token')
        else:
            print(f"   ❌ Error: {response.text}")
    except Exception as e:
        print(f"   ❌ Error: {e}")
        import traceback
        traceback.print_exc()
    
    # 3. בדיקת login
    print("\n3️⃣ בודק /api/login...")
    try:
        login_data = {
            "username": "admin",
            "password": "admin123"
        }
        response = requests.post(
            f"{base_url}/api/login",
            json=login_data,
            headers={"Content-Type": "application/json"}
        )
        print(f"   Status: {response.status_code}")
        if response.status_code == 200:
            data = response.json()
            print(f"   ✅ Login successful: {data.get('username')}")
            print(f"   Role: {data.get('role')}")
            print(f"   Token: {data.get('access_token')[:20]}...")
        else:
            print(f"   ❌ Error: {response.text}")
    except Exception as e:
        print(f"   ❌ Error: {e}")
    
    print("\n" + "=" * 60)
    print("✨ בדיקה הסתיימה")
    print("=" * 60)

if __name__ == "__main__":
    test_api_endpoints()
