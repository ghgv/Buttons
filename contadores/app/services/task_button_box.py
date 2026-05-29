from app.db.database import get_db_connection
from datetime import datetime 
from zoneinfo import ZoneInfo
from mysql.connector import Error

def tarea_guardar_botonera(serie: str, letter: str, label: str, valor: int):
    amount = valor
    biutton_box_serie = serie
    connection = None
    cursor = None
    try:
        connection = get_db_connection()
        cursor = connection.cursor()
        create_time = datetime.now(ZoneInfo("America/Bogota"))
        
        query = """
            INSERT INTO button_logs (button_box_serie, letter, label, create_time) 
            VALUES (%s, %s, %s, %s)
        """
        datos = (serie, letter, label, create_time)
        
        cursor.execute(query, datos)
        connection.commit()
        print(f"Registro guardado exitosamente en 'botonera' | Serie: {serie} | Letra: {letter} | Valor: {amount} | ")
    except Error as e:
        if connection:
            connection.rollback()
        print(f"Error al guardar el registro en 'botonera': {e}")
    finally:
        if cursor:
            cursor.close()
        if connection:
            connection.close()