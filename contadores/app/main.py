from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.v1.endpoints.counter import router as contadores_router
from app.api.v1.endpoints.button_box import router as botonera_router
from app.api.auth import router as auth_login_register
from app.api.v1.endpoints.clients import router as clients_router

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
app.include_router(auth_login_register)
app.include_router(clients_router)

@app.get("/prueba")
def root():
    return {
        "mensaje": "API funcionando"
    }