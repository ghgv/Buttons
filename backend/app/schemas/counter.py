from pydantic import BaseModel, ConfigDict
from datetime import datetime
from typing import List, Optional

class CounterCreate(BaseModel):
    """Esquema para registrar un nuevo contador físico (POST)"""
    serie: int
    bathroom_id: int

class CounterUpdate(BaseModel):
    """Esquema para modificar los datos de un contador (PUT)"""
    serie: Optional[int] = None
    bathroom_id: Optional[int] = None

class CounterLogResponse(BaseModel):
    """Esquema secundario para formatear los logs de ingresos individuales"""
    id: int
    amount: int
    create_time: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)


class CounterResponse(BaseModel):
    """Esquema para respuestas simples del contador (sin el historial)"""
    id: int
    serie: int
    bathroom_id: int

    model_config = ConfigDict(from_attributes=True)


class CounterWithLogsResponse(CounterResponse):
    """Esquema completo que incluye los datos del hardware y todos sus logs (GET por ID)"""
    logs: List[CounterLogResponse] = []