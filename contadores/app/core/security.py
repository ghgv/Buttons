
import jwt
from datetime import datetime, timedelta
from passlib.context import CryptContext
from zoneinfo import ZoneInfo
import os

# Configuración de contraseñas
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

SECRET_KEY = os.getenv("JWT_SECRET", "1034279336jwtnbw")  # Valor por defecto para desarrollo
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 120 #Equivalente a 2 horas

def get_password_hash(password: str) -> str:
    truncated_pwd = password.encode('utf-8')[:72].decode('utf-8', 'ignore')
    return pwd_context.hash(truncated_pwd)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    truncated_pwd = plain_password.encode('utf-8')[:72].decode('utf-8', 'ignore')
    return pwd_context.verify(truncated_pwd, hashed_password)

def create_access_token(data: dict) -> str:
    to_encode = data.copy()
    expire = datetime.now(ZoneInfo("America/Bogota")) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    
    
    to_encode.update({"exp": int(expire.timestamp())})
    
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt