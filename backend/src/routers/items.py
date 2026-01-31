from fastapi import APIRouter
from typing import Any, Dict, List


from src.services.core import get_coordinates_for_json

router = APIRouter()

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
        globe_data = globe_df.to_json(orient='records')
        return {
            "status": 200,
            "data": {"globe_data": globe_data,
                     "significant_columns": significant_columns,
                     "full_data": response.to_json(orient='records')}  
        }
    except Exception as e:
        print("Error during geocoding:", str(e))
        return {
            "status": 500,
            "statusText": str(e)
        }
