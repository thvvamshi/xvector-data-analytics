from fastapi import FastAPI

from app.api.auth import router as auth_router
from app.api.datasets import router as dataset_router

app = FastAPI(
    title="xVector Data Analytics API",
    version="1.0.0",
)

app.include_router(auth_router)
app.include_router(dataset_router)


@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "message": "API Running",
    }