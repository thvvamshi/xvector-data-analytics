import pytest
from unittest.mock import MagicMock

from app.services.dataset_service import get_column_statistics
from app.models import Dataset, DatasetRow


def make_db(dataset=None, rows=None):
    db = MagicMock()

    query = MagicMock()
    db.query.return_value = query

    # First query -> Dataset
    dataset_filter = MagicMock()
    query.filter.return_value = dataset_filter
    dataset_filter.first.return_value = dataset

    # Second query -> DatasetRow
    row_query = MagicMock()
    db.query.side_effect = [query, row_query]

    row_filter = MagicMock()
    row_query.filter.return_value = row_filter
    row_filter.all.return_value = rows or []

    return db


def test_dataset_not_found():
    db = make_db(dataset=None)

    result = get_column_statistics(
        db,
        "dataset-id",
        "user-id",
        "salary",
    )

    assert result is None


def test_column_not_found():
    dataset = Dataset(
        id="1",
        owner_id="1",
        name="Employees",
        columns=["Age"],
    )

    rows = [
        DatasetRow(
            dataset_id="1",
            row_data={"Age": 20},
        )
    ]

    db = make_db(dataset, rows)

    result = get_column_statistics(
        db,
        "1",
        "1",
        "Salary",
    )

    assert result == "COLUMN_NOT_FOUND"


def test_non_numeric_column():
    dataset = Dataset(
        id="1",
        owner_id="1",
        name="Employees",
        columns=["Name"],
    )

    rows = [
        DatasetRow(
            dataset_id="1",
            row_data={"Name": "Alice"},
        ),
        DatasetRow(
            dataset_id="1",
            row_data={"Name": "Bob"},
        ),
    ]

    db = make_db(dataset, rows)

    result = get_column_statistics(
        db,
        "1",
        "1",
        "Name",
    )

    assert result == "NOT_NUMERIC"


def test_all_null_values():
    dataset = Dataset(
        id="1",
        owner_id="1",
        name="Employees",
        columns=["Salary"],
    )

    rows = [
        DatasetRow(
            dataset_id="1",
            row_data={"Salary": ""},
        ),
        DatasetRow(
            dataset_id="1",
            row_data={"Salary": None},
        ),
    ]

    db = make_db(dataset, rows)

    result = get_column_statistics(
        db,
        "1",
        "1",
        "Salary",
    )

    assert result == "NOT_NUMERIC"


def test_valid_numeric_column():
    dataset = Dataset(
        id="1",
        owner_id="1",
        name="Employees",
        columns=["Salary"],
    )

    rows = [
        DatasetRow(
            dataset_id="1",
            row_data={"Salary": 100},
        ),
        DatasetRow(
            dataset_id="1",
            row_data={"Salary": 200},
        ),
        DatasetRow(
            dataset_id="1",
            row_data={"Salary": 300},
        ),
    ]

    db = make_db(dataset, rows)

    result = get_column_statistics(
        db,
        "1",
        "1",
        "Salary",
    )

    assert result["count"] == 3
    assert result["min"] == 100.0
    assert result["max"] == 300.0
    assert result["mean"] == 200.0
    assert result["median"] == 200.0