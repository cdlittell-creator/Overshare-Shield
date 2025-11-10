from fastapi import FastAPI, UploadFile, Form
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Allow frontend connections
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def home():
    return {"message": "OverShare Shield backend is running!"}

@app.post("/analyze/")
async def analyze_post(image: UploadFile = None, text: str = Form(None)):
    # Placeholder logic — AI will go here
    return {"risk_score": 0.42, "details": "Sample placeholder output"}
 


# ALLOW IMAGE UPLOADS /////////////////////////////
from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from PIL import Image
from PIL.ExifTags import TAGS
import io

app = FastAPI()

# Allow React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "Backend is working!"}


@app.post("/analyze-image/")
async def analyze_image(file: UploadFile = File(...)):
    contents = await file.read()

    # Try to extract EXIF metadata
    try:
        image = Image.open(io.BytesIO(contents))
        exif_data = image._getexif()
        metadata = {}

        if exif_data:
            for tag, value in exif_data.items():
                tag_name = TAGS.get(tag, tag)
                metadata[tag_name] = str(value)
        else:
            metadata = {"info": "No EXIF metadata found"}

        return {"filename": file.filename, "metadata": metadata}

    except Exception as e:
        return {"error": str(e)}

#ALLOW TEXT ANALYSIS /////////////////////////////////
import re

@app.post("/analyze-text/")
async def analyze_text(text: str):
    """
    Analyzes user-provided text for possible oversharing indicators.
    Returns a list of findings and a simple risk score.
    """

    findings = []
    risk_score = 0

    # Define regex patterns for sensitive data
    patterns = {
        "email": r"\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b",
        "phone": r"\b(\+?\d{1,2}\s?)?(\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4})\b",
        "address": r"\d{1,5}\s\w+(\s\w+)*\s(street|st|ave|avenue|road|rd|blvd|boulevard)\b",
        "date": r"\b(\d{1,2}[/-]\d{1,2}[/-]\d{2,4})\b",
        "name": r"\b([A-Z][a-z]+ [A-Z][a-z]+)\b",  # naive full-name pattern
    }

    # Check patterns
    for label, pattern in patterns.items():
        matches = re.findall(pattern, text)
        if matches:
            findings.append({label: matches})
            risk_score += len(matches) * 10

    # Keyword-based scanning (custom oversharing)
    keywords = ["work", "address", "home", "school", "hospital", "vacation", "travel", "passport"]
    for kw in keywords:
        if kw.lower() in text.lower():
            findings.append({"keyword": kw})
            risk_score += 5

    # Determine qualitative risk
    if risk_score >= 40:
        risk_level = "High"
    elif risk_score >= 20:
        risk_level = "Medium"
    else:
        risk_level = "Low"

    return {
        "text": text,
        "findings": findings,
        "risk_score": risk_score,
        "risk_level": risk_level
    }

