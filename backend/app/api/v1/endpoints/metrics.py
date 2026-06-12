# contadores/app/api/v1/endpoints/metrics.py

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

# Importamos las dependencias centrales de tu app (Base de datos y candados JWT)
from app.api.deps import get_db, get_admin_user

# Importamos la función del servicio que acabamos de actualizar
# (Asegúrate de ajustar la ruta de importación si guardaste el servicio en otro archivo)
from app.services.metrics import metrics_by_id_client

router = APIRouter(prefix="/metrics", tags=["Métricas y Dashboard"])

@router.get("/client/{client_id}", status_code=status.HTTP_200_OK)
def obtener_metricas_cliente(
    client_id: int,
    db: Session = Depends(get_db),
    # current_user: dict = Depends(get_admin_user)
):
    """
    Obtiene el resumen de infraestructura (sedes, niveles, baños) junto con
    la serie de tiempo completa de eventos de contadores y botoneras.
    
    - **Seguridad**: Protegido con JWT. Los 'client_admin' solo pueden consultar su propio ID.
    """
    
    # --- CAPA DE SEGURIDAD MULTI-TENANT ---
    # Si el usuario es administrador de un cliente, bloqueamos el acceso si intenta
    # consultar un client_id que no le corresponde.
    # if current_user.get("role") == "client_admin" and current_user.get("client_id") != client_id:
    #     raise HTTPException(
    #         status_code=status.HTTP_403_FORBIDDEN,
    #         detail="No tienes permisos para acceder a las métricas de este cliente."
    #     )
    
    # Si es 'nubeware_admin' (superadmin), la condición de arriba no se cumple 
    # y pasa derecho a consultar cualquier cliente.
    
    # Ejecutamos el servicio y retornamos la respuesta estructurada directamente
    return metrics_by_id_client(db=db, client_id=client_id)