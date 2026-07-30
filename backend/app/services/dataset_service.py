from sqlalchemy.orm import Session

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