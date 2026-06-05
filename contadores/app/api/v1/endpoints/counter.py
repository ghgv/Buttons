from fastapi import APIRouter, BackgroundTasks, Response, status, Depends
from app.services.task_counters import tarea_guardar_contadores, crear_contador
from app.services.task_counters import obtener_contadores_por_bano as obtener_contadores_por_bano_service
from app.models.models import Client, Sede, Level, Bathroom
from app.schemas.counter import CounterCreate
from app.api.deps import get_admin_user, get_db
from sqlalchemy.orm import Session

router = APIRouter(prefix="/contadores", tags=["contadores"])

@router.get("/cp.php")
async def obtener_contadores(serie: str, valor: int, background_tasks: BackgroundTasks):
    print(f"Recibida petición GET en /contadores/cp.php | Serie: {serie}")
    
    background_tasks.add_task(tarea_guardar_contadores, serie, valor)
    
    return Response(
        status_code=status.HTTP_204_NO_CONTENT, 
        headers={"Connection": "close"}
    )

@router.post("/", status_code=status.HTTP_201_CREATED)
def crear_nuevo_contador(
    contador_in: CounterCreate,
    db: Session = Depends(get_db),
    # current_user: dict = Depends(get_admin_user)
):
    nuevo_contador = crear_contador(contador_in)
    if nuevo_contador is None:
        return Response(
            content="Error al crear el contador",
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR
        )
    elif isinstance(nuevo_contador, dict) and "message" in nuevo_contador:
        return Response(
            content=nuevo_contador["message"],
            status_code=status.HTTP_400_BAD_REQUEST
        )
    else:
        return nuevo_contador
    


@router.get("/{bathroom_id}")
def obtener_contadores_por_bano(
    bathroom_id: int,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_admin_user)
):
    contadores = obtener_contadores_por_bano_service(db, bathroom_id)
    return contadores