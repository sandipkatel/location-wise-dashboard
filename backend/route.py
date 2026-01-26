# # Dataset management endpoints after generation
from typing import Any, List, Optional
from fastapi import APIRouter, HTTPException, Query

router = APIRouter()

@router.get("/{dataset_id}")
def read_dataset_by_id() -> Any:
    """
    Get a specific dataset by id.
    """
    pass

@router.post("/")
def read_incoming_csv() -> Any:
    """
    Get a specific dataset by id.
    """
    pass


# @router.put("/{dataset_id}", response_model=schemas.Dataset)
# def update_dataset(
#     *,
#     dataset_id: int,
#     dataset_in: schemas.DatasetUpdate
# ) -> Any:
#     """
#     Update a specific dataset by id.
#     """
#     dataset = crud.dataset.get_dataset(db, dataset_id=dataset_id)
#     if not dataset:
#         raise HTTPException(
#             status_code=404,
#             detail="Dataset not found"
#         )
    
#     dataset = crud.dataset.update_dataset(db, db_dataset=dataset, dataset_in=dataset_in)
#     return dataset


# @router.delete("/{dataset_id}")
# def delete_dataset(
#     *,
#     dataset_id: int) -> Any:
#     """
#     Delete a specific dataset by id.
#     """
#     dataset = crud.dataset.get_dataset(db, dataset_id=dataset_id)
#     if not dataset:
#         raise HTTPException(
#             status_code=404,
#             detail="Dataset not found"
#         )
    
#     success = crud.dataset.delete_dataset(db, dataset_id=dataset_id)
#     if not success:
#         raise HTTPException(
#             status_code=500,
#             detail="Failed to delete dataset"
#         )
    
#     return {"message": f"Dataset {dataset_id} deleted successfully"}


# # @router.get("/{dataset_id}/schema", response_model=schemas.DatasetSchema)
# # def get_dataset_schema(dataset_id: int) -> Any:
# #     """
# #     Get the schema definition for a dataset.
# #     """
# #     schema = crud.dataset.get_dataset_schema(db, dataset_id=dataset_id)
# #     if not schema:
# #         raise HTTPException(
# #             status_code=404,
# #             detail="Dataset schema not found"
# #         )
# #     return schema


# # @router.put("/{dataset_id}/schema", response_model=schemas.DatasetSchema)
# # def update_dataset_schema(
# #     *,
# #     dataset_id: int,
# #     schema_in: schemas.DatasetSchemaUpdate,
# # ) -> Any:
# #     """
# #     Update or create schema definition for a dataset.
# #     """
# #     dataset = crud.dataset.get_dataset(db, dataset_id=dataset_id)
# #     if not dataset:
# #         raise HTTPException(
# #             status_code=404,
# #             detail="Dataset not found"
# #         )
    
# #     schema = crud.dataset.update_dataset_schema(db, dataset_id=dataset_id, schema_in=schema_in)
# #     return schema


# @router.get("/{dataset_id}/preview")
# def preview_dataset(
#     dataset_id: int,
#     limit: int = 10,
# ) -> Any:
#     """
#     Preview generated data based on current schema.
#     """
#     dataset = crud.dataset.get_dataset(db, dataset_id=dataset_id)
#     if not dataset:
#         raise HTTPException(
#             status_code=404,
#             detail="Dataset not found"
#         )
    
#     schema = crud.dataset.get_dataset_schema(db, dataset_id=dataset_id)
#     if not schema:
#         raise HTTPException(
#             status_code=400,
#             detail="Dataset schema not defined. Please define schema first."
#         )
    
#     try:
#         preview_data = crud.dataset.generate_preview_data(db, dataset_id=dataset_id, limit=limit)
#         return {
#             "dataset_id": dataset_id,
#             "preview_count": len(preview_data),
#             "data": preview_data
#         }
#     except Exception as e:
#         raise HTTPException(
#             status_code=500,
#             detail=f"Failed to generate preview: {str(e)}"
#         )