from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from datetime import datetime

class button_boxCreate(BaseModel):
   serie : int = Field(..., description="Número de serie del contador", example=12345)
   bathroom_id : int = Field(..., description="ID del baño al que pertenece el contador", example=1)
   install_time : Optional[datetime] = Field(None, description="Fecha y hora de instalación del contador", example="2024-01-01T12:00:00Z")