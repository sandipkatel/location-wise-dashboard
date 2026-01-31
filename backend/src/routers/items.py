from fastapi import APIRouter
from typing import Any, Dict, List
from fastapi.encoders import jsonable_encoder
import numpy as np
import json

from src.services.core import get_coordinates_for_json
from src.services.analytical_data import get_analytical_data

router = APIRouter()

class NumpyEncoder(json.JSONEncoder):
    """Custom JSON encoder for NumPy types"""
    def default(self, obj):
        if isinstance(obj, np.integer):
            return int(obj)
        elif isinstance(obj, np.floating):
            return float(obj)
        elif isinstance(obj, np.ndarray):
            return obj.tolist()
        elif pd.isna(obj):
            return None
        return super().default(obj)

@router.post(f"/")
def read_incoming_csv(data: List[Dict[str, Any]]) -> Dict[str, Any]:
    """Handle parsed CSV data (array of objects)."""
    try:
        response = get_coordinates_for_json(data)
        significant_columns = response.columns.drop(['name', 'latitude', 'longitude']).tolist()
        if not significant_columns:
            raise ValueError("No numeric columns found for aggregation.")
            
        globe_df = response[['name', 'latitude', 'longitude', significant_columns[0]]].copy()
        globe_df = globe_df.rename(columns={significant_columns[0]: 'significantCol'})
        
        # Convert to dict first, then to JSON with custom encoder
        globe_data = json.loads(globe_df.to_json(orient='records'))

        analytical_data = get_analytical_data(data)
        
        # Convert all data using jsonable_encoder to handle numpy types 
        result = {
            "status": 200,
            "data": {
                "globe_data": globe_data,
                "significant_columns": significant_columns,
                "full_data": json.loads(response.to_json(orient='records')),
                "analytical_data": jsonable_encoder(analytical_data)  # This handles numpy types
            }
        }
        
        return result
        
    except Exception as e:
        print("Error during geocoding:", str(e))
        import traceback
        traceback.print_exc()  # Better error logging
        return {
            "status": 500,
            "statusText": str(e)
        }