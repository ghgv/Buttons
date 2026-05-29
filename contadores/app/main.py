from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.counters import router as contadores_router
from app.api.button_box import router as botonera_router

app = FastAPI(
    title="API Contadores"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(contadores_router)
app.include_router(botonera_router)

@app.get("/")
def root():
    return {
        "mensaje": "API funcionando"
    }