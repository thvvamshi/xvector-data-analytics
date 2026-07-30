import io

import pandas as pd
from fastapi import (
    APIRouter,
    Depends,
    File,
    Form,
    HTTPException,
    UploadFile,
    status,
)
from sqlalchemy.orm import Session

from app.auth.dependencies import get_current_user
from app.database import get_db
from app.models import User
from app.schemas.dataset import (
    DatasetPreviewResponse,
    DatasetResponse,
    DatasetUploadResponse,
     ColumnStatsResponse,
     PlotResponse,
)
from app.services.dataset_service import (
    create_dataset,
    get_dataset_preview,
    get_user_datasets,
    save_dataset_rows,
    get_column_statistics,
    get_plot_data,
    delete_dataset,
)

router = APIRouter(
    prefix="/dataset",
    tags=["Dataset"],
)


@router.post(
    "/upload",
    response_model=DatasetUploadResponse,
    status_code=status.HTTP_201_CREATED,
)
async def upload_dataset(
    name: str = Form(...),
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if not file.filename:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No file uploaded.",
        )

    if not file.filename.lower().endswith(".csv"):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Only CSV files are supported.",
        )

    try:
        contents = await file.read()
        dataframe = pd.read_csv(io.BytesIO(contents))
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid CSV file.",
        )

    if dataframe.empty:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="CSV file is empty.",
        )

    dataframe = dataframe.fillna("")

    dataset = create_dataset(
        db=db,
        owner=current_user,
        name=name,
        columns=list(dataframe.columns),
    )

    save_dataset_rows(
        db=db,
        dataset=dataset,
        rows=dataframe.to_dict(orient="records"),
    )

    return {
        "id": dataset.id,
        "name": dataset.name,
        "columns": dataset.columns,
        "rows": len(dataframe),
        "created_at": dataset.created_at,
    }


@router.get(
    "/",
    response_model=list[DatasetResponse],
)
def list_datasets(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return get_user_datasets(
        db=db,
        owner=current_user,
    )


@router.get(
    "/{dataset_id}/preview",
    response_model=DatasetPreviewResponse,
)
def preview_dataset(
    dataset_id: str,
    limit: int = 10,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    preview = get_dataset_preview(
        db,
        dataset_id,
        current_user.id,
        limit,
    )

    if preview is None:
        raise HTTPException(
            status_code=404,
            detail="Dataset not found",
        )

    return preview


@router.get(
    "/{dataset_id}/stats",
    response_model=ColumnStatsResponse,
)
def dataset_statistics(
    dataset_id: str,
    column: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    stats = get_column_statistics(
        db,
        dataset_id,
        current_user.id,
        column,
    )

    if stats is None:
        raise HTTPException(
            status_code=404,
            detail="Dataset not found",
        )

    if stats == "COLUMN_NOT_FOUND":
        raise HTTPException(
            status_code=404,
            detail="Column not found",
        )

    if stats == "NOT_NUMERIC":
        raise HTTPException(
            status_code=400,
            detail="Column is not numeric",
        )

    return stats


@router.get(
    "/{dataset_id}/plot",
    response_model=PlotResponse,
)
def dataset_plot(
    dataset_id: str,
    x: str,
    y: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    plot = get_plot_data(
        db,
        dataset_id,
        current_user.id,
        x,
        y,
    )

    if plot is None:
        raise HTTPException(
            status_code=404,
            detail="Dataset not found",
        )

    if plot == "COLUMN_NOT_FOUND":
        raise HTTPException(
            status_code=404,
            detail="Column not found",
        )

    return plot



@router.delete(
    "/{dataset_id}",
)
def remove_dataset(
    dataset_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    deleted = delete_dataset(
        db,
        dataset_id,
        current_user.id,
    )

    if not deleted:
        raise HTTPException(
            status_code=404,
            detail="Dataset not found",
        )

    return {
        "message": "Dataset deleted successfully",
    }