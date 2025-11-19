# נקודות קצה לאומדן נזקים
from fastapi import APIRouter, File, UploadFile, Depends, HTTPException, status
from app.auth.jwt import get_current_user, get_current_admin  # הוספת get_current_admin
from app.services.damage_model import analyze_image_dummy
from app.database.mongo import get_db
from datetime import datetime
from uuid import uuid4
import os

router = APIRouter(prefix="/api", tags=["Damage Estimation"])

# הגדרת תיקייה לשמירת קבצים שהועלו
UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

@router.post("/estimate")
async def estimate_damage(
    file: UploadFile = File(...),
    user: dict = Depends(get_current_user),  # שונה - כל משתמש מחובר יכול
):
    """אומדן נזקים - מקבלת תמונה ומחזירה ניתוח"""
    print(f"🔵 DEBUG: Estimate request received - filename: {file.filename}, user: {user.get('username')}, role: {user.get('role')}")
    
    try:
        # יצירת נתיב לשמירת הקובץ
        file_location = os.path.join(UPLOAD_FOLDER, file.filename)
        print(f"📁 DEBUG: Saving file to: {file_location}")

        # שמירת הקובץ שהועלה בתיקיית uploads
        with open(file_location, "wb") as f:
            content = await file.read()
            f.write(content)
            print(f"✅ DEBUG: File saved successfully - {len(content)} bytes")

        # הרצת מודל ניתוח הנזקים (כרגע דמה)
        print(f"🔍 DEBUG: Running damage analysis...")
        analysis = analyze_image_dummy(file_location)
        print(f"✅ DEBUG: Analysis complete - detected: {len(analysis.get('detected', []))} damages")

        # חיבור למסד הנתונים
        db = get_db()
        # יצירת מזהה ייחודי לאומדן
        estimate_id = str(uuid4())
        # שמירת זמן יצירת האומדן
        created_at = datetime.utcnow()

        # חישוב עלות התיקון הכוללת
        total_cost = 0
        if analysis and "detected" in analysis:
            total_cost = sum(d["repairCost"] for d in analysis["detected"])

        # יצירת מסמך אומדן לשמירה במסד הנתונים
        estimate_doc = {
            "_id": estimate_id,
            "filename": file.filename,
            "createdAt": created_at,
            "totalCost": total_cost,
        }

        # שמירת האומדן בקולקציית estimates
        db.estimates.insert_one(estimate_doc)
        print(f"✅ DEBUG: Estimate saved to DB - {estimate_id}")

        # יצירת רשימת מסמכי נזקים מהניתוח
        damage_docs = []
        if analysis and "detected" in analysis:
            for d in analysis["detected"]:
                damage_docs.append(
                    {
                        "estimateId": estimate_id,
                        "part": d["part"],
                        "severity": d["severity"],
                        "damageType": d["damageType"],
                        "bbox": d["bbox"],
                        "repairCost": d["repairCost"],
                    }
                )

        # שמירת כל אזורי הנזק בקולקציית damageRegions
        if damage_docs:
            db.damageRegions.insert_many(damage_docs)
            print(f"✅ DEBUG: {len(damage_docs)} damage regions saved")

        # החזרת התוצאה ללקוח
        result = {
            "estimateId": estimate_id,
            "filename": file.filename,
            "analysis": analysis,
            "totalCost": total_cost,
            "createdAt": created_at.isoformat() + "Z",
        }
        
        print(f"✅ DEBUG: Returning result")
        return result
        
    except Exception as e:
        print(f"❌ DEBUG: Error in estimate - {str(e)}")
        import traceback
        traceback.print_exc()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error processing estimate: {str(e)}"
        )
    return {
        "estimateId": estimate_id,
        "filename": file.filename,
        "analysis": analysis,
        "totalCost": total_cost,
        "createdAt": created_at.isoformat() + "Z",
    }


@router.get("/admin/estimates")
async def get_all_estimates(
    admin: dict = Depends(get_current_admin),
):
    """קבלת כל האומדנים - רק למנהלים"""
    print(f"🔵 DEBUG: Admin estimates request - admin: {admin.get('username')}")
    
    try:
        db = get_db()
        
        # שליפת כל האומדנים ממסד הנתונים
        estimates = list(db.estimates.find().sort("createdAt", -1))
        
        # המרת ObjectId ל-string עבור JSON
        for est in estimates:
            est["_id"] = str(est["_id"])
            if "createdAt" in est:
                est["createdAt"] = est["createdAt"].isoformat() + "Z"
        
        print(f"✅ DEBUG: Returning {len(estimates)} estimates")
        
        return {
            "estimates": estimates,
            "total": len(estimates)
        }
        
    except Exception as e:
        print(f"❌ DEBUG: Error fetching estimates - {str(e)}")
        import traceback
        traceback.print_exc()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error fetching estimates: {str(e)}"
        )
