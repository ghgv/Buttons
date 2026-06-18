import sys
import os
from sqlalchemy import create_engine, text, inspect
from sqlalchemy.exc import OperationalError

# Asegurar resolución de módulos de la app en la raíz del backend
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

def ejecutar_script_sql(ruta_sql: str):
    from dotenv import load_dotenv
    load_dotenv()
    
    db_host = os.getenv("DB_HOST", "127.0.0.1")
    db_port = os.getenv("DB_PORT", "3306")
    db_name = os.getenv("DB_NAME", "sensortes_db")
    db_user = os.getenv("DB_USER", "root")
    db_pass = os.getenv("DB_PASSWORD", "")
    
    # 1. Intentar conectar primero a la base de datos específica
    db_url = f"mysql+pymysql://{db_user}:{db_pass}@{db_host}:{db_port}/{db_name}"
    
    try:
        engine = create_engine(db_url, pool_pre_ping=True)
        # Forzar una conexión para ver si la BD existe
        with engine.connect() as conn:
            pass
    except OperationalError as e:
        # Error 1049 significa "Unknown database" (La BD no existe)
        if "1049" in str(e):
            print(f"🔍 La base de datos '{db_name}' no existe en el servidor. Intentando crearla...")
            try:
                # Nos conectamos temporalmente a la raíz del servidor (sin especificar BD) para crearla
                url_raiz = f"mysql+pymysql://{db_user}:{db_pass}@{db_host}:{db_port}/"
                engine_raiz = create_engine(url_raiz, pool_pre_ping=True)
                with engine_raiz.connect() as conn_raiz:
                    conn_raiz.execute(text(f"CREATE DATABASE {db_name} CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci;"))
                    conn_raiz.commit()
                print(f"✨ Base de datos '{db_name}' creada exitosamente.")
                # Re-inicializamos el engine con la nueva BD
                engine = create_engine(db_url, pool_pre_ping=True)
            except Exception as create_err:
                print(f"❌ Error crítico: No se pudo crear la base de datos '{db_name}'.")
                print(f"Detalles: {create_err}")
                sys.exit(1)
        else:
            print(f"❌ Error de conexión al verificar la BD: {e}")
            sys.exit(1)

    # 2. VERIFICACIÓN DE TABLAS EXISTENTES
    inspector = inspect(engine)
    tablas_existentes = inspector.get_table_names()
    
    # Si la base de datos ya tiene las tablas principales de tu app
    if "users" in tablas_existentes or "clients" in tablas_existentes:
        print(f"⚠️ ¡Atención! Se detectó que la base de datos '{db_name}' ya tiene las tablas creadas.")
        print("Saltándose inicialización física (.sql) y bootstrap para proteger los datos existentes. 🛡️")
        sys.exit(99)

    # 3. EJECUCIÓN DEL .SQL (Si está vacía o recién creada)
    if not os.path.exists(ruta_sql):
        nombre_archivo = os.path.basename(ruta_sql)
        posibles_rutas = [
            os.path.join(os.getcwd(), "database", nombre_archivo),
            os.path.join(os.getcwd(), "..", "database", nombre_archivo),
            os.path.join(os.getcwd(), nombre_archivo),
        ]
        
        encontrado = False
        for ruta in posibles_rutas:
            if os.path.exists(ruta):
                ruta_sql = ruta
                encontrado = True
                break
                
        if not encontrado:
            print(f"❌ Error: La base de datos está vacía/nueva, pero no se encontró el archivo '{nombre_archivo}' para construirla.")
            sys.exit(1)
            
    print(f"📦 Aplicando estructura limpia (.sql) en '{db_name}' desde: {ruta_sql}")
    
    with open(ruta_sql, 'r', encoding='utf-8') as f:
        comandos_sql = f.read().split(';')
        
    try:
        with engine.connect() as conexion:
            conexion.execute(text("SET FOREIGN_KEY_CHECKS = 0;"))
            for comando in comandos_sql:
                comando_limpio = comando.strip()
                if comando_limpio:
                    conexion.execute(text(comando_limpio))
            conexion.execute(text("SET FOREIGN_KEY_CHECKS = 1;"))
            conexion.commit()
        print("✅ Tablas, llaves e índices estructurales creados con éxito.")
    except Exception as e:
        print(f"❌ Error ejecutando la migración SQL: {e}")
        sys.exit(1)

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Uso: python init_db.py <ruta_del_archivo_sql>")
        sys.exit(1)
    ejecutar_script_sql(sys.argv[1])