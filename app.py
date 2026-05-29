import logging
from fastapi import FastAPI, BackgroundTasks, Response, status, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import mysql.connector
from mysql.connector import Error
import os
from dotenv import load_dotenv
from datetime import datetime
from zoneinfo import ZoneInfo

load_dotenv()

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
    handlers=[logging.StreamHandler()]
)
logger = logging.getLogger("api_contadores")

app = FastAPI(title="API Contadores")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],  
    allow_headers=["*"],
)

def get_db_connection():
    try:
        connection = mysql.connector.connect(
            
        )
        return connection
    except Error as e:
        logger.error(f"Error al conectar a la base de datos: {e}")
        raise e

@app.get("/")
def read_root():
    return {"mensaje": "API de Contadores en funcionamiento"}

def tarea_guardar_contadores(serie: str, valor: int):
    amount = valor
    connection = None
    cursor = None
    try:
        connection = get_db_connection()
        cursor = connection.cursor()
        create_time = datetime.now(ZoneInfo("America/Bogota"))
        query = "INSERT INTO counters (serie, amount, create_time) VALUES (%s, %s, %s)"
        datos = (serie, amount, create_time)
        
        cursor.execute(query, datos)
        connection.commit()                                 
        logger.info(f"Registro guardado exitosamente en 'contadores' | Serie: {serie} | Valor: {amount}")
    except Error as e:
        if connection:
            connection.rollback()                                                                                   
        logger.error(f"Error en tarea_guardar_contadores: {str(e)}")
    finally:
        if cursor:                                                                                          
            cursor.close()
        if connection:
            connection.close()

def tarea_guardar_botonera(serie: str, letter: str, label: str, valor: int):
    amount = valor
    connection = None
    cursor = None
    try:
        connection = get_db_connection()
        cursor = connection.cursor()
        create_time = datetime.now(ZoneInfo("America/Bogota"))
        
        query = """
            INSERT INTO button_box (serie, letter, label, amount, create_time) 
            VALUES (%s, %s, %s, %s, %s)
        """
        datos = (serie, letter, label, amount, create_time)
        
        cursor.execute(query, datos)
        connection.commit()
        logger.info(f"Registro guardado exitosamente en 'botonera' | Serie: {serie} | Letra: {letter} | Valor: {amount} | ")
    except Error as e:
        if connection:
            connection.rollback()
        logger.error(f"Error en tarea_guardar_botonera: {str(e)}")
    finally:
        if cursor:
            cursor.close()
        if connection:
            connection.close()

@app.get("/contadores/cp.php")
async def obtener_contadores(serie: str, valor: int, background_tasks: BackgroundTasks):
    logger.info(f"Recibida petición GET en /contadores/cp.php | Serie: {serie}")
    background_tasks.add_task(tarea_guardar_contadores, serie, valor)
    return Response(status_code=status.HTTP_204_NO_CONTENT, headers={"Connection": "close"})

@app.get("/botonera/a.php")
async def registrar_botonera_a(serie: str, valor: int, background_tasks: BackgroundTasks):
    logger.info(f"Recibida petición GET en /botonera/a.php | Serie: {serie}")
    background_tasks.add_task(tarea_guardar_botonera, serie, "A", "papel", valor)
    return Response(status_code=status.HTTP_204_NO_CONTENT, headers={"Connection": "close"})

@app.get("/botonera/b.php")
async def registrar_botonera_b(serie: str, valor: int, background_tasks: BackgroundTasks):
    logger.info(f"Recibida petición GET en /botonera/b.php | Serie: {serie}")
    background_tasks.add_task(tarea_guardar_botonera, serie, "B", "jabon", valor)
    return Response(status_code=status.HTTP_204_NO_CONTENT, headers={"Connection": "close"})

@app.get("/botonera/c.php")
async def registrar_botonera_c(serie: str, valor: int, background_tasks: BackgroundTasks):
    logger.info(f"Recibida petición GET en /botonera/c.php | Serie: {serie}")
    background_tasks.add_task(tarea_guardar_botonera, serie, "C", "baño sucio", valor)
    return Response(status_code=status.HTTP_204_NO_CONTENT, headers={"Connection": "close"})

@app.get("/botonera/d.php")
async def registrar_botonera_d(serie: str, valor: int, background_tasks: BackgroundTasks):
    logger.info(f"Recibida petición GET en /botonera/d.php | Serie: {serie}")
    background_tasks.add_task(tarea_guardar_botonera, serie, "D", "mal olor", valor)
    return Response(status_code=status.HTTP_204_NO_CONTENT, headers={"Connection": "close"})


@app.get("/contadores/consultar")
async def listar_todos_los_contadores():
    logger.info("Consulta general de todos los contadores solicitada")
    connection = None
    cursor = None
    try:
        connection = get_db_connection()
        cursor = connection.cursor(dictionary=True)     
        query = """
            SELECT serie, valor, create_time 
            FROM contadores 
            ORDER BY create_time DESC
        """
        cursor.execute(query)
        
        resultados = cursor.fetchall()
        
        return resultados
            
    except Error as e:
        logger.error(f"Error consultando todos los contadores: {str(e)}")
        raise HTTPException(status_code=500, detail="Error interno de la base de datos")
        
    finally:
        if cursor:
            cursor.close()
        if connection:
            connection.close()

@app.get("/botoneras/consultar")
async def listar_toda_la_botonera():
    logger.info("Consulta general de todos los registros de botonera solicitada")
    connection = None
    cursor = None
    try:
        connection = get_db_connection()
        cursor = connection.cursor(dictionary=True) 
        
        query = """
            SELECT serie, etiqueta, valor, fecha_registro 
            FROM botonera 
            ORDER BY fecha_registro DESC
        """
        cursor.execute(query)
        
        resultados = cursor.fetchall()
        
        return resultados
            
    except Error as e:
        logger.error(f"Error consultando la tabla botonera: {str(e)}")
        raise HTTPException(status_code=500, detail="Error interno de la base de datos")
        
    finally:
        if cursor:
            cursor.close()
        if connection:
            connection.close()

if __name__ == "__main__":
    import uvicorn
    logger.info("Iniciando servidor API Contadores en el puerto 80...")
    uvicorn.run("app:app", host="0.0.0.0", port=80, reload=True)