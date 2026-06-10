# app/schemas/client.py
from pydantic import BaseModel, EmailStr, Field
from typing import Optional

class ClientCreate(BaseModel):
    nit: int = Field(None, description="NIT del cliente, opcional")
    name: str = Field(
        min_length=2, 
        max_length=255, 
        pattern=r"^[A-Za-zÁÉÍÓÚáéíóúÑñ0-9\s\.\-]+$", # Permite letras, números, espacios, puntos y guiones (ej. "Empresa S.A.")
        json_schema_extra={"strip_whitespace": True}
    )
    email: Optional[EmailStr] = None
    address: Optional[str] = None
    lat: Optional[float] = None
    lon: Optional[float] = None
# app/schemas/client.py
from pydantic import BaseModel, EmailStr, Field
from typing import Optional

class ClientCreate(BaseModel):
    nit: int = Field(None, description="NIT del cliente, opcional")
    name: str = Field(
        min_length=2, 
        max_length=255, 
        pattern=r"^[A-Za-zÁÉÍÓÚáéíóúÑñ0-9\s\.\-]+$", # Permite letras, números, espacios, puntos y guiones (ej. "Empresa S.A.")
        json_schema_extra={"strip_whitespace": True}
    )
    email: Optional[EmailStr] = None
    address: Optional[str] = None
    lat: Optional[float] = None
    lon: Optional[float] = None