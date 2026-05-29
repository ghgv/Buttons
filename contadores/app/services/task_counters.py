from app.db.database import get_db_connection
from datetime import datetime 
from zoneinfo import ZoneInfo
from mysql.connector import Error

def tarea_guardar_contadores(serie: str, valor: int):
    amount = valor
    counter_serie = serie
    connection = None
    cursor = None
    try:
        connection = get_db_connection()
        cursor = connection.cursor()
        create_time = datetime.now(ZoneInfo("America/Bogota"))
        query = "INSERT INTO counter_logs (counter_serie, amount, create_time) VALUES (%s, %s, %s)"
        datos = (counter_serie, amount, create_time)
        
        cursor.execute(query, datos)
        connection.commit()                                 
        print(f"Registro guardado exitosamente en 'contadores' | Serie: {serie} | Valor: {amount} | ")
    except Error as e:
        if connection:
            connection.rollback()        
        print(f"Error al guardar en 'contadores': {e}")                                                                           
    finally:
        if cursor:                                                                                          
            cursor.close()
        if connection:
            connection.close()