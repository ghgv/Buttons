# contadores/app/api/v1/endpoints/clients.py

from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from app.api.deps import get_db, get_admin_user
from app.models.models import Client
from app.schemas.client import ClientCreate
from app.services.clients import create_client, get_clients, get_sedes_by_client_id

router = APIRouter(prefix="/clients", tags=["Gestión de Clientes"])

@router.post("/", status_code=status.HTTP_201_CREATED)
def registrar_nuevo_cliente(
    client_in: ClientCreate, 
    db: Session = Depends(get_db),
    # current_user: dict = Depends(get_admin_user) # <- Aquí usamos el candado correcto
):
    create_client(db=db, client_data=client_in)
    return f"cliente creado"

@router.get("/", status_code=status.HTTP_200_OK)   
def obtener_clientes(
    db: Session = Depends(get_db),
    # current_user: dict = Depends(get_admin_user) # <- Aquí usamos el candado correcto
):
    return get_clients(db=db)


@router.get("/locales")
def obtener_clientes_locales(
    db: Session = Depends(get_db),
):
    return get_clients(db=db)


@router.get("/locales", status_code=status.HTTP_200_OK)
def obtener_clientes_locales(
    db: Session = Depends(get_db),
):
    return get_clients(db=db)

@router.get("/{client_id}", status_code=status.HTTP_200_OK)
def obtener_sedes_por_id_cliente(
    client_id: int,
    db: Session = Depends(get_db),
    # current_user: dict = Depends(get_admin_user) # <- Aquí usamos el candado correcto
):
    return get_sedes_by_client_id(db=db, client_id=client_id)



