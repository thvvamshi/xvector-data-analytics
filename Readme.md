# 📊 XVector Data Analytics Platform

A full-stack web application that enables authenticated users to upload CSV datasets, store them in PostgreSQL, preview raw data, compute statistics on numeric columns, visualize data using Apache ECharts, and manage datasets securely.

---

## 🚀 Features

### 🔐 Authentication
- User Registration
- User Login
- JWT Authentication
- Password hashing using **bcrypt**
- Protected API endpoints
- JWT expiration support
- Re-login strategy for expired tokens

### 📂 Dataset Management
- Upload CSV datasets
- User-defined dataset names
- Store datasets in PostgreSQL
- Browse uploaded datasets
- Real backend pagination
- Preview first 25 rows
- Delete datasets with confirmation

### 📈 Analytics
- Compute statistics for numeric columns
- Statistics include:
  - Count
  - Mean
  - Median
  - Mode
  - Minimum
  - Maximum

### 📊 Visualization
- Interactive Apache ECharts
- Line Chart
- Bar Chart
- Scatter Chart
- Plot first 30 rows

### ✅ Testing
- Unit tests using Pytest
- Covers:
  - Dataset not found
  - Column not found
  - Non-numeric column
  - All null values
  - Valid numeric statistics

---

# 🏗️ Tech Stack

## Frontend

- React
- TypeScript
- Vite
- Apache ECharts
- Axios
- React Router
- CSS

## Backend

- FastAPI
- SQLAlchemy
- PostgreSQL
- Pandas
- JWT Authentication
- Passlib (bcrypt)

## Database

- PostgreSQL

## Testing

- Pytest

---

# 📁 Project Structure

```
xvector-data-app/
│
├── backend/
│   ├── app/
│   │   ├── auth/
│   │   ├── core/
│   │   ├── database/
│   │   ├── models/
│   │   ├── routers/
│   │   ├── schemas/
│   │   ├── services/
│   │   └── main.py
│   │
│   ├── tests/
│   │   └── test_dataset_service.py
│   │
│   ├── requirements.txt
│   └── .env
│
├── frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── vite.config.ts
│
└── README.md
```

---

# ⚙️ Installation

## Clone Repository

```bash
git clone https://github.com/thvvamshi/xvector-data-analytics

cd xvector-data-app
```

---

# Backend Setup

## Create Virtual Environment

Windows

```bash
python -m venv venv

venv\Scripts\activate
```

Linux / Mac

```bash
python3 -m venv venv

source venv/bin/activate
```

---

## Install Dependencies

```bash
pip install -r requirements.txt
```

---

## Environment Variables

Create `.env`

```env
DATABASE_URL=postgresql://username:password@localhost:5432/xvector

SECRET_KEY=your_secret_key

ALGORITHM=HS256

ACCESS_TOKEN_EXPIRE_MINUTES=60
```

---

## Run Backend

```bash
uvicorn app.main:app --reload
```

Backend runs at

```
http://localhost:8000
```

Swagger Documentation

```
http://localhost:8000/docs
```

---

# Frontend Setup

```bash
cd frontend
```

Install packages

```bash
npm install
```

Create `.env`

```env
VITE_API_URL=http://localhost:8000
```

Run development server

```bash
npm run dev
```

Frontend

```
http://localhost:5173
```

---

# 🗄️ Database

This project uses PostgreSQL.

Example database creation:

```sql
CREATE DATABASE xvector;
```

---

# 🔐 Authentication

Authentication is implemented using JWT tokens.

Passwords are securely hashed using bcrypt before storage.

Each authenticated request requires:

```
Authorization: Bearer <JWT_TOKEN>
```

---

# JWT Expiry Strategy

Access Tokens expire after the configured duration.

When a token expires:

- Backend returns **401 Unauthorized**
- Frontend clears the stored token
- User is redirected to Login
- User authenticates again to obtain a new JWT

Refresh tokens are intentionally not implemented because they are outside the scope of this assignment.

---

# 📡 API Endpoints

## Authentication

| Method | Endpoint | Description |
|----------|------------|-------------------------|
| POST | `/auth/register` | Register |
| POST | `/auth/login` | Login |

---

## Dataset

| Method | Endpoint | Description |
|----------|--------------------------|-----------------------------|
| POST | `/dataset/upload` | Upload CSV |
| GET | `/dataset` | List datasets (pagination) |
| GET | `/dataset/{id}/preview` | Preview first 25 rows |
| GET | `/dataset/{id}/stats` | Compute statistics |
| GET | `/dataset/{id}/plot` | Plot columns |
| DELETE | `/dataset/{id}` | Delete dataset |

---

# 📊 Statistics Endpoint

Returns

```json
{
  "column": "Salary",
  "count": 150,
  "mean": 62450.5,
  "median": 61000,
  "mode": 55000,
  "min": 25000,
  "max": 120000
}
```

---

# 📈 Plot Endpoint

Returns

```json
{
  "x":"Age",
  "y":"Salary",
  "data":[
      [25,45000],
      [30,52000]
  ]
}
```

Supports visualization using Apache ECharts.

---

# 📄 Pagination

Dataset listing supports:

```
GET /dataset?page=1&limit=10
```

Response

```json
{
  "items":[...],
  "page":1,
  "limit":10,
  "total":25,
  "pages":3
}
```

Pagination is implemented using SQL OFFSET and LIMIT.

---

# 🧪 Running Tests

Run all tests

```bash
pytest -v
```

Current Results

```
=============================
5 passed
=============================
```

Covered Scenarios

- Dataset not found
- Column not found
- Non-numeric column
- All null values
- Valid numeric statistics

---

# Screens

## Login

- User Login
- Registration

---

## Home

- Navigation
- Welcome page

---

## Dataset Management

- Upload CSV
- Dataset list
- Delete dataset
- Preview data

---

## Analytics

- Compute statistics
- Interactive charts
- Apache ECharts visualization

---

# Security

- bcrypt password hashing
- JWT Authentication
- Protected endpoints
- User-specific datasets
- Input validation
- CSV validation
- Secure password storage

---

# Error Handling

The application validates

- Invalid CSV
- Empty CSV
- Missing file
- Missing columns
- Invalid dataset
- Unauthorized access
- Non-numeric statistics
- Invalid column names

---

# Future Improvements

- Refresh Tokens
- Advanced filtering
- CSV export
- Bulk delete
- Additional statistical operations
- Multiple chart customization
- Docker deployment
- CI/CD pipeline

---

# Author

**Boda Vamshi Kumar**

GitHub

https://github.com/thvvamshi

---

# License

This project is developed as part of the XVector Full Stack Developer Assignment.