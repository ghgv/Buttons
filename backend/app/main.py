from fastapi import FastAPI,Request, Response, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import PlainTextResponse
from app.api.v1.endpoints.counter import router as contadores_router
from app.api.v1.endpoints.button_box import router as botonera_router
from app.api.auth import router as auth_login_register
from app.api.v1.endpoints.clients import router as clients_router
from app.api.v1.endpoints.sedes import router as sedes_router
from app.api.v1.endpoints.levels import router as levels_router
from app.api.v1.endpoints.bathrooms import route as bathroom_router
from app.api.v1.endpoints import metrics
from app.core.logger import logger
from app.api.v1.endpoints.incidents import router as incidents_router
from app.api.v1.endpoints.assignments import router as assignments_router
from app.api.v1.endpoints.supervisors import router as supervisors_router
from app.api.v1.endpoints.client_admins import router as client_admins_router
from app.api.v1.endpoints.mobile_devices import router as mobile_devices_router
from app.api.v1.endpoints.test_push import router as test_push_router




app = FastAPI(
    title="API Contadores"
)



@app.middleware("http")
async def log_requests(request: Request, call_next):

    logger.info(
        f"--> {request.method} {request.url.path} "
        f"IP={request.client.host} "
        f"QUERY={request.url.query}"
    )

    response = await call_next(request)

    logger.info(
        f"<-- {request.method} {request.url.path} "
        f"STATUS={response.status_code}"
    )

    return response


app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://dali.com.co",
        "https://dali.com.co",
        "http://www.dali.com.co",
        "https://www.dali.com.co",
    ],
    allow_origin_regex=r"http://localhost:\d+",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(metrics.router)
app.include_router(contadores_router)
app.include_router(botonera_router)
app.include_router(auth_login_register)
app.include_router(clients_router)
app.include_router(sedes_router)
app.include_router(levels_router)
app.include_router(bathroom_router)
app.include_router(incidents_router)
app.include_router(assignments_router)
app.include_router(supervisors_router)
app.include_router(client_admins_router)
app.include_router(mobile_devices_router)
app.include_router(test_push_router)

@app.get("/prueba")
def root():
    return {
        "mensaje": "API funcionando"
    }

@app.get("/public/.env")
def fake_env():
    return PlainTextResponse(
        "Fuck you, this is not the real .env file. Nice try! 😜",
    )
#Para la app mobile





