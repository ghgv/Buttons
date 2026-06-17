from pydantic import BaseModel, ConfigDict
from datetime import datetime
from typing import List, Optional

class ButtonBoxCreate(BaseModel):
    """Esquema para cuando se CREA una nueva botonera (POST)"""
    serie: int
    bathroom_id: int

class ButtonBoxUpdate(BaseModel):
    """Esquema para cuando se EDITA una botonera (PUT)"""
    serie: Optional[int] = None
    bathroom_id: Optional[int] = None

class ButtonLogResponse(BaseModel):
    """Esquema secundario para formatear los logs individuales dentro de la botonera"""
    id: int
    letter: str
    label: str
    create_time: datetime
    model_config = ConfigDict(from_attributes=True)


class ButtonBoxResponse(BaseModel):
    """Esquema para respuestas SIMPLES de la botonera (sin el historial de logs)"""
    id: int
    serie: int
    bathroom_id: int
    install_time: datetime

    model_config = ConfigDict(from_attributes=True)


class ButtonBoxWithLogsResponse(ButtonBoxResponse):
    """Esquema para la respuesta DETALLADA que incluye todo su historial de logs (GET por ID)"""
    logs: List[ButtonLogResponse] = []