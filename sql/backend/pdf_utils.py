import io
from pypdf import PdfReader

def extract_text_from_pdf(file_content: bytes) -> str:
    """
    Extracts text from a raw PDF bytes stream cleanly.
    """
    try:
        pdf_file = io.BytesIO(file_content)
        reader = PdfReader(pdf_file)
        
        extracted_text = ""
        for page in reader.pages:
            page_text = page.extract_text()
            if page_text:
                extracted_text += page_text + "\n"
                
        return extracted_text.strip()
    except Exception as e:
        raise ValueError(f"Failed to parse PDF file: {str(e)}")