#!/bin/bash
# Run the FastAPI server using uvicorn

uvicorn main:app --reload --host 0.0.0.0 --port 8000
