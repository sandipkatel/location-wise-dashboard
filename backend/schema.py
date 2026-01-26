from typing import List, Dict, Any
from pydantic import BaseModel

class DatasetRecord(BaseModel):
    """Pydantic model for dataset records with dynamic fields"""
    class Config:
        extra = 'allow'  # Allow additional fields

class DatasetResponse(BaseModel):
    """Response model for dataset operations"""
    data: List[Dict[str, Any]]