#!/bin/bash

set -e

echo "=========================================="
echo "      INSTALADOR SENSORTES"
echo "=========================================="

ROOT_DIR=$(pwd)

BACKEND_DIR="$ROOT_DIR/backend"
FRONTEND_DIR="$ROOT_DIR/frontend"

###########################################
# VALIDACIONES
###########################################

if [ ! -d "$BACKEND_DIR" ]; then
    echo "ERROR: No existe la carpeta backend"
    exit 1
fi

if [ ! -d "$FRONTEND_DIR" ]; then
    echo "ERROR: No existe la carpeta frontend"
    exit 1
fi

###########################################
# BACKEND
###########################################

echo ""
echo "=========================================="
echo "CONFIGURANDO BACKEND"
echo "=========================================="

cd "$BACKEND_DIR"

if ! command -v python3 >/dev/null 2>&1; then
    echo "ERROR: Python3 no está instalado"
    exit 1
fi

echo ""
echo "Creando entorno virtual..."

if [ ! -d "venv" ]; then
    python3 -m venv venv
fi

source venv/bin/activate

echo ""
echo "Actualizando pip..."

pip install --upgrade pip

echo ""
echo "Instalando dependencias Python..."

pip install -r requirements.txt

###########################################
# DATOS BASE DE DATOS
###########################################

echo ""
echo "=========================================="
echo "CONFIGURACIÓN BASE DE DATOS"
echo "=========================================="

read -p "Host BD: " DB_HOST

read -p "Puerto BD [3306]: " DB_PORT
DB_PORT=${DB_PORT:-3306}

read -p "Nombre BD: " DB_NAME

read -p "Usuario BD: " DB_USER

read -s -p "Password BD: " DB_PASSWORD
echo ""

###########################################
# CREAR .ENV BACKEND
###########################################

cat > .env << EOF
DB_HOST=$DB_HOST
DB_PORT=$DB_PORT
DB_NAME=$DB_NAME
DB_USER=$DB_USER
DB_PASSWORD=$DB_PASSWORD

APP_HOST=0.0.0.0
APP_PORT=80
DEBUG=False
EOF

echo ""
echo "✓ backend/.env creado"

###########################################
# VALIDAR CONEXIÓN
###########################################

echo ""
echo "Probando conexión MySQL..."

python << EOF
from sqlalchemy import create_engine,text

url = (
    "mysql+pymysql://"
    "$DB_USER:"
    "$DB_PASSWORD@"
    "$DB_HOST:"
    "$DB_PORT/"
    "$DB_NAME"
)

try:

    engine = create_engine(
        url,
        pool_pre_ping=True
    )

    with engine.connect() as conn:
        conn.execute(text("SELECT 1"))

    print("✓ Conexión exitosa")

except Exception as e:
    print(f"ERROR DE CONEXIÓN: {e}")
    raise SystemExit(1)
EOF

###########################################
# VALIDAR FASTAPI
###########################################

echo ""
echo "Validando carga de FastAPI..."

python << EOF
try:
    from app.main import app
    print("✓ FastAPI cargó correctamente")
except Exception as e:
    print(f"ERROR: {e}")
    raise SystemExit(1)
EOF

###########################################
# FRONTEND
###########################################

echo ""
echo "=========================================="
echo "CONFIGURANDO FRONTEND"
echo "=========================================="

cd "$FRONTEND_DIR"

###########################################
# NODE.JS
###########################################

echo ""
echo "Validando Node.js..."

export NVM_DIR="$HOME/.nvm"

# Instalar NVM si no existe
if [ ! -d "$NVM_DIR" ]; then

    echo "Instalando NVM..."

    curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash

fi

# Cargar NVM
source "$NVM_DIR/nvm.sh"

TARGET_NODE="20.20.2"

CURRENT_NODE=$(node -v 2>/dev/null | sed 's/v//')

if [ "$CURRENT_NODE" != "$TARGET_NODE" ]; then

    echo ""
    echo "Instalando Node.js $TARGET_NODE ..."

    nvm install $TARGET_NODE
    nvm use $TARGET_NODE
    nvm alias default $TARGET_NODE

else

    echo "✓ Node.js $TARGET_NODE ya instalado"

fi

echo ""
echo "Versión Node:"
node -v

echo ""
echo "Versión npm:"
npm -v

###########################################
# NPM INSTALL
###########################################

echo ""
echo "Instalando dependencias frontend..."

npm install

###########################################
# .ENV FRONTEND
###########################################

if [ ! -f ".env" ]; then

cat > .env << EOF
VITE_API_URL=http://dali.com.co:80
EOF

fi

echo "✓ frontend/.env creado"

###########################################
# ARRANCAR BACKEND
###########################################

echo ""
echo "Iniciando Backend..."

cd "$BACKEND_DIR"

source venv/bin/activate

nohup python run.py > backend.log 2>&1 &

BACKEND_PID=$!

echo "✓ Backend iniciado (PID: $BACKEND_PID)"

###########################################
# ARRANCAR FRONTEND
###########################################

echo ""
echo "Iniciando Frontend..."

cd "$FRONTEND_DIR"

nohup bash -c "
source \$HOME/.nvm/nvm.sh
nvm use 20.20.2 >/dev/null
npm run dev -- --host 0.0.0.0
" > "$FRONTEND_DIR/frontend.log" 2>&1 &

FRONTEND_PID=$!

sleep 5

if ps -p $FRONTEND_PID > /dev/null
then
    echo "✓ Frontend iniciado (PID: $FRONTEND_PID)"
else
    echo "✗ Error iniciando Frontend"
    echo "Revisar log:"
    echo "$FRONTEND_DIR/frontend.log"
fi

###########################################
# FIN
###########################################

echo ""
echo "=========================================="
echo " INSTALACIÓN COMPLETADA "
echo "=========================================="
echo ""

echo "Backend:"
echo "------------------------------------------"
echo "cd backend"
echo "source venv/bin/activate"
echo "python run.py"

echo ""
echo "Frontend:"
echo "------------------------------------------"
echo "cd frontend"
echo "Editar .env y configurar:"
echo ""
echo "VITE_API_URL=http://IP_SERVIDOR:8000"
echo ""
echo "npm run dev"

echo ""
echo "✓ Todo listo"