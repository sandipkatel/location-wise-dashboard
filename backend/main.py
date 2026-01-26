# FastAPI application entry point
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from starlette.middleware.base import BaseHTTPMiddleware

import route
from settings import settings

from mangum import Mangum

# Initialize FastAPI app
app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    # allow_origins=[settings.FRONTEND_URI],
    allow_origins=[settings.FRONTEND_URI],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["Set-Cookie"],
)

app.include_router(route.router, prefix=f"{settings.API_V1_STR}/dataset", tags=["dataset"])

@app.get("/")
def root():
    return {"message": "Authentication API. Go to /docs for documentation."}

# Required for Vercel
handler = Mangum(app)