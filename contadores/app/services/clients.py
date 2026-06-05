from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from app.models.models import Client
from app.schemas.client import ClientCreate

def create_client(db: Session, client_data: ClientCreate):
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
        id =client_data.id,
        nit=client_data.nit,
        name=client_data.name,
        email=client_data.email,
        address=client_data.address,
        lat=client_data.lat,
        lon=client_data.lon
    )

    try:

        db.add(new_client)
        
        # 4. Confirmar los cambios en MySQL (Hacer el INSERT)
        db.commit()
        
        # 5. Refrescar para obtener el ID autoincremental que asignó MySQL
        db.refresh(new_client)
        
        return new_client

    except Exception as e:
        # Si algo falla a nivel de base de datos (ej. se cae la conexión), deshacemos todo
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error interno al guardar el cliente: {str(e)}"
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