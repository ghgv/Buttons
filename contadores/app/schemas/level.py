from pydantic import BaseModel, EmailStr, Field
from typing import Optional

class LevelCreate(BaseModel):
    sede_id: int
    name: str = Field(
        min_length=2, 
        max_length=255, 
        pattern=r"^[A-Za-zÁÉÍÓÚáéíóúÑñ0-9\s\.\-]+$", # Permite letras, números, espacios, puntos y guiones (ej. "Nivel 1")
        json_schema_extra={"strip_whitespace":  True}
    )
    floor: int = Field(minlength=1)