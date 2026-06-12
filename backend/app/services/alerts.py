from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from app.models.models import Alert, Button_logs
from app.schemas.alert import AlertCreate

