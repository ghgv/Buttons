from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, EmailStr, Field
from sqlalchemy.orm import Session

from app.api.deps import get_db, get_current_user
from app.models.models import User, Client, UserRoleEnum
from app.services.auth_service import create_user


router = APIRouter(
    prefix="/client-admins",
    tags=["Administradores de Clientes"],
)


class ClientAdminCreate(BaseModel):
    client_id: int

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


class ClientAdminUpdate(BaseModel):
    client_id: int

    name: str = Field(
        min_length=2,
        max_length=100,
        pattern=r"^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$",
    )

    email: EmailStr


def require_nubeware_admin(
    current_user: dict = Depends(get_current_user),
):
    if current_user.get("role") != "nubeware_admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Solo Nubeware puede administrar los administradores de clientes.",
        )

    return current_user


@router.get("")
def get_client_admins(
    db: Session = Depends(get_db),
    current_user: dict = Depends(require_nubeware_admin),
):
    admins = (
        db.query(User, Client)
        .join(Client, Client.id == User.client_id)
        .filter(User.role == UserRoleEnum.client_admin)
        .order_by(Client.name, User.name)
        .all()
    )

    return [
        {
            "id": user.id,
            "client_id": user.client_id,
            "client_name": client.name,
            "name": user.name,
            "email": user.email,
            "is_active": user.is_active,
        }
        for user, client in admins
    ]


@router.post("", status_code=status.HTTP_201_CREATED)
def create_client_admin(
    data: ClientAdminCreate,
    db: Session = Depends(get_db),
    current_user: dict = Depends(require_nubeware_admin),
):
    client = (
        db.query(Client)
        .filter(Client.id == data.client_id)
        .first()
    )

    if not client:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Cliente no encontrado.",
        )

    email = str(data.email).strip().lower()

    result = create_user(
        db=db,
        client_id=data.client_id,
        tenant_id=client.tenant_id,
        name=data.name.strip(),
        email=email,
        password=data.password,
        role=UserRoleEnum.client_admin.value,
    )

    new_admin = (
        db.query(User)
        .filter(User.email == email)
        .first()
    )

    return {
        "message": result["message"],
        "administrator": {
            "id": new_admin.id,
            "client_id": new_admin.client_id,
            "client_name": client.name,
            "name": new_admin.name,
            "email": new_admin.email,
            "is_active": new_admin.is_active,
        },
    }


@router.put("/{admin_id}")
def update_client_admin(
    admin_id: int,
    data: ClientAdminUpdate,
    db: Session = Depends(get_db),
    current_user: dict = Depends(require_nubeware_admin),
):
    admin = (
        db.query(User)
        .filter(
            User.id == admin_id,
            User.role == UserRoleEnum.client_admin,
        )
        .first()
    )

    if not admin:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Administrador no encontrado.",
        )

    client = (
        db.query(Client)
        .filter(Client.id == data.client_id)
        .first()
    )

    if not client:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Cliente no encontrado.",
        )

    new_email = str(data.email).strip().lower()

    existing_user = (
        db.query(User)
        .filter(
            User.email == new_email,
            User.id != admin_id,
        )
        .first()
    )

    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="El correo ya está registrado.",
        )

    admin.client_id = data.client_id
    admin.name = data.name.strip()
    admin.email = new_email

    try:
        db.commit()
        db.refresh(admin)

    except Exception:
        db.rollback()

        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="No fue posible actualizar el administrador.",
        )

    return {
        "message": "Administrador actualizado correctamente.",
        "administrator": {
            "id": admin.id,
            "client_id": admin.client_id,
            "client_name": client.name,
            "name": admin.name,
            "email": admin.email,
            "is_active": admin.is_active,
        },
    }


@router.delete("/{admin_id}")
def delete_client_admin(
    admin_id: int,
    db: Session = Depends(get_db),
    current_user: dict = Depends(require_nubeware_admin),
):
    admin = (
        db.query(User)
        .filter(
            User.id == admin_id,
            User.role == UserRoleEnum.client_admin,
        )
        .first()
    )

    if not admin:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Administrador no encontrado.",
        )

    try:
        db.delete(admin)
        db.commit()

    except Exception:
        db.rollback()

        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="No fue posible eliminar el administrador.",
        )

    return {
        "message": "Administrador eliminado correctamente."
    }