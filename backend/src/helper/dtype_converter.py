from typing import Any, Dict, List
import numpy as np
import pandas as pd

def convert_numpy_to_python(obj):
    """
    Recursively converts NumPy/Pandas types to native Python types.
    """
    if isinstance(obj, dict):
        return {key: convert_numpy_to_python(value) for key, value in obj.items()}
    elif isinstance(obj, list):
        return [convert_numpy_to_python(item) for item in obj]
    elif isinstance(obj, (np.integer, np.int64, np.int32, np.int16, np.int8)):
        return int(obj)
    elif isinstance(obj, (np.floating, np.float64, np.float32, np.float16)):
        return float(obj)
    elif isinstance(obj, np.ndarray):
        return obj.tolist()
    elif isinstance(obj, np.bool_):
        return bool(obj)
    elif pd.isna(obj):
        return None
    else:
        return obj
        
def convert_values(data: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    """Convert stringified JSON values to their real types."""
    converted = []
    for row in data:
        new_row = {}
        for key, value in row.items():
            if isinstance(value, str):
                # Try to convert to int
                try:
                    new_row[key] = int(value)
                    continue
                except ValueError:
                    pass
                # Try to convert to float
                try:
                    new_row[key] = float(value)
                    continue
                except ValueError:
                    pass
                # Check for boolean values
                if value.lower() == 'true':
                    new_row[key] = True
                    continue
                elif value.lower() == 'false':
                    new_row[key] = False
                    continue
                # Keep as string
                new_row[key] = value
            else:
                new_row[key] = value
        converted.append(new_row)
    return converted