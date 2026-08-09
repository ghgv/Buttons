from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, Field
from sqlalchemy.orm import Session
from sqlalchemy import func

from app.api.deps import (
    get_db,
    get_assignment_manager,
    get_current_user,
)

from app.models.models import (
    User,
    UserRoleEnum,
    Bathroom,
    Level,
    Sede,
    BathroomAssignment,
)


router = APIRouter(
    prefix="/bathroom-assignments",
    tags=["Asignaciones de baños"]
)


# =========================================================
# SCHEMAS
# =========================================================

class AssignmentCreate(BaseModel):
    bathroom_id: int = Field(gt=0)
    technician_id: int = Field(gt=0)


# =========================================================
# FUNCIONES AUXILIARES
# =========================================================

def get_bathroom_client_id(db: Session, bathroom_id: int):
    """
    Obtiene el cliente propietario de un baño siguiendo:

    bathroom -> level -> sede -> client
    """

    result = (
        db.query(Sede.client_id)
        .join(Level, Level.sede_id == Sede.id)
        .join(Bathroom, Bathroom.level_id == Level.id)
        .filter(Bathroom.id == bathroom_id)
        .first()
    )

    if not result:
        return None

    return result[0]


# =========================================================
# TÉCNICOS DISPONIBLES
# =========================================================

@router.get("/technicians")
def get_technicians(
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_assignment_manager),
):
    """
    Lista los técnicos pertenecientes al mismo cliente
    del usuario que administra las asignaciones.
    """

    client_id = current_user["client_id"]

    technicians = (
        db.query(User)
        .filter(
            User.client_id == client_id,
            User.role == UserRoleEnum.technician,
            User.is_active == True,
        )
        .order_by(User.name)
        .all()
    )

    return [
        {
            "id": technician.id,
            "name": technician.name,
            "email": technician.email,
        }
        for technician in technicians
    ]


# =========================================================
# BAÑOS DEL CLIENTE
# =========================================================

@router.get("/bathrooms")
def get_bathrooms(
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_assignment_manager),
):
    """
    Lista los baños pertenecientes al cliente del supervisor.
    """

    client_id = current_user["client_id"]

    bathrooms = (
        db.query(
            Bathroom.id,
            Bathroom.name,
            Bathroom.gender,
            Bathroom.description,
            Level.id.label("level_id"),
            Level.name.label("level_name"),
            Level.floor,
            Sede.id.label("sede_id"),
            Sede.name.label("sede_name"),
        )
        .join(Level, Bathroom.level_id == Level.id)
        .join(Sede, Level.sede_id == Sede.id)
        .filter(Sede.client_id == client_id)
        .order_by(
            Sede.name,
            Level.floor,
            Bathroom.name,
        )
        .all()
    )

    return [
        {
            "id": row.id,
            "name": row.name,
            "gender": (
                row.gender.value
                if hasattr(row.gender, "value")
                else row.gender
            ),
            "description": row.description,
            "level": {
                "id": row.level_id,
                "name": row.level_name,
                "floor": row.floor,
            },
            "sede": {
                "id": row.sede_id,
                "name": row.sede_name,
            },
        }
        for row in bathrooms
    ]


# =========================================================
# LISTAR ASIGNACIONES
# =========================================================

@router.get("")
def get_assignments(
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_assignment_manager),
):
    """
    Lista las asignaciones activas del cliente.
    """

    client_id = current_user["client_id"]

    rows = (
        db.query(
            BathroomAssignment,
            Bathroom,
            Level,
            Sede,
            User,
        )
        .join(
            Bathroom,
            Bathroom.id == BathroomAssignment.bathroom_id,
        )
        .join(
            Level,
            Level.id == Bathroom.level_id,
        )
        .join(
            Sede,
            Sede.id == Level.sede_id,
        )
        .join(
            User,
            User.id == BathroomAssignment.technician_id,
        )
        .filter(
            Sede.client_id == client_id,
            BathroomAssignment.is_active == True,
        )
        .order_by(
            Sede.name,
            Level.floor,
            Bathroom.name,
            User.name,
        )
        .all()
    )

    return [
        {
            "id": assignment.id,

            "bathroom": {
                "id": bathroom.id,
                "name": bathroom.name,
                "gender": (
                    bathroom.gender.value
                    if hasattr(bathroom.gender, "value")
                    else bathroom.gender
                ),
            },

            "level": {
                "id": level.id,
                "name": level.name,
                "floor": level.floor,
            },

            "sede": {
                "id": sede.id,
                "name": sede.name,
            },

            "technician": {
                "id": technician.id,
                "name": technician.name,
                "email": technician.email,
            },

            "assigned_at": assignment.assigned_at,
        }
        for (
            assignment,
            bathroom,
            level,
            sede,
            technician,
        ) in rows
    ]


# =========================================================
# CREAR ASIGNACIÓN
# =========================================================

@router.post("", status_code=status.HTTP_201_CREATED)
def create_assignment(
    data: AssignmentCreate,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_assignment_manager),
):
    """
    Asigna un técnico a un baño.
    """

    client_id = current_user["client_id"]
    user_id = current_user.get("user_id")

    if user_id is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="El token no contiene user_id. Inicia sesión nuevamente.",
        )

    # -----------------------------------------------------
    # Validar baño
    # -----------------------------------------------------

    bathroom_client_id = get_bathroom_client_id(
        db,
        data.bathroom_id,
    )

    if bathroom_client_id is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="El baño no existe.",
        )

    if bathroom_client_id != client_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="No puedes asignar baños de otro cliente.",
        )

    # -----------------------------------------------------
    # Validar técnico
    # -----------------------------------------------------

    technician = (
        db.query(User)
        .filter(User.id == data.technician_id)
        .first()
    )

    if not technician:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="El técnico no existe.",
        )

    technician_role = (
        technician.role.value
        if hasattr(technician.role, "value")
        else technician.role
    )

    if technician_role != "technician":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="El usuario seleccionado no es técnico.",
        )

    if technician.client_id != client_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="El técnico pertenece a otro cliente.",
        )

    if not technician.is_active:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="El técnico está inactivo.",
        )

    # -----------------------------------------------------
    # Evitar asignación duplicada
    # -----------------------------------------------------

    existing = (
        db.query(BathroomAssignment)
        .filter(
            BathroomAssignment.bathroom_id == data.bathroom_id,
            BathroomAssignment.technician_id == data.technician_id,
            BathroomAssignment.is_active == True,
        )
        .first()
    )

    if existing:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="El técnico ya está asignado a este baño.",
        )

    # -----------------------------------------------------
    # Crear
    # -----------------------------------------------------

    assignment = BathroomAssignment(
        bathroom_id=data.bathroom_id,
        technician_id=data.technician_id,
        assigned_by=user_id,
        is_active=True,
    )

    db.add(assignment)
    db.commit()
    db.refresh(assignment)

    return {
        "message": "Baño asignado correctamente.",
        "assignment_id": assignment.id,
        "bathroom_id": assignment.bathroom_id,
        "technician_id": assignment.technician_id,
    }


# =========================================================
# DESASIGNAR
# =========================================================

@router.delete("/{assignment_id}")
def remove_assignment(
    assignment_id: int,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_assignment_manager),
):
    """
    Desactiva una asignación sin borrar su historial.
    """

    client_id = current_user["client_id"]

    assignment = (
        db.query(BathroomAssignment)
        .filter(
            BathroomAssignment.id == assignment_id,
            BathroomAssignment.is_active == True,
        )
        .first()
    )

    if not assignment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="La asignación no existe.",
        )

    bathroom_client_id = get_bathroom_client_id(
        db,
        assignment.bathroom_id,
    )

    if bathroom_client_id != client_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="No puedes modificar asignaciones de otro cliente.",
        )

    assignment.is_active = False
    assignment.unassigned_at = func.now()

    db.commit()

    return {
        "message": "Asignación eliminada correctamente."
    }