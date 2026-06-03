from fastapi import APIRouter, BackgroundTasks, Response, status
from app.services.task_counters import tarea_guardar_contadores

router = APIRouter(prefix="/contadores", tags=["contadores"])

@router.get("/cp.php")
async def obtener_contadores(serie: str, valor: int, background_tasks: BackgroundTasks):
    print(f"Recibida petición GET en /contadores/cp.php | Serie: {serie}")
    
    background_tasks.add_task(tarea_guardar_contadores, serie, valor)
    
    return Response(
        status_code=status.HTTP_204_NO_CONTENT, 
        headers={"Connection": "close"}
    )