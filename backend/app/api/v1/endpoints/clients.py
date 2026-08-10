# contadores/app/api/v1/endpoints/clients.py
from fastapi import APIRouter, Depends, status, HTTPException
from sqlalchemy.orm import Session

from app.models.models import Client
from app.schemas.client import ClientCreate, ClientUpdate
from app.api.deps import get_db, get_current_user

from app.services.clients import (
    create_client,
    get_clients,
    get_sedes_by_client_id,
    update_client,
    delete_client,
)

router = APIRouter(prefix="/clients", tags=["Gestión de Clientes"])

@router.post("/", status_code=status.HTTP_201_CREATED)
def registrar_nuevo_cliente(
    client_in: ClientCreate,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    role = current_user.get("role")
    tenant_id = current_user.get("tenant_id")

    if role == "client_admin":
        if tenant_id is None:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="El usuario no tiene un tenant asignado.",
            )

        return create_client(
            db=db,
            client_data=client_in,
            tenant_id=tenant_id,
        )

    raise HTTPException(
        status_code=status.HTTP_403_FORBIDDEN,
        detail="Solo un administrador del tenant puede crear subclientes.",
    )
@router.get("/", status_code=status.HTTP_200_OK)
def obtener_clientes(
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    role = current_user.get("role")
    tenant_id = current_user.get("tenant_id")

    # Nubeware ve todos los clientes
    if role == "nubeware_admin":
        return get_clients(db=db)

    # Administrador ve todos los clientes de su tenant
    if role == "client_admin":
        if tenant_id is None:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="El usuario no tiene un tenant asignado.",
            )

        return (
            db.query(Client)
            .filter(Client.tenant_id == tenant_id)
            .order_by(Client.name)
            .all()
        )

    raise HTTPException(
        status_code=status.HTTP_403_FORBIDDEN,
        detail="No autorizado para consultar clientes.",
    )

@router.get("/locales", status_code=status.HTTP_200_OK)
def obtener_clientes_locales(
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    if current_user.get("role") != "nubeware_admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Solo Nubeware puede consultar todos los clientes.",
        )

    return get_clients(db=db)





@router.get("/{client_id}", status_code=status.HTTP_200_OK)
def obtener_sedes_por_id_cliente(
    client_id: int,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    role = current_user.get("role")
    tenant_id = current_user.get("tenant_id")

    # Nubeware puede consultar cualquier cliente
    if role == "nubeware_admin":
        return get_sedes_by_client_id(
            db=db,
            client_id=client_id,
        )

    # client_admin puede consultar cualquier cliente
    # que pertenezca a su mismo tenant
    if role == "client_admin":
        if tenant_id is None:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="El usuario no tiene un tenant asignado.",
            )

        client = (
            db.query(Client)
            .filter(
                Client.id == client_id,
                Client.tenant_id == tenant_id,
            )
            .first()
        )

        if not client:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Cliente no encontrado dentro de tu organización.",
            )

        return get_sedes_by_client_id(
            db=db,
            client_id=client_id,
        )

    raise HTTPException(
        status_code=status.HTTP_403_FORBIDDEN,
        detail="No autorizado.",
    )

@router.put("/{client_id}", status_code=status.HTTP_200_OK)
def actualizar_cliente(
    client_id: int,
    client_in: ClientUpdate,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    role = current_user.get("role")
    tenant_id = current_user.get("tenant_id")

    # Nubeware puede editar cualquier cliente
    if role == "nubeware_admin":
        return update_client(
            db=db,
            client_id=client_id,
            client_data=client_in,
        )

    # client_admin solamente puede editar clientes de su tenant
    if role == "client_admin":
        if tenant_id is None:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="El usuario no tiene un tenant asignado.",
            )

        client = (
            db.query(Client)
            .filter(
                Client.id == client_id,
                Client.tenant_id == tenant_id,
            )
            .first()
        )

        if not client:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Cliente no encontrado dentro de tu organización.",
            )

        return update_client(
            db=db,
            client_id=client_id,
            client_data=client_in,
        )

    raise HTTPException(
        status_code=status.HTTP_403_FORBIDDEN,
        detail="No autorizado.",
    )

@router.delete("/{client_id}", status_code=status.HTTP_200_OK)
def eliminar_cliente(
    client_id: int,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    role = current_user.get("role")
    tenant_id = current_user.get("tenant_id")

    # Nubeware puede eliminar cualquier cliente
    if role == "nubeware_admin":
        return delete_client(
            db=db,
            client_id=client_id,
        )

    # client_admin solamente clientes de su tenant
    if role == "client_admin":
        if tenant_id is None:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="El usuario no tiene un tenant asignado.",
            )

        client = (
            db.query(Client)
            .filter(
                Client.id == client_id,
                Client.tenant_id == tenant_id,
            )
            .first()
        )

        if not client:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Cliente no encontrado dentro de tu organización.",
            )

        return delete_client(
            db=db,
            client_id=client_id,
        )

    raise HTTPException(
        status_code=status.HTTP_403_FORBIDDEN,
        detail="No autorizado.",
    )

