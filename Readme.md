# 📊 XVector Data Analytics Platform

A full-stack data analytics application that enables authenticated users to upload CSV datasets, store them in PostgreSQL, preview tabular data, compute descriptive statistics, and visualize datasets using Apache ECharts.

Built as part of the **XVector Labs Full Stack Developer Assessment**.

## 🌐 Live Demo

| Resource | Link |
|----------|------|
| Frontend | https://xvector-data-analytics-1.onrender.com |
| Backend API | https://xvector-data-analytics.onrender.com |
| API Documentation | https://xvector-data-analytics.onrender.com/docs |

## Repository

```bash
git clone https://github.com/thvvamshi/xvector-data-analytics.git
```

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
  - [Backend](#backend-setup)
  - [Frontend](#frontend-setup)
  - [Database](#database-setup)
- [Environment Variables](#environment-variables)
- [Running the Application](#running-the-application)
- [Sample Dataset](#sample-dataset)
- [Authentication](#authentication)
- [JWT Expiry Strategy](#jwt-expiry-strategy)
- [API Reference](#api-reference)
- [Testing](#testing)
- [Design Decisions](#design-decisions)
- [Technical Assumptions](#technical-assumptions)
- [Security](#security)
- [Error Handling](#error-handling)
- [Future Improvements](#future-improvements)
- [Screenshots](#screenshots)
- [Author](#author)
- [License](#license)

---

## Overview

XVector is a data analytics platform where users can register, log in, and upload CSV files for analysis. Once uploaded, datasets are stored in a cloud-hosted PostgreSQL database (Neon), previewed in a paginated table, summarized with descriptive statistics, and rendered as interactive charts — all behind JWT-secured, user-scoped API endpoints.

---

## Features

### Authentication
- Secure user registration and login
- Password hashing using bcrypt
- JWT authentication
- Protected endpoints
- Automatic logout after token expiry

### Dataset Management
- Upload CSV datasets
- User-defined dataset names
- PostgreSQL persistence (Neon cloud database)
- Server-side pagination
- Preview first 25 rows
- Delete datasets

### Analytics
- Count
- Mean
- Median
- Mode
- Minimum
- Maximum

### Visualization
- Apache ECharts
- Line charts
- Scatter charts
- Bar charts
- Interactive tooltips
- Save chart as image

### Testing
- Pytest unit tests
- Edge-case coverage
- Statistics validation

---

## Architecture

```
React + Vite
      │
 Axios REST API
      │
   FastAPI
      │
 SQLAlchemy
      │
PostgreSQL (Neon — cloud-hosted)
```

The frontend communicates with the FastAPI backend through REST APIs. The backend validates requests, performs authentication using JWT, stores datasets in a Neon-hosted PostgreSQL database, computes statistics using Pandas, and returns JSON responses consumed by the React application.

---

## Tech Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React, TypeScript, Vite, Apache ECharts, Axios, React Router, CSS |
| **Backend** | FastAPI, SQLAlchemy, Pandas, JWT Auth, Passlib (bcrypt) |
| **Database** | PostgreSQL (hosted on [Neon](https://neon.tech)) |
| **Testing** | Pytest |

---

## Project Structure

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
├── sample.csv
└── README.md
```

---

## Prerequisites

- Python 3.10+
- Node.js 18+
- A [Neon](https://neon.tech) account (or any PostgreSQL instance)
- Git

---

## Installation

### Backend Setup

**1. Create a virtual environment**

Windows:
```bash
python -m venv venv
venv\Scripts\activate
```

Linux / macOS:
```bash
python3 -m venv venv
source venv/bin/activate
```

**2. Install dependencies**
```bash
pip install -r requirements.txt
```

**3. Configure environment variables** — see [Environment Variables](#environment-variables)

**4. Run the backend**
```bash
uvicorn app.main:app --reload
```

- API: `http://localhost:8000`
- Swagger docs: `http://localhost:8000/docs`

### Frontend Setup

```bash
cd frontend
npm install
```

Configure the frontend `.env` — see [Environment Variables](#environment-variables).

Run the development server:
```bash
npm run dev
```

- App: `http://localhost:5173`

### Database Setup

This project uses **Neon**, a serverless cloud-hosted PostgreSQL provider, instead of a local Postgres instance.

1. Create a free project at [neon.tech](https://neon.tech).
2. Copy the connection string Neon provides (includes SSL parameters).
3. Paste it into `DATABASE_URL` in the backend `.env` file.

No local database installation is required — tables are created automatically by SQLAlchemy on first run.

---

## Environment Variables

**Backend (`backend/.env`)**

| Variable | Description |
|---|---|
| `DATABASE_URL` | Neon PostgreSQL connection string (e.g. `postgresql://user:password@your-neon-host/dbname?sslmode=require`) |
| `SECRET_KEY` | JWT signing secret |
| `ALGORITHM` | JWT algorithm (e.g. `HS256`) |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | Token expiry duration in minutes |

**Frontend (`frontend/.env`)**

| Variable | Description |
|---|---|
| `VITE_API_URL` | Backend API base URL |

---

## Running the Application

1. Start the backend: `uvicorn app.main:app --reload`
2. Start the frontend: `npm run dev`
3. Open `http://localhost:5173`, register a user, and log in.
4. Upload `sample.csv` (or your own dataset) to explore previews, statistics, and charts.

---

## Sample Dataset

A sample CSV (`sample.csv`) is included in the repository root for quick testing.

Upload it after signing in to explore the application's analytics and visualization features without needing your own dataset.

---

## Authentication

Authentication uses JWT tokens. Passwords are hashed with bcrypt before storage.

Every protected request must include:
```
Authorization: Bearer <JWT_TOKEN>
```

## JWT Expiry Strategy

1. Access tokens expire after the configured duration.
2. On expiry, the backend returns `401 Unauthorized`.
3. The frontend clears the stored token and redirects to Login.
4. The user re-authenticates to obtain a new JWT.

> Refresh tokens are intentionally out of scope for this assignment.

---

## API Reference

### Authentication

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/auth/register` | Register a new user |
| `POST` | `/auth/login` | Log in and receive a JWT |

### Dataset

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/dataset/upload` | Upload a CSV file |
| `GET` | `/dataset` | List datasets (paginated) |
| `GET` | `/dataset/{id}/preview` | Preview the first 25 rows |
| `GET` | `/dataset/{id}/stats` | Compute column statistics |
| `GET` | `/dataset/{id}/plot` | Retrieve plot data |
| `DELETE` | `/dataset/{id}` | Delete a dataset |

**Statistics response example:**
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

**Plot response example:**
```json
{
  "x": "Age",
  "y": "Salary",
  "data": [
    [25, 45000],
    [30, 52000]
  ]
}
```

**Pagination example:**
```
GET /dataset?page=1&limit=10
```
```json
{
  "items": [],
  "page": 1,
  "limit": 10,
  "total": 25,
  "pages": 3
}
```
Pagination is implemented with SQL `OFFSET` and `LIMIT`.

---

## Testing

Run the full test suite:
```bash
pytest -v
```

Covered scenarios:
- Dataset not found
- Column not found
- Non-numeric column
- All-null values
- Valid numeric statistics

---

## Design Decisions

- FastAPI was chosen for its performance and automatic OpenAPI documentation.
- SQLAlchemy provides ORM support for PostgreSQL.
- Neon was chosen as the database provider for its serverless, zero-maintenance cloud Postgres hosting.
- Pandas simplifies CSV parsing and statistical calculations.
- Apache ECharts was selected for interactive visualizations.
- JWT authentication provides stateless API security.
- Server-side pagination improves scalability for large numbers of datasets.

---

## Technical Assumptions

- CSV files are expected to contain a header row.
- Statistics are computed only for numeric columns.
- Non-numeric values are ignored during numeric conversion.
- Authentication is required for all dataset operations.
- Each user can access only their own datasets.
- Pagination is implemented at the database level using SQL `OFFSET` and `LIMIT`.
- Plot responses are limited to the first 30 rows to keep visualizations responsive.

---

## Security

- bcrypt password hashing
- JWT-based authentication
- Protected, user-scoped endpoints
- CSV and input validation
- Secure password storage
- SSL-enforced database connection (via Neon)

---

## Error Handling

The application validates against:
- Invalid or empty CSV files
- Missing files or columns
- Invalid dataset or column names
- Unauthorized access
- Non-numeric statistics requests

---

## Future Improvements

- [ ] Refresh tokens
- [ ] Advanced filtering
- [ ] CSV export
- [ ] Bulk delete
- [ ] Additional statistical operations
- [ ] Expanded chart customization
- [ ] Docker deployment
- [ ] CI/CD pipeline

---

## Screenshots

| Screen | Highlights |
|---|---|
| **Login** | User login and registration |
| **Home** | Navigation and welcome page |
| **Dataset Management** | Upload, list, preview, and delete datasets |
| **Analytics** | Statistics computation and interactive charts |

> Add screenshots or GIFs here to showcase the UI.

---

## Author

**Boda Vamshi Kumar**
GitHub: [@thvvamshi](https://github.com/thvvamshi)

---

## License

Developed as part of the XVector Full Stack Developer Assignment.