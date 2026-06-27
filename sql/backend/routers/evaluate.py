from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
# الاستدعاء مباشر لأن الملفات موجودة في المجلد الأب مباشرة بجانب main.py
from pdf_utils import extract_text_from_pdf
from llm import evaluate_resume

router = APIRouter(
    prefix="/evaluate",
    tags=["Evaluation"]
)

@router.post("/")
async def process_evaluation(
    job_description: str = Form(...),
    prompt: str = Form(""),
    resume: UploadFile = File(...)
):
    # 1. التأكد من صيغة الملف
    if resume.content_type != "application/pdf":
        raise HTTPException(status_code=400, detail="Only PDF files are accepted.")
        
    # 2. قراءة واستخراج النص
    file_content = await resume.read()
    resume_text = extract_text_from_pdf(file_content)
    
    # 3. التحقق من أن الـ PDF يحتوي على نصوص وليس صورة ممسوحة
    if not resume_text:
        raise HTTPException(
            status_code=422, 
            detail="Could not extract text from PDF. Ensure it is text-based and not a scanned image."
        )
        
    # 4. إرسال للذكاء الاصطناعي
    try:
        evaluation_result = evaluate_resume(job_description, prompt, resume_text)
        return {"status": "success", "data": evaluation_result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"OpenAI error: {str(e)}")