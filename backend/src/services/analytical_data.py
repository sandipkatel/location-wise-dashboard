import pandas as pd
from src.helper.dtype_converter import convert_values, convert_numpy_to_python
from src.services.core import get_major_location_column, get_numeric_columns_after_location


def get_analytical_data(stringJsonData):
    """
    Analyzes JSON data and returns comprehensive analytical insights.
    
    Args:
        stringJsonData: JSON data from frontend (may contain stringified values)
        
    Returns:
        dict: Comprehensive analytical data including statistics, patterns, and insights
    """
    # Convert stringified values to proper types
    jsonData = convert_values(stringJsonData)
    df = pd.DataFrame(jsonData)
    
    # Initialize analytics structure
    analytics = {
        'overview': {},
        'columns': {},
        'location_analysis': {},
        'numeric_analysis': {},
        'data_quality': {},
        'patterns': {},
        'recommendations': []
    }
    
    # ===== OVERVIEW =====
    analytics['overview'] = {
        'total_rows': len(df),
        'total_columns': len(df.columns),
        'column_names': df.columns.tolist(),
        'memory_usage_bytes': df.memory_usage(deep=True).sum()
    }
    
    # ===== COLUMN-LEVEL ANALYSIS =====
    for col in df.columns:
        col_data = {
            'data_type': str(df[col].dtype),
            'non_null_count': int(df[col].notna().sum()),
            'null_count': int(df[col].isna().sum()),
            'null_percentage': round((df[col].isna().sum() / len(df)) * 100, 2),
            'unique_count': int(df[col].nunique()),
            'uniqueness_ratio': round(df[col].nunique() / len(df), 4) if len(df) > 0 else 0
        }
        
        # Numeric column analysis
        if pd.api.types.is_numeric_dtype(df[col]):
            col_data['numeric_stats'] = {
                'min': float(df[col].min()) if df[col].notna().any() else None,
                'max': float(df[col].max()) if df[col].notna().any() else None,
                'mean': round(float(df[col].mean()), 2) if df[col].notna().any() else None,
                'median': float(df[col].median()) if df[col].notna().any() else None,
                'std': round(float(df[col].std()), 2) if df[col].notna().any() else None,
                'q25': float(df[col].quantile(0.25)) if df[col].notna().any() else None,
                'q75': float(df[col].quantile(0.75)) if df[col].notna().any() else None,
                'sum': float(df[col].sum()) if df[col].notna().any() else None,
                'zeros_count': int((df[col] == 0).sum()),
                'negative_count': int((df[col] < 0).sum()),
                'positive_count': int((df[col] > 0).sum())
            }
            
            # Outlier detection (IQR method)
            if df[col].notna().any():
                Q1 = df[col].quantile(0.25)
                Q3 = df[col].quantile(0.75)
                IQR = Q3 - Q1
                lower_bound = Q1 - 1.5 * IQR
                upper_bound = Q3 + 1.5 * IQR
                outliers = df[(df[col] < lower_bound) | (df[col] > upper_bound)][col]
                col_data['numeric_stats']['outlier_count'] = int(len(outliers))
                col_data['numeric_stats']['outlier_percentage'] = round((len(outliers) / len(df)) * 100, 2)
        
        # Categorical/Text column analysis
        else:
            top_values = df[col].value_counts().head(10)
            col_data['categorical_stats'] = {
                'top_values': [
                    {'value': str(val), 'count': int(count), 'percentage': round((count / len(df)) * 100, 2)}
                    for val, count in top_values.items()
                ],
                'most_common': str(top_values.index[0]) if len(top_values) > 0 else None,
                'most_common_count': int(top_values.iloc[0]) if len(top_values) > 0 else None
            }
        
        analytics['columns'][col] = col_data
    
    # ===== LOCATION ANALYSIS =====
    location_column = get_major_location_column(jsonData)
    if location_column:
        analytics['location_analysis'] = {
            'detected_location_column': location_column,
            'unique_locations': int(df[location_column].nunique()),
            'location_list': df[location_column].dropna().unique().tolist()[:50],  # Limit to 50
            'most_common_locations': [
                {'location': str(loc), 'count': int(count)}
                for loc, count in df[location_column].value_counts().head(10).items()
            ]
        }
        
        # Get numeric columns after location
        numeric_cols = get_numeric_columns_after_location(df, location_column)
        analytics['location_analysis']['associated_numeric_columns'] = numeric_cols
        
    else:
        analytics['location_analysis'] = {
            'detected_location_column': None,
            'message': 'No location column detected in dataset'
        }
    
    # ===== NUMERIC ANALYSIS (OVERALL) =====
    numeric_columns = df.select_dtypes(include=['number']).columns.tolist()
    if numeric_columns:
        analytics['numeric_analysis'] = {
            'total_numeric_columns': len(numeric_columns),
            'column_names': numeric_columns,
            'correlation_matrix': df[numeric_columns].corr().round(3).to_dict() if len(numeric_columns) > 1 else {},
            'total_sum': {col: float(df[col].sum()) for col in numeric_columns},
            'overall_statistics': {
                'total_values': int(df[numeric_columns].count().sum()),
                'total_nulls': int(df[numeric_columns].isna().sum().sum())
            }
        }
        
        # Find highly correlated pairs (>0.7 or <-0.7)
        if len(numeric_columns) > 1:
            corr_matrix = df[numeric_columns].corr()
            high_correlations = []
            for i in range(len(corr_matrix.columns)):
                for j in range(i+1, len(corr_matrix.columns)):
                    if abs(corr_matrix.iloc[i, j]) > 0.7:
                        high_correlations.append({
                            'column1': corr_matrix.columns[i],
                            'column2': corr_matrix.columns[j],
                            'correlation': round(float(corr_matrix.iloc[i, j]), 3)
                        })
            analytics['numeric_analysis']['high_correlations'] = high_correlations
    
    # ===== DATA QUALITY =====
    analytics['data_quality'] = {
        'completeness_score': round((df.notna().sum().sum() / (len(df) * len(df.columns))) * 100, 2),
        'duplicate_rows': int(df.duplicated().sum()),
        'duplicate_percentage': round((df.duplicated().sum() / len(df)) * 100, 2),
        'columns_with_nulls': [col for col in df.columns if df[col].isna().any()],
        'columns_with_high_nulls': [col for col in df.columns if (df[col].isna().sum() / len(df)) > 0.3],
        'total_cells': len(df) * len(df.columns),
        'filled_cells': int(df.notna().sum().sum()),
        'empty_cells': int(df.isna().sum().sum())
    }
    
    # ===== PATTERNS =====
    analytics['patterns'] = {}
    
    # Check for time series potential
    date_columns = df.select_dtypes(include=['datetime64']).columns.tolist()
    if date_columns:
        analytics['patterns']['time_series_columns'] = date_columns
    
    # Check for potential categorical columns (low cardinality)
    potential_categories = [
        col for col in df.columns 
        if df[col].nunique() < 20 and df[col].nunique() > 1
    ]
    analytics['patterns']['potential_categorical_columns'] = potential_categories
    
    # ===== RECOMMENDATIONS =====
    if analytics['data_quality']['duplicate_rows'] > 0:
        analytics['recommendations'].append(
            f"Found {analytics['data_quality']['duplicate_rows']} duplicate rows. Consider removing duplicates."
        )
    
    if analytics['data_quality']['columns_with_high_nulls']:
        analytics['recommendations'].append(
            f"Columns with >30% missing data: {', '.join(analytics['data_quality']['columns_with_high_nulls'])}. Consider imputation or removal."
        )
    
    if location_column and numeric_columns:
        analytics['recommendations'].append(
            f"Location data detected. You can create geographic visualizations using '{location_column}' with metrics like {', '.join(numeric_columns[:3])}."
        )
    
    if len(numeric_columns) > 1 and 'high_correlations' in analytics.get('numeric_analysis', {}):
        if analytics['numeric_analysis']['high_correlations']:
            analytics['recommendations'].append(
                f"Found {len(analytics['numeric_analysis']['high_correlations'])} highly correlated column pairs. Review for potential multicollinearity."
            )

    analytics = convert_numpy_to_python(analytics)

    return analytics