# contadores/app/api/v1/endpoints/clients.py

from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

# 1. Importamos la conexión real a BD y el candado de seguridad
from app.api.deps import get_db, get_admin_user

# 2. Importamos el modelo de base de datos necesario para el GET
from app.models.models import Client

# Esquemas y Servicios
from app.schemas.client import ClientCreate
from app.services.clients import create_client

router = APIRouter(prefix="/clients", tags=["Gestión de Clientes"])

@router.post("/", status_code=status.HTTP_201_CREATED)
def registrar_nuevo_cliente(
    client_in: ClientCreate, 
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_admin_user) # <- Aquí usamos el candado correcto
):
    create_client(db=db, client_data=client_in)
    return "ok"

@router.get("/", status_code=status.HTTP_200_OK)   
def obtener_clientes(
    # Las dependencias VAN AQUÍ, en los parámetros
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_admin_user) # Protegemos para que solo admins vean la lista
):
    # Sin guion bajo en query
    clientes = db.query(Client).all()
    return clientes