from sqlalchemy.orm import Session
import pandas as pd

from app.models import Dataset, DatasetRow, User


def get_dataset_preview(
    db: Session,
    dataset_id: str,
    owner_id: str,
    limit: int,
):
    dataset = (
        db.query(Dataset)
        .filter(
            Dataset.id == dataset_id,
            Dataset.owner_id == owner_id,
        )
        .first()
    )

    if not dataset:
        return None

    rows = (
        db.query(DatasetRow)
        .filter(DatasetRow.dataset_id == dataset_id)
        .limit(limit)
        .all()
    )

    return {
        "dataset_id": dataset.id,
        "name": dataset.name,
        "columns": dataset.columns,
        "rows": [row.row_data for row in rows],
    }


def create_dataset(
    db: Session,
    owner: User,
    name: str,
    columns: list[str],
):
    dataset = Dataset(
        name=name,
        owner_id=owner.id,
        columns=columns,
    )

    db.add(dataset)
    db.commit()
    db.refresh(dataset)

    return dataset


def save_dataset_rows(
    db: Session,
    dataset: Dataset,
    rows: list[dict],
):
    dataset_rows = [
        DatasetRow(
            dataset_id=dataset.id,
            row_data=row,
        )
        for row in rows
    ]

    db.add_all(dataset_rows)
    db.commit()


def get_user_datasets(
    db: Session,
    owner: User,
):
    return (
        db.query(Dataset)
        .filter(Dataset.owner_id == owner.id)
        .order_by(Dataset.created_at.desc())
        .all()
    )


def get_column_statistics(
    db: Session,
    dataset_id: str,
    owner_id: str,
    column: str,
):
    dataset = (
        db.query(Dataset)
        .filter(
            Dataset.id == dataset_id,
            Dataset.owner_id == owner_id,
        )
        .first()
    )

    if not dataset:
        return None

    rows = (
        db.query(DatasetRow)
        .filter(DatasetRow.dataset_id == dataset_id)
        .all()
    )

    if not rows:
        return None

    dataframe = pd.DataFrame(
        [row.row_data for row in rows]
    )

    # Case-insensitive column lookup
    column_map = {
        col.lower(): col
        for col in dataframe.columns
    }

    actual_column = column_map.get(column.lower())

    if actual_column is None:
        return "COLUMN_NOT_FOUND"

    series = pd.to_numeric(
        dataframe[actual_column],
        errors="coerce",
    ).dropna()

    if series.empty:
        return "NOT_NUMERIC"

    return {
        "column": actual_column,
        "count": int(series.count()),
        "mean": round(float(series.mean()), 2),
        "median": float(series.median()),
        "mode": float(series.mode().iloc[0]),
        "min": float(series.min()),
        "max": float(series.max()),
    }


def get_plot_data(
    db: Session,
    dataset_id: str,
    owner_id: str,
    x_column: str,
    y_column: str,
):
    dataset = (
        db.query(Dataset)
        .filter(
            Dataset.id == dataset_id,
            Dataset.owner_id == owner_id,
        )
        .first()
    )

    if not dataset:
        return None

    rows = (
        db.query(DatasetRow)
        .filter(DatasetRow.dataset_id == dataset_id)
        .all()
    )

    if not rows:
        return None

    dataframe = pd.DataFrame(
        [row.row_data for row in rows]
    )

    column_map = {
        col.lower(): col
        for col in dataframe.columns
    }

    actual_x = column_map.get(x_column.lower())
    actual_y = column_map.get(y_column.lower())

    if actual_x is None or actual_y is None:
        return "COLUMN_NOT_FOUND"

    dataframe = dataframe[[actual_x, actual_y]].dropna()

    return {
        "x": actual_x,
        "y": actual_y,
        "data": dataframe.values.tolist(),
    }

def delete_dataset(
    db: Session,
    dataset_id: str,
    owner_id: str,
):
    dataset = (
        db.query(Dataset)
        .filter(
            Dataset.id == dataset_id,
            Dataset.owner_id == owner_id,
        )
        .first()
    )

    if not dataset:
        return False

    db.delete(dataset)
    db.commit()

    return True