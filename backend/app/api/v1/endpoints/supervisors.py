from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, EmailStr, Field
from sqlalchemy.orm import Session

from app.api.deps import get_db, get_current_user
from app.models.models import User, UserRoleEnum
from app.services.auth_service import create_user


router = APIRouter(
    prefix="/supervisors",
    tags=["Supervisores"],
)


# =========================================================
# SCHEMAS
# =========================================================

class SupervisorCreate(BaseModel):
    name: str = Field(
        min_length=2,
        max_length=100,
        pattern=r"^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$",
    )

    email: EmailStr

    password: str = Field(
        min_length=6,
        max_length=128,
    )


class SupervisorUpdate(BaseModel):
    name: str = Field(
        min_length=2,
        max_length=100,
        pattern=r"^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$",
    )

    email: EmailStr

# =========================================================
# PERMISOS
# =========================================================

def get_supervisor_admin(
    current_user: dict = Depends(get_current_user),
):
    """
    Solo client_admin puede administrar supervisores.
    """

    if current_user.get("role") != "client_admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Solo un administrador del cliente puede administrar supervisores.",
        )

    return current_user


# =========================================================
# LISTAR SUPERVISORES
# =========================================================

@router.get("")
def get_supervisors(
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_supervisor_admin),
):
    client_id = current_user["client_id"]

    supervisors = (
        db.query(User)
        .filter(
            User.client_id == client_id,
            User.role == UserRoleEnum.supervisor,
        )
        .order_by(User.name)
        .all()
    )

    return [
        {
            "id": supervisor.id,
            "name": supervisor.name,
            "email": supervisor.email,
            "is_active": supervisor.is_active,
        }
        for supervisor in supervisors
    ]


# =========================================================
# CREAR SUPERVISOR
# =========================================================

@router.post(
    "",
    status_code=status.HTTP_201_CREATED,
)
def create_supervisor(
    supervisor: SupervisorCreate,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_supervisor_admin),
):
    client_id = current_user["client_id"]

    result = create_user(
        db=db,
        client_id=client_id,
        name=supervisor.name.strip(),
        email=str(supervisor.email),
        password=supervisor.password,
        role=UserRoleEnum.supervisor.value,
    )

    new_supervisor = (
        db.query(User)
        .filter(
            User.email == str(supervisor.email)
        )
        .first()
    )

    return {
        "message": result["message"],
        "supervisor": {
            "id": new_supervisor.id,
            "name": new_supervisor.name,
            "email": new_supervisor.email,
            "is_active": new_supervisor.is_active,
        },
    }

@router.put("/{supervisor_id}")
def update_supervisor(
    supervisor_id: int,
    data: SupervisorUpdate,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_supervisor_admin),
):
    client_id = current_user["client_id"]

    # Buscar supervisor, limitado al cliente del administrador
    supervisor = (
        db.query(User)
        .filter(
            User.id == supervisor_id,
            User.client_id == client_id,
            User.role == UserRoleEnum.supervisor,
        )
        .first()
    )

    if not supervisor:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Supervisor no encontrado.",
        )

    new_email = str(data.email).strip().lower()

    # Comprobar que el nuevo email no pertenezca a otro usuario
    existing_user = (
        db.query(User)
        .filter(
            User.email == new_email,
            User.id != supervisor_id,
        )
        .first()
    )

    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="El correo ya está registrado.",
        )

    supervisor.name = data.name.strip()
    supervisor.email = new_email

    try:
        db.commit()
        db.refresh(supervisor)

    except Exception:
        db.rollback()

        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="No fue posible actualizar el supervisor.",
        )

    return {
        "message": "Supervisor actualizado correctamente.",
        "supervisor": {
            "id": supervisor.id,
            "name": supervisor.name,
            "email": supervisor.email,
            "is_active": supervisor.is_active,
        },
    }