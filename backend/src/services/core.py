from geopy.geocoders import Nominatim
from geopy.exc import GeocoderTimedOut, GeocoderServiceError
import pandas as pd
import time
import re
import io
from src.helper.dtype_converter import convert_values


def get_major_location_column(jsonData):
    """
    Analyzes a JSON Data and returns the major location-related column.
    
    Args:
        jsonData (list): JSON data from frontend (list of dicts).
        
    Returns:
        string: The name of the major location-related column, or None if not found.
    """
    # Create DataFrame from list of dicts
    df = pd.DataFrame(jsonData)
    # Location keywords with priority (higher = more specific/major)
    location_keywords = {
        'country': 5,
        'nation': 5,
        'city': 4,
        'town': 4,
        'municipality': 4,
        'state': 3,
        'province': 3,
        'region': 2,
        'county': 2,
        'district': 2,
        'zip': 1,
        'postal': 1,
        'location': 3,
        'place': 2,
        'address': 1
    }
    
    location_cols = []
    
    # Identify potential location columns
    for col in df.columns:
        col_lower = col.lower().strip()
        
        # Check if column name contains location keywords
        for keyword, priority in location_keywords.items():
            if keyword in col_lower:
                # Calculate uniqueness ratio (more unique = more specific location)
                uniqueness = df[col].nunique() / len(df) if len(df) > 0 else 0
                
                # Calculate fill rate (non-null percentage)
                fill_rate = df[col].notna().sum() / len(df) if len(df) > 0 else 0
                
                # Score = priority + uniqueness bonus + fill rate bonus
                score = priority + (uniqueness * 2) + (fill_rate * 1)
                
                location_cols.append({
                    'column': col,
                    'score': score,
                    'uniqueness': uniqueness,
                    'fill_rate': fill_rate
                })
                break
    
    # Return the column with highest score
    if location_cols:
        major_location = max(location_cols, key=lambda x: x['score'])
        
        return major_location['column']
    
    else:
        return None


def get_numeric_columns_after_location(df, location_column):
    """
    Finds numeric columns that appear after the location column.
    
    Args:
        df (DataFrame): The dataframe to analyze
        location_column (str): The name of the location column
        
    Returns:
        list: List of numeric column names that appear after the location column
    """
    if df is None or location_column not in df.columns:
        return []

    columns = df.columns.tolist()
    
    # Find the index of the location column
    try:
        location_idx = columns.index(location_column)
    except ValueError:
        return []
        
    # Get columns after the location column
    columns_after = columns[location_idx + 1:]
    # Filter for numeric columns
    numeric_cols = []
    for col in columns_after:
        # Check if column is numeric (int or float)
        if pd.api.types.is_numeric_dtype(df[col]):
            numeric_cols.append(col)
        else:
            print(f"Column '{col}' is not numeric")
    
    return numeric_cols


def get_location_coordinates(location_name, location_type='city'):
    """
    Gets longitude and latitude for a given location using Nominatim (OpenStreetMap).
    
    Args:
        location_name (str): Name of the location
        location_type (str): Type of location (city, country, state, etc.)
        
    Returns:
        dict: Contains 'location', 'latitude', 'longitude', 'display_name'
    """
    try:
        # Initialize geocoder with a user agent
        geolocator = Nominatim(user_agent="location_analyzer_app")
        
        # Add delay to respect rate limits (1 request per second for Nominatim)
        time.sleep(1)
        
        # Geocode the location
        location = geolocator.geocode(location_name, timeout=10)
        
        if location:
            return {
                'location': location_name,
                'latitude': location.latitude,
                'longitude': location.longitude
            }
        else:
            return {
                'location': location_name,
                'latitude': None,
                'longitude': None,
            }
            
    except (GeocoderTimedOut, GeocoderServiceError) as e:
        return {
            'location': location_name,
            'latitude': None,
            'longitude': None,
            'error_message': str(e)
        }


def get_coordinates_for_json(stringJsonData):
    """
    Adds latitude and longitude columns to a CSV based on location data,
    and aggregates numeric columns by location.
    
    Args:
        jsonData (list): JSON data from frontend containing location and numeric data.
        
    Returns:
        JSON: Locations with added latitude, longitude, and aggregated numeric data.
    """

    # Convert stringified values to proper types
    jsonData = convert_values(stringJsonData)
    # Auto-detect location column
    location_column = get_major_location_column(jsonData) 
    if location_column is None:
        raise ValueError("No location column found in data.")
    
    print(f"Using auto-detected column: {location_column}")
    
    # Create DataFrame
    df = pd.DataFrame(jsonData)
    
    # Detect numeric columns after location column
    numeric_columns = get_numeric_columns_after_location(df, location_column)
    df_grouped = df[[location_column] + numeric_columns].copy()
    if numeric_columns:
        print(f"Found numeric columns to aggregate: {numeric_columns}")
        
        # Group by location and sum numeric columns
        agg_dict = {col: 'sum' for col in numeric_columns}
        df_grouped = df.groupby(location_column, as_index=False).agg(agg_dict)
    else:
        print("No numeric columns found after location column")
    
    # Initialize coordinate columns
    df_grouped['latitude'] = None
    df_grouped['longitude'] = None
    
    # Get unique locations to minimize API calls
    unique_locations = df_grouped[location_column].dropna().unique()
    
    if len(unique_locations) > 100:
        raise ValueError("Too many unique locations (>100). Please reduce the dataset size.")

    if len(unique_locations) == 0:
        raise ValueError("No valid locations found in the location column.")
        
    location_cache = {}
        
    # Geocode unique locations
    for i, loc in enumerate(unique_locations, 1):
        print(f"Processing {i}/{len(unique_locations)}: {loc}")
        coords = get_location_coordinates(str(loc))
        location_cache[loc] = coords
    
    # Map coordinates back to dataframe
    for idx, row in df_grouped.iterrows():
        loc_value = row[location_column]
        if pd.notna(loc_value) and loc_value in location_cache:
            coords = location_cache[loc_value]
            df_grouped.at[idx, 'latitude'] = coords['latitude']
            df_grouped.at[idx, 'longitude'] = coords['longitude']
    
    # Rename location column to 'name' and prepare output
    df_grouped = df_grouped.rename(columns={location_column: 'name'})
    
    return df_grouped