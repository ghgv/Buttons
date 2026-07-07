#!/bin/bash

set -e

# =====================================================
# UTILIDADES DE PROGRESO
# =====================================================
TOTAL_STEPS=8
CURRENT_STEP=0

progress() {
    CURRENT_STEP=$((CURRENT_STEP + 1))
    PERCENT=$(( (CURRENT_STEP * 100) / TOTAL_STEPS ))
    FILLED=$(( PERCENT / 5 ))
    EMPTY=$(( 20 - FILLED ))
    BAR=""
    for i in $(seq 1 $FILLED); do BAR="${BAR}█"; done
    for i in $(seq 1 $EMPTY); do BAR="${BAR}░"; done
    echo ""
    echo "  [$BAR] $PERCENT%  —  Paso $CURRENT_STEP/$TOTAL_STEPS: $1"
    echo ""
}

# =====================================================
# VERIFICACIÓN DE PERMISOS
# =====================================================
if [ "$EUID" -ne 0 ]; then
    echo ""
    echo "❌ Este instalador debe ejecutarse con sudo"
    echo "   Uso correcto: sudo bash install.sh"
    echo ""
    exit 1
fi

INSTALL_USER=${SUDO_USER:-$USER}
ROOT_DIR=$(pwd)
BACKEND_DIR="$ROOT_DIR/backend"
FRONTEND_DIR="$ROOT_DIR/frontend"

clear
echo ""
echo "  ╔══════════════════════════════════════════╗"
echo "  ║          INSTALADOR  SENSORTES           ║"
echo "  ║    Sistema de Monitoreo y Telemetría     ║"
echo "  ╚══════════════════════════════════════════╝"
echo ""
echo "  Directorio de instalación: $ROOT_DIR"
echo "  Usuario del sistema:       $INSTALL_USER"
echo ""
echo "──────────────────────────────────────────────"
read -p "  ¿Continuar con la instalación? [S/n]: " CONFIRM
CONFIRM=${CONFIRM:-S}
if [[ ! "$CONFIRM" =~ ^[Ss]$ ]]; then
    echo "  Instalación cancelada."
    exit 0
fi


# =====================================================
# PASO 1 — DEPENDENCIAS DEL SISTEMA
# =====================================================
progress "Instalando dependencias del sistema"

echo "  → Actualizando repositorios..."
apt-get update -y -q

echo "  → Instalando: python3-pip python3-venv curl sed..."
apt-get install -y -q python3-pip python3-venv curl sed

echo "  ✓ Dependencias del sistema listas."


# =====================================================
# PASO 2 — DETECCIÓN Y CONFIGURACIÓN DE BASE DE DATOS
# =====================================================
progress "Configurando motor de base de datos"

echo "  ┌─────────────────────────────────────────┐"
echo "  │     CONFIGURACIÓN DE BASE DE DATOS      │"
echo "  └─────────────────────────────────────────┘"

if command -v mysql >/dev/null 2>&1; then
    echo ""
    echo "  🔍 MySQL detectado en el sistema."
    echo "  Ingresa los datos de conexión a tu BD existente:"
    echo ""
    read -p "  Host BD          (ej: 127.0.0.1): " DB_HOST
    DB_HOST=${DB_HOST:-localhost}
    read -p "  Puerto BD        [3306]:           " DB_PORT
    DB_PORT=${DB_PORT:-3306}
    read -p "  Nombre de la BD:                   " DB_NAME
    read -p "  Usuario BD:                        " DB_USER
    read -s -p "  Contraseña BD:                     " DB_PASSWORD
    echo ""
    echo ""
    echo "  ✓ Datos de conexión registrados."
else
    echo ""
    echo "  📦 MySQL no encontrado. Instalando MySQL Server local..."
    apt-get install -y -q mysql-server
    systemctl start mysql
    systemctl enable mysql
    echo "  ✓ MySQL Server instalado y activo."

    echo ""
    echo "  Ingresa los datos para la nueva instalación:"
    echo ""
    read -p "  Nombre de la BD  [sensortes_db]:   " DB_NAME
    DB_NAME=${DB_NAME:-sensortes_db}
    read -p "  Puerto BD        [3306]:            " DB_PORT
    DB_PORT=${DB_PORT:-3306}
    DB_HOST="localhost"
    DB_USER="root"

    read -s -p "  Contraseña para el usuario root de MySQL: " DB_PASSWORD
    echo ""

    echo ""
    # =====================================================
# LÓGICA CORREGIDA PARA INSTALACIÓN DESDE CERO
# =====================================================
    echo "  → Configurando usuario root en MySQL..."

    # 1. Cambiamos la contraseña directamente sin tocar variables de política inexistentes
    mysql -u root << SQL_EOF
ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY '$DB_PASSWORD';
FLUSH PRIVILEGES;
SQL_EOF

    echo "  → Creando base de datos y usuario de la aplicación..."
    
    # 2. Creamos la base de datos usando la clave root recién asignada
    mysql -u root -p"$DB_PASSWORD" -e "CREATE DATABASE IF NOT EXISTS $DB_NAME CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci;"

    # 3. Creamos tu usuario personalizado (ej: jonathan) y le damos super-poderes sobre su base de datos
    mysql -u root -p"$DB_PASSWORD" -e "CREATE USER IF NOT EXISTS '$DB_USER'@'%' IDENTIFIED WITH mysql_native_password BY '$DB_PASSWORD';"
    mysql -u root -p"$DB_PASSWORD" -e "GRANT ALL PRIVILEGES ON $DB_NAME.* TO '$DB_USER'@'%';"
    mysql -u root -p"$DB_PASSWORD" -e "FLUSH PRIVILEGES;"

    echo "  ✓ MySQL configurado correctamente."
fi


# =====================================================
# PASO 3 — PUERTOS DE LA APLICACIÓN
# =====================================================
progress "Configurando puertos de la aplicación"

echo "  ┌─────────────────────────────────────────┐"
echo "  │       PUERTOS DE LA APLICACIÓN          │"
echo "  └─────────────────────────────────────────┘"
echo ""
read -p "  Puerto Backend   [8000]: " APP_PORT
APP_PORT=${APP_PORT:-8000}
read -p "  Puerto Frontend  [5173]: " FRONTEND_PORT
FRONTEND_PORT=${FRONTEND_PORT:-5173}
echo ""

# Escribir el .env del backend con ruta absoluta explícita
cat > "$BACKEND_DIR/.env" << EOF
DB_HOST=$DB_HOST
DB_PORT=$DB_PORT
DB_NAME=$DB_NAME
DB_USER=$DB_USER
DB_PASSWORD=$DB_PASSWORD

APP_HOST=0.0.0.0
APP_PORT=$APP_PORT
DEBUG=False
EOF

echo "  ✓ Archivo backend/.env generado."


# =====================================================
# CREACIÓN DEL ENTORNO VIRTUAL
# =====================================================

echo "  → Creando entorno virtual del backend..."

if [ ! -d "$BACKEND_DIR/venv" ]; then
    python3 -m venv "$BACKEND_DIR/venv"
fi

echo "  → Activando entorno virtual..."

source "$BACKEND_DIR/venv/bin/activate"

echo "  → Actualizando pip..."
python -m pip install --upgrade pip

echo "  → Instalando dependencias del backend..."
pip install -r "$BACKEND_DIR/requirements.txt"

deactivate

# =====================================================
# PASO 4 — VALIDACIÓN DE CONEXIÓN A BASE DE DATOS
# =====================================================
progress "Validando conexión a la base de datos"

echo "  → Activando entorno virtual del backend..."
cd "$BACKEND_DIR"
source venv/bin/activate

echo "  → Probando conexión MySQL con las credenciales ingresadas..."

# FIX CRÍTICO: pasamos la ruta EXPLÍCITA al .env para que load_dotenv
# no lea variables vacías si el directorio de trabajo cambia
set +e
python3 -c "
import os
import sys
from sqlalchemy import create_engine, text
from dotenv import load_dotenv

# Ruta explícita — elimina cualquier ambigüedad de directorio de trabajo
load_dotenv('$BACKEND_DIR/.env', override=True)

db_user     = os.getenv('DB_USER')
db_password = os.getenv('DB_PASSWORD')
db_host     = os.getenv('DB_HOST')
db_port     = os.getenv('DB_PORT')

if not all([db_user, db_password, db_host, db_port]):
    print('  ❌ Variables del .env vacías. Verifica el archivo generado.')
    sys.exit(1)

db_url = f'mysql+pymysql://{db_user}:{db_password}@{db_host}:{db_port}/'
try:
    engine = create_engine(db_url, pool_pre_ping=True)
    with engine.connect() as conn:
        conn.execute(text('SELECT 1'))
    sys.exit(0)
except Exception as e:
    print(f'  ❌ ERROR DE CONEXIÓN: {e}')
    sys.exit(1)
"
STATUS_CONN=$?
set -e

if [ $STATUS_CONN -ne 0 ]; then
    echo ""
    echo "  ┌──────────────────────────────────────────────────────┐"
    echo "  │  🛑 No se pudo conectar a MySQL.                     │"
    echo "  │                                                      │"
    echo "  │  Verifica:                                           │"
    echo "  │   • Que el usuario y contraseña sean correctos       │"
    echo "  │   • Que el host/puerto sean accesibles               │"
    echo "  │   • Que MySQL esté corriendo (systemctl status mysql) │"
    echo "  └──────────────────────────────────────────────────────┘"
    rm -f "$BACKEND_DIR/.env"
    exit 1
fi

echo "  ✅ Conexión a MySQL verificada con éxito."


# =====================================================
# PASO 5 — MIGRACIÓN Y BOOTSTRAP DE BASE DE DATOS
# =====================================================
progress "Inicializando tablas y datos base"

echo "  → Ejecutando script de inicialización SQL..."

set +e
python3 scripts/init_db.py "$ROOT_DIR/database/sensortes.sql"
STATUS_DB=$?
set -e

if [ $STATUS_DB -eq 99 ]; then
    echo "  ℹ️  La BD ya tiene datos. Se omite la creación del usuario maestro."

elif [ $STATUS_DB -ne 0 ]; then
    echo ""
    echo "  ❌ Error crítico al inicializar la base de datos."
    exit 1

else
    echo ""
    echo "  ┌─────────────────────────────────────────┐"
    echo "  │     EMPRESA Y USUARIO ADMINISTRADOR     │"
    echo "  └─────────────────────────────────────────┘"
    echo ""
    read -p "  Nombre de la Empresa:                  " BOOT_EMPRESA
    read -p "  NIT de la Empresa:                     " BOOT_NIT
    read -p "  Correo Electrónico de la Empresa:      " BOOT_EMPRESA_EMAIL
    echo ""
    echo "  Cuenta Administrador (client_admin):"
    read -p "  Nombre completo del Administrador:     " BOOT_ADMIN_NAME
    read -p "  Correo del Administrador:              " BOOT_ADMIN_EMAIL
    read -s -p "  Contraseña del Administrador:          " BOOT_ADMIN_PASS
    echo ""

    echo ""
    echo "  → Ejecutando bootstrap..."
    python3 -m scripts.bootstrap \
        "$BOOT_EMPRESA" \
        "$BOOT_NIT" \
        "$BOOT_EMPRESA_EMAIL" \
        "$BOOT_ADMIN_NAME" \
        "$BOOT_ADMIN_EMAIL" \
        "$BOOT_ADMIN_PASS"

    echo "  ✓ Bootstrap finalizado con éxito."
fi


# =====================================================
# PASO 6 — CONFIGURACIÓN DEL FRONTEND
# =====================================================
progress "Configurando frontend (Vite + React)"

echo "  → Generando frontend/.env..."

cat > "$FRONTEND_DIR/.env" << EOF
VITE_API_URL=http://dali.com.co:$APP_PORT
EOF

echo "  ✓ frontend/.env creado."
echo ""
echo "  → Instalando Node.js con NVM y dependencias npm..."

sudo -u "$INSTALL_USER" -i bash << NODEEOF
    export NVM_DIR="\$HOME/.nvm"

    if [ ! -d "\$NVM_DIR" ]; then
        echo "  → Instalando NVM..."
        curl -fsSL https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
    fi

    source "\$NVM_DIR/nvm.sh"

    echo "  → Configurando Node.js 20.20.2..."
    nvm install 20.20.2 --silent
    nvm use 20.20.2

    cd "$FRONTEND_DIR"
    echo "  → Ejecutando npm install..."
    npm install --silent

    echo "  ✓ Dependencias de Node instaladas."
NODEEOF


# =====================================================
# PASO 7 — DETECCIÓN DE IP LOCAL
# =====================================================
progress "Detectando IP local del servidor"

IP_LOCAL=$(hostname -I | awk '{print $1}')
echo "  ✓ IP local detectada: $IP_LOCAL"


# =====================================================
# PASO 8 — CONFIGURACIÓN DE SERVICIOS SYSTEMD
# =====================================================
progress "Registrando servicios en Systemd"

echo "  → Creando sensortes-backend.service..."
cat > /etc/systemd/system/sensortes-backend.service << EOF
[Unit]
Description=Sensortes Backend Service
After=network.target mysql.service

[Service]
User=$INSTALL_USER
WorkingDirectory=$BACKEND_DIR
ExecStart=$BACKEND_DIR/venv/bin/python run.py
Restart=always
RestartSec=5

[Install]
WantedBy=multi-user.target
EOF

echo "  → Creando sensortes-frontend.service..."
cat > /etc/systemd/system/sensortes-frontend.service << EOF
[Unit]
Description=Sensortes Frontend Service
After=network.target

[Service]
User=$INSTALL_USER
WorkingDirectory=$FRONTEND_DIR
ExecStart=/bin/bash -c "source \$HOME/.nvm/nvm.sh && nvm use 20.20.2 && npm run dev -- --host 0.0.0.0 --port $FRONTEND_PORT"
Restart=always
RestartSec=5

[Install]
WantedBy=multi-user.target
EOF

echo "  → Recargando Systemd y activando servicios..."
systemctl daemon-reload
systemctl enable sensortes-backend.service  --quiet
systemctl enable sensortes-frontend.service --quiet
systemctl restart sensortes-backend.service
systemctl restart sensortes-frontend.service

echo "  ✓ Servicios registrados y activos."


# =====================================================
# RESUMEN FINAL
# =====================================================
echo ""
echo ""
echo "  ╔══════════════════════════════════════════════════════════╗"
echo "  ║        🚀  INSTALACIÓN COMPLETADA AL 100%               ║"
echo "  ╚══════════════════════════════════════════════════════════╝"
echo ""
echo "  📱 URLS DE ACCESO:"
echo "  ──────────────────────────────────────────────────────────"
echo "  Frontend  →  http://localhost:$FRONTEND_PORT"
echo "  Frontend  →  http://$IP_LOCAL:$FRONTEND_PORT"
echo ""
echo "  Backend   →  http://localhost:$APP_PORT"
echo "  API Docs  →  http://$IP_LOCAL:$APP_PORT/docs"
echo ""
echo "  ──────────────────────────────────────────────────────────"
echo "  ⚙️  COMANDOS ÚTILES:"
echo ""
echo "  Estado Backend:    sudo systemctl status sensortes-backend"
echo "  Estado Frontend:   sudo systemctl status sensortes-frontend"
echo "  Logs Backend:      sudo journalctl -u sensortes-backend -f"
echo "  Logs Frontend:     sudo journalctl -u sensortes-frontend -f"
echo "  ──────────────────────────────────────────────────────────"
echo ""
echo "  Los servicios arrancan automáticamente si el servidor"
echo "  se reinicia. ¡Todo listo! 🎉"
echo ""