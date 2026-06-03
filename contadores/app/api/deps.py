
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
import jwt

from app.core.database import SessionLocal

from app.core.security import SECRET_KEY, ALGORITHM
def get_db():
    """Entrega una sesión de base de datos y la cierra al terminar."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")

def get_current_user(token: str = Depends(oauth2_scheme)):
    """Extrae y valida el Token JWT de la petición."""
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="No se pudieron validar las credenciales",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        role: str = payload.get("role")
        client_id: int = payload.get("client_id")
        
        if email is None:
            raise credentials_exception
            
        return {"email": email, "role": role, "client_id": client_id}
        
    except jwt.ExpiredSignatureError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, 
            detail="La sesión ha expirado. Vuelve a iniciar sesión."
        )
    except jwt.InvalidTokenError:
        raise credentials_exception

def get_admin_user(current_user: dict = Depends(get_current_user)):
    """Filtro extra: Solo deja pasar si el rol es de administrador."""
    if current_user.get("role") not in ["nubeware_admin", "client_admin"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, 
            detail="No tienes los permisos necesarios para realizar esta acción."
        )
    return current_user