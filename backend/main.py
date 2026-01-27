# FastAPI application entry point
from typing import Any, Dict, List

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from mangum import Mangum
from settings import settings

from core import get_coordinates_for_json

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
    try:
        response = get_coordinates_for_json(data)
        print("Geocoding completed successfully.", response)
        return {
            "status": "success",
            "data": {"location_data": response}
        }
    except Exception as e:
        print("Error during geocoding:", str(e))
        return {
            "status": "error",
            "message": str(e)
        }


@app.get("/")
def root() -> Dict[str, str]:
    return {"message": "Authentication API. Go to /docs for documentation."}

# Required for Vercel
handler = Mangum(app)