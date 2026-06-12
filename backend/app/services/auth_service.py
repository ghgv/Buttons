from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from app.models.models import User
from app.core.security import get_password_hash, verify_password

def create_user(db: Session, client_id: int, name: str, email: str, password: str, role: str):
    # 1. Verificamos si el correo ya existe
    existing_user = db.query(User).filter(User.email == email).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="El correo ya está registrado."
        )

    # 2. Encriptamos la contraseña y creamos el modelo
    hashed_pwd = get_password_hash(password)
    
    nuevo_usuario = User(
        client_id=client_id,
        name=name,
        email=email,
        password_hash=hashed_pwd,
        role=role
    )
    
    try:
        # 3. Guardamos en la base de datos
        db.add(nuevo_usuario)
        db.commit()
        db.refresh(nuevo_usuario)
        
        return {"success": True, "message": "Usuario registrado exitosamente"}
        
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error interno al guardar el usuario: {str(e)}"
        )

def authenticate_user(db: Session, email: str, password: str):
    # 1. Buscamos al usuario por correo y que esté activo
    user = db.query(User).filter(User.email == email, User.is_active == True).first()
    
    if not user:
        return None
        
    # 2. Verificamos que las contraseñas coincidan
    if not verify_password(password, user.password_hash):
        return None
        
    return user