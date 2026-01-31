export type AnalyticalData = {
  overview: {
    total_rows: number;
    total_columns: number;
    column_names: string[];
    memory_usage_bytes: number;
  };
  columns: {
    [key: string]: {
      data_type: string;
      non_null_count: number;
      null_count: number;
      null_percentage: number;
      unique_count: number;
      uniqueness_ratio: number;
      numeric_stats?: {
        min: number;
        max: number;
        mean: number;
        median: number;
        std: number;
        q25: number;
        q75: number;
        sum: number;
        zeros_count: number;
        negative_count: number;
        positive_count: number;
        outlier_count: number;
        outlier_percentage: number;
      };
      categorical_stats?: {
        top_values: Array<{
          value: string;
          count: number;
          percentage: number;
        }>;
        most_common: string;
        most_common_count: number;
      };
    };
  };
  location_analysis: {
    detected_location_column: string | null;
    unique_locations?: number;
    location_list?: string[];
    most_common_locations?: Array<{
      location: string;
      count: number;
    }>;
    associated_numeric_columns?: string[];
    message?: string;
  };
  numeric_analysis: {
    total_numeric_columns: number;
    column_names: string[];
    correlation_matrix: { [key: string]: { [key: string]: number } };
    total_sum: { [key: string]: number };
    overall_statistics: {
      total_values: number;
      total_nulls: number;
    };
    high_correlations?: Array<{
      column1: string;
      column2: string;
      correlation: number;
    }>;
  };
  data_quality: {
    completeness_score: number;
    duplicate_rows: number;
    duplicate_percentage: number;
    columns_with_nulls: string[];
    columns_with_high_nulls: string[];
    total_cells: number;
    filled_cells: number;
    empty_cells: number;
  };
  patterns: {
    time_series_columns?: string[];
    potential_categorical_columns?: string[];
  };
  recommendations: string[];
};
