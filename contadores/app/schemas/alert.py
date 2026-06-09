from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime
from models.models import Alert

class AlertCreate(BaseModel):
    name: str = Field(..., example="Alerta de uso excesivo")
    button_box_serie: int = Field(..., example=12345)
    interaction_type: str = Field(..., example="Presión prolongada")
    status: Optional[AlertEnum] = Field(AlertEnum.pending, example="pending")
    create_time = Optional[datetime] = Field(None, description="Fecha de creacion de la alerta")