from fastapi import APIRouter, BackgroundTasks, Response, status, Depends, HTTPException, Query
from app.services import task_counters
from app.services.task_counters import obtener_contadores_por_bano as obtener_contadores_por_bano_service
from app.models.models import Client, Sede, Level, Bathroom
from app.schemas.counter import (
    CounterCreate,
    CounterUpdate, 
    CounterResponse, 
    CounterWithLogsResponse
)
from app.api.deps import get_admin_user, get_db
from sqlalchemy.orm import Session

router = APIRouter(prefix="/contadores", tags=["contadores"])

@router.get("/cp.php")
async def obtener_contadores(serie: str, valor: int, background_tasks: BackgroundTasks):
    print(f"Recibida petición GET en /contadores/cp.php | Serie: {serie}")
    
    background_tasks.add_task(task_counters.tarea_guardar_contadores, serie, valor)
    
    return Response(
        status_code=status.HTTP_204_NO_CONTENT, 
        headers={"Connection": "close"}
    )

@router.post("/", 
    status_code=status.HTTP_201_CREATED, 
    response_model=CounterResponse  # <-- Asegura un JSON de salida limpio y tipado
)
def crear_nuevo_contador(
    contador_in: CounterCreate,
    db: Session = Depends(get_db)
    # current_user: dict = Depends(get_admin_user)
):
    nuevo_contador = task_counters.crear_contador(db=db, contador=contador_in)
    return nuevo_contador
    


@router.get("/bathroom/{bathroom_id}")
def obtener_contadores_por_bano(
    bathroom_id: int,
    db: Session = Depends(get_db),
    # current_user: dict = Depends(get_admin_user)
):
    contadores = obtener_contadores_por_bano_service(db, bathroom_id)
    return contadores

@router.get("/{counter_id}/logs", response_model=CounterWithLogsResponse)
def obtener_contador_con_historial(
    counter_id: int, 
    db: Session = Depends(get_db),
    limit: int = Query(default=50, ge=1, le=100, description="Número de registros por página"),
    offset: int = Query(default=0, ge=0, description="Número de registros a omitir")
):
    res = task_counters.obtener_contador_por_id_con_logs(db, counter_id, limit=limit, offset=offset)
    if not res:
        raise HTTPException(status_code=404, detail="Contador no encontrado")
    return res

@router.put("/{counter_id}", response_model=CounterResponse)
def modificar_contador(counter_id: int, datos: CounterUpdate, db: Session = Depends(get_db)):
    update_data = datos.model_dump(exclude_unset=True)
    
    actualizado = task_counters.editar_contador(db, counter_id, update_data)
    if not actualizado:
        raise HTTPException(status_code=404, detail="No se pudo actualizar o el contador no existe")
    return actualizado

@router.delete("/{counter_id}", status_code=status.HTTP_204_NO_CONTENT)
def remover_contador(counter_id: int, db: Session = Depends(get_db)):
    """
    Elimina un contador del sistema por su ID primario.
    Los logs de ingresos asociados se mantendrán almacenados con su identificador en NULL.
    """
    task_counters.eliminar_contador(db, counter_id)
    return None