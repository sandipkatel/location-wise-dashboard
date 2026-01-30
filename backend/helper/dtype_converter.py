from typing import Any, Dict, List

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