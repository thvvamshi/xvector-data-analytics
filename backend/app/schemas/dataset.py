from datetime import datetime
from typing import Any

from pydantic import BaseModel, ConfigDict


class DatasetResponse(BaseModel):
    id: str
    name: str
    columns: list[str]
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class DatasetUploadResponse(BaseModel):
    id: str
    name: str
    columns: list[str]
    rows: int
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class DatasetPreviewResponse(BaseModel):
    dataset_id: str
    name: str
    columns: list[str]
    rows: list[dict[str, Any]]  

class ColumnStatsResponse(BaseModel):
    column: str
    count: int
    mean: float
    median: float
    mode: float
    min: float
    max: float