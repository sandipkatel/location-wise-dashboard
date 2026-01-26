# FastAPI application entry point
from typing import Any, Dict, List

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from mangum import Mangum
from settings import settings

# Initialize FastAPI app
app = FastAPI(title=settings.PROJECT_NAME)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post(f"{settings.API_V1_STR}/dataset/")
def read_incoming_csv(data: List[Dict[str, Any]]) -> Dict[str, Any]:
    """Handle parsed CSV data (array of objects)."""
    return {
        "status": "success",
         "data":[
            { "name": "New York", "lat": 40.7128, "lng": -74.006 },
            { "name": "London", "lat": 51.5074, "lng": -0.1278 },
            { "name": "Tokyo", "lat": 35.6762, "lng": 139.6503 },
        ]
   }


@app.get("/")
def root() -> Dict[str, str]:
    return {"message": "Authentication API. Go to /docs for documentation."}

# Required for Vercel
handler = Mangum(app)