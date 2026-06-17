from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from app.models.models import GenderEnum

class BathroomCreate(BaseModel):
    name: str = Field(
        min_length=2, 
        max_length=255, 
        pattern=r"^[A-Za-zÁÉÍÓÚáéíóúÑñ0-9\s\.\-]+$", # Permite letras, números, espacios, puntos y guiones (ej. "Baño Principal")
        json_schema_extra={"strip_whitespace": True}
    )
    level_id: int
    gender: GenderEnum = Field(..., description="Género del baño", example="male", enum=["men", "women", "mixed", "disabled"])
    description: Optional[str] = Field(
        max_length=255, 
        pattern=r"^[A-Za-zÁÉÍÓÚáéíóúÑñ0-9\s\.\-]*$", # Permite letras, números, espacios, puntos y guiones (ej. "Baño para discapacitados")
        json_schema_extra={"strip_whitespace": True}
    )  
