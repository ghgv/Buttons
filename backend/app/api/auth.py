from fastapi import APIRouter, HTTPException, Depends, status
from sqlalchemy.orm import Session
from pydantic import BaseModel, EmailStr, Field 

from app.api.deps import get_db # <-- Importamos nuestra conexión
from app.services.auth_service import create_user, authenticate_user
from app.core.security import create_access_token

router = APIRouter(prefix="/auth", tags=["Autenticación login y registro"])

class UserRegister(BaseModel):
    client_id: int = Field(gt=0, description="ID del cliente al que pertenece el usuario debe ser mayor a 0")
    name: str = Field(
        min_length=2, 
        max_length=100, 
        pattern=r"^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$",
        json_schema_extra={"strip_whitespace": True}
    )
    email: EmailStr = Field(min_length=2, description="Correo electrónico del usuario")
    password: str = Field(min_length=6, description="Contraseña del usuario, mínimo 6 caracteres")
    role: str = Field(pattern="^(nubeware_admin|client_admin|supervisor)$", description="Rol del usuario")
    
class UserLogin(BaseModel):
    email: EmailStr
    password: str = Field(min_length=1)

@router.post("/register", status_code=status.HTTP_201_CREATED)
def register(user: UserRegister, db: Session = Depends(get_db)):
    # Pasamos la variable 'db' al servicio
    result = create_user(
        db=db,
        client_id=user.client_id,
        name=user.name,
        email=user.email,
        password=user.password,
        role=user.role
    )
    return {"message": result["message"]}

@router.post("/login")
def login(credentials: UserLogin, db: Session = Depends(get_db)):
    # Pasamos la variable 'db' al servicio
    user = authenticate_user(db=db, email=credentials.email, password=credentials.password)
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Correo o contraseña incorrectos",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Extraemos el valor del rol (SQLAlchemy lo devuelve como un Enum, lo pasamos a string)
    user_role_str = user.role.value if hasattr(user.role, 'value') else user.role
    
    # Se crea el token JWT
    access_token = create_access_token(
        data={
            "sub": user.email, 
            "role": user_role_str,
            "client_id": user.client_id
        }
    )
    
    return {
        "access_token": access_token, 
        "token_type": "bearer",
        "user_info": {
            "name": user.name,
            "role": user_role_str
        }
    }