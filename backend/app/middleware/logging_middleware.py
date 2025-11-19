import time
from fastapi import Request

async def log_requests(request: Request, call_next):
    start_time = time.time()
    print(f"\n{'='*60}")
    print(f"📥 {request.method} {request.url.path}")
    print(f"   Origin: {request.headers.get('origin', 'N/A')}")
    print(f"   User-Agent: {request.headers.get('user-agent', 'N/A')[:50]}...")
    
    response = await call_next(request)
    
    duration = time.time() - start_time
    print(f"📤 Response: {response.status_code} ({duration:.2f}s)")
    print(f"{'='*60}\n")
    
    return response
