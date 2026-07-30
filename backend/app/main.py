from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.auth import router as auth_router
from app.api.datasets import router as dataset_router

app = FastAPI(
    title="XVector Data Analytics API",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "https://xvector-data-analytics-1.onrender.com",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)
app.include_router(dataset_router)


@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "message": "API Running",
    }