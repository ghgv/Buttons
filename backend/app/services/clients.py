from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from app.models.models import Client
from app.schemas.client import ClientCreate
from app.core.logger import logger
from app.schemas.client import ClientCreate, ClientUpdate
from app.models.models import Client, Tenant

def create_client(
    db: Session,
    client_data: ClientCreate,
    tenant_id: int | None = None,):
    """
    Recibe los datos validados, crea el objeto SQLAlchemy y lo guarda en la base de datos.
    """
    if client_data.email:
        existing_client = db.query(Client).filter(Client.email == client_data.email).first()
        if existing_client:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Ya existe un cliente registrado con este correo electrónico."
            )
            
    if client_data.nit:
        existing_nit = db.query(Client).filter(Client.nit == client_data.nit).first()
        if existing_nit:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Ya existe un cliente registrado con este NIT."
            )

    new_client = Client(
        nit=client_data.nit,
        name=client_data.name,
        email=client_data.email,
        address=client_data.address,
        lat=client_data.lat,
        lon=client_data.lon,
        tenant_id=tenant_id,
    )

    try:
        db.add(new_client)
        db.commit()
        db.refresh(new_client)
        logger.info(f"[Clientes] Cliente creado exitosamente | ID Interno: {new_client.id} | Nombre: {client_data.name} | NIT: {client_data.nit} | Email: {client_data.email}")
        return new_client

    except Exception as e:
        # Si algo falla a nivel de base de datos (ej. se cae la conexión), deshacemos todo
        db.rollback()
        logger.error(f"[Clientes] Error crítico en base de datos al crear cliente: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error interno al guardar el cliente: {str(e)}"
        )

def create_tenant_client(
    db: Session,
    client_data: ClientCreate,
):
    """
    Crea un tenant y su cliente principal en una sola transacción.
    Esta operación está pensada para nubeware_admin.
    """

    # Validar email duplicado
    if client_data.email:
        existing_client = (
            db.query(Client)
            .filter(Client.email == client_data.email)
            .first()
        )

        if existing_client:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Ya existe un cliente registrado con este correo electrónico.",
            )

    # Validar NIT duplicado
    if client_data.nit:
        existing_nit = (
            db.query(Client)
            .filter(Client.nit == client_data.nit)
            .first()
        )

        if existing_nit:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Ya existe un cliente registrado con este NIT.",
            )

    try:
        # 1. Crear tenant
        new_tenant = Tenant(
            name=client_data.name,
            nit=str(client_data.nit) if client_data.nit is not None else None,
            email=client_data.email,
            address=client_data.address,
        )

        db.add(new_tenant)

        # Ejecuta el INSERT sin hacer COMMIT.
        # Así obtenemos new_tenant.id y seguimos dentro
        # de la misma transacción.
        db.flush()

        # 2. Crear cliente principal del tenant
        new_client = Client(
            nit=client_data.nit,
            name=client_data.name,
            email=client_data.email,
            address=client_data.address,
            lat=client_data.lat,
            lon=client_data.lon,
            tenant_id=new_tenant.id,
        )

        db.add(new_client)

        # 3. Confirmar ambas operaciones juntas
        db.commit()

        db.refresh(new_tenant)
        db.refresh(new_client)

        logger.info(
            f"[Clientes] Tenant y cliente creados | "
            f"Tenant ID: {new_tenant.id} | "
            f"Client ID: {new_client.id} | "
            f"Nombre: {client_data.name}"
        )

        return new_client

    except HTTPException:
        db.rollback()
        raise

    except Exception as e:
        db.rollback()

        logger.error(
            f"[Clientes] Error creando tenant/cliente: {e}"
        )

        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error interno al crear tenant y cliente: {str(e)}",
        )


def get_clients(db: Session):
    """
    Función para obtener todos los clientes de la base de datos.
    """
    return db.query(Client).all()   

def get_sedes_by_client_id(db: Session, client_id: int):
    """
    Función para obtener las sedes asociadas a un cliente específico.
    """
    client = db.query(Client).filter(Client.id == client_id).first()
    if not client:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Cliente no encontrado."
        )
    return client.sedes  # Asumiendo que el modelo Client tiene una relación 'sedes' definida
    print ("Obteniendo sedes para el cliente con ID:", client.sedes)

def update_client(
    db: Session,
    client_id: int,
    client_data: ClientUpdate,
):
    client = (
        db.query(Client)
        .filter(Client.id == client_id)
        .first()
    )

    if not client:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Cliente no encontrado.",
        )

    # Comprobar email duplicado, excluyendo al propio cliente
    if client_data.email is not None:
        existing_email = (
            db.query(Client)
            .filter(
                Client.email == client_data.email,
                Client.id != client_id,
            )
            .first()
        )

        if existing_email:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Ya existe otro cliente registrado con este correo electrónico.",
            )

    # Comprobar NIT duplicado, excluyendo al propio cliente
    if client_data.nit is not None:
        existing_nit = (
            db.query(Client)
            .filter(
                Client.nit == client_data.nit,
                Client.id != client_id,
            )
            .first()
        )

        if existing_nit:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Ya existe otro cliente registrado con este NIT.",
            )

    update_data = client_data.model_dump(exclude_unset=True)

    for field, value in update_data.items():
        setattr(client, field, value)

    try:
        db.commit()
        db.refresh(client)

        logger.info(
            f"[Clientes] Cliente actualizado | "
            f"ID: {client.id} | Nombre: {client.name}"
        )

        return client

    except Exception as e:
        db.rollback()

        logger.error(
            f"[Clientes] Error actualizando cliente {client_id}: {e}"
        )

        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error interno al actualizar el cliente.",
        )

def delete_client(
    db: Session,
    client_id: int,
):
    client = (
        db.query(Client)
        .filter(Client.id == client_id)
        .first()
    )

    if not client:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Cliente no encontrado.",
        )

    try:
        db.delete(client)
        db.commit()

        logger.info(
            f"[Clientes] Cliente eliminado | "
            f"ID: {client_id} | Nombre: {client.name}"
        )

        return {
            "message": "Cliente eliminado correctamente."
        }

    except Exception as e:
        db.rollback()

        logger.error(
            f"[Clientes] Error eliminando cliente {client_id}: {e}"
        )

        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error interno al eliminar el cliente.",
        )