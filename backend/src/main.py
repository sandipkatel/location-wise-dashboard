# FastAPI application entry point
from typing import Dict

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from mangum import Mangum
from src.core.settings import settings

from src.routers import items
 
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

app.include_router(items.router, prefix=f"{settings.API_V1_STR}/dataset", tags=["dash"])

@app.get("/")
def root() -> Dict[str, str]:
    return {"message": "Authentication API. Go to /docs for documentation."}

# Required for Vercel
handler = Mangum(app)