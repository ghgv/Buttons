from fastapi import APIRouter, HTTPException, Depends, status
from sqlalchemy.orm import Session
from pydantic import BaseModel, EmailStr, Field

from app.api.deps import get_db
from app.services.auth_service import create_user, authenticate_user
from app.core.security import create_access_token
from app.core.logger import logger

import hashlib
import secrets

from datetime import datetime, timedelta
from pydantic import EmailStr

from app.models.models import User, PasswordResetToken
from app.core.security import get_password_hash

from app.services.mail_service import send_password_reset_email

router = APIRouter(
    prefix="/auth",
    tags=["Autenticación login y registro"]
)


class UserRegister(BaseModel):
    client_id: int = Field(
        gt=0,
        description="ID del cliente al que pertenece el usuario debe ser mayor a 0"
    )

    name: str = Field(
        min_length=2,
        max_length=100,
        pattern=r"^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$",
        json_schema_extra={"strip_whitespace": True}
    )

    email: EmailStr = Field(
        min_length=2,
        description="Correo electrónico del usuario"
    )

    password: str = Field(
        min_length=6,
        description="Contraseña del usuario, mínimo 6 caracteres"
    )

    role: str = Field(
        pattern="^(nubeware_admin|client_admin|supervisor|technician)$",
        description="Rol del usuario"
    )


class UserLogin(BaseModel):
    email: EmailStr
    password: str = Field(min_length=1)


class ForgotPasswordRequest(BaseModel):
    email: EmailStr


class ResetPasswordRequest(BaseModel):
    token: str = Field(min_length=20)
    password: str = Field(min_length=6)

@router.post(
    "/register",
    status_code=status.HTTP_201_CREATED
)
def register(
    user: UserRegister,
    db: Session = Depends(get_db)
):
    result = create_user(
        db=db,
        client_id=user.client_id,
        name=user.name,
        email=user.email,
        password=user.password,
        role=user.role
    )

    return {
        "message": result["message"]
    }


@router.post("/login")
def login(
    credentials: UserLogin,
    db: Session = Depends(get_db)
):
    user = authenticate_user(
        db=db,
        email=credentials.email,
        password=credentials.password
    )

    logger.info(
        f"[Usuarios] Intento de login para email: "
        f"{credentials.email} | "
        f"Usuario encontrado: {'Sí' if user else 'No'}"
    )

    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Correo o contraseña incorrectos",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # SQLAlchemy puede devolver el rol como Enum.
    user_role_str = (
        user.role.value
        if hasattr(user.role, "value")
        else user.role
    )

    # Creamos el JWT.
    #
    # IMPORTANTE:
    # user_id permitirá identificar inequívocamente
    # quién está realizando una asignación.
    logger.info(
    f"LOGIN -> user={user.email} "
    f"user_id={user.id} "
    f"client_id={user.client_id} "
    f"tenant_id={user.tenant_id}"
    )



    access_token = create_access_token(
        data={
            "sub": user.email,
            "user_id": user.id,
            "role": user_role_str,
            "client_id": user.client_id,
            "tenant_id": user.tenant_id,
        }
    )

    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user_info": {
            "id": user.id,
            "name": user.name,
            "email": user.email,
            "role": user_role_str,
            "client_id": user.client_id,
            "tenant_id": user.tenant_id,
        }
    }

@router.post("/forgot-password")
def forgot_password(
    data: ForgotPasswordRequest,
    db: Session = Depends(get_db),
):
    email = str(data.email).strip().lower()

    user = (
        db.query(User)
        .filter(
            User.email == email,
            User.is_active == True,
        )
        .first()
    )

    # Importante:
    # no revelar si un correo existe o no.
    if not user:
        return {
            "message": (
                "Si el correo está registrado, "
                "recibirás instrucciones para recuperar tu contraseña."
            )
        }

    # Invalida tokens anteriores todavía pendientes.
    now = datetime.utcnow()

    (
        db.query(PasswordResetToken)
        .filter(
            PasswordResetToken.user_id == user.id,
            PasswordResetToken.used_at.is_(None),
        )
        .update(
            {
                PasswordResetToken.used_at: now,
            },
            synchronize_session=False,
        )
    )

    # Token que posteriormente enviaremos por email.
    token = secrets.token_urlsafe(32)

    token_hash = hashlib.sha256(
        token.encode("utf-8")
    ).hexdigest()

    reset = PasswordResetToken(
        user_id=user.id,
        token_hash=token_hash,
        expires_at=now + timedelta(minutes=30),
    )

    db.add(reset)
    db.commit()
    try:
        send_password_reset_email(
        email=user.email,
        token=token,
        )
    except Exception:
        # No exponemos detalles SMTP al usuario.
        # El token queda creado, pero registraremos
        # posteriormente este error en el logger.
        pass

    return {
        "message": (
            "Si el correo está registrado, "
            "recibirás instrucciones para recuperar tu contraseña."
        ),

        # SOLO durante las pruebas.
        # Esto se elimina cuando implementemos el correo.
        
    }


@router.post("/reset-password")
def reset_password(
    data: ResetPasswordRequest,
    db: Session = Depends(get_db),
):
    token_hash = hashlib.sha256(
        data.token.encode("utf-8")
    ).hexdigest()

    reset = (
        db.query(PasswordResetToken)
        .filter(
            PasswordResetToken.token_hash == token_hash,
            PasswordResetToken.used_at.is_(None),
        )
        .first()
    )

    if not reset:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="El enlace de recuperación no es válido.",
        )

    now = datetime.utcnow()

    if reset.expires_at < now:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="El enlace de recuperación ha expirado.",
        )

    user = (
        db.query(User)
        .filter(
            User.id == reset.user_id,
            User.is_active == True,
        )
        .first()
    )

    if not user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No fue posible restablecer la contraseña.",
        )

    user.password_hash = get_password_hash(data.password)

    # Token de un solo uso
    reset.used_at = now

    db.commit()

    return {
        "message": "Contraseña actualizada correctamente."
    }