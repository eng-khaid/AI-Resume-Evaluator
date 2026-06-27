import os
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

def evaluate_resume(job_description: str, prompt: str, resume_text: str) -> str:
    """
    Sends the extracted text to ChatGPT (gpt-4o-mini) and returns a formatted Markdown evaluation.
    """
    system_instruction = (
        "You are an expert Senior Technical Recruiter. "
        "Analyze the provided Resume against the Job Description. "
        "Output a professional feedback report formatted strictly in Markdown including:\n"
        "1. ## Match Score: (e.g., 80%)\n"
        "2. ## Key Strengths:\n"
        "3. ## Critical Gaps:\n"
        "4. ## Actionable Recommendations:"
    )
    
    user_content = f"Job Description:\n{job_description}\n\nCustom Instructions:\n{prompt}\n\nResume Text:\n{resume_text}"
    
    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {"role": "system", "content": system_instruction},
            {"role": "user", "content": user_content}
        ],
        temperature=0.7
    )
    
    return response.choices[0].message.content