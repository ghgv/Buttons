#!/bin/bash

# Terminar inmediatamente si ocurre un error inesperado
set -e

# =====================================================
# VERIFICACIÓN DE PERMISOS
# =====================================================
if [ "$EUID" -ne 0 ]; then
    echo ""
    echo "❌ Este desinstalador debe ejecutarse con sudo"
    echo "   Uso correcto: sudo bash uninstall.sh"
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
echo "  ║         DESINSTALADOR SENSORTES          ║"
echo "  ║   Remoción Completa del Sistema (Daemon) ║"
echo "  ╚══════════════════════════════════════════╝"
echo ""
echo "  Directorio objetivo: $ROOT_DIR"
echo ""
echo "──────────────────────────────────────────────"
read -p "  ¿Estás seguro de desinstalar la app y sus servicios? [s/N]: " CONFIRM
CONFIRM=${CONFIRM:-N}
if [[ ! "$CONFIRM" =~ ^[Ss]$ ]]; then
    echo "  Desinstalación cancelada."
    exit 0
fi

# =====================================================
# 1. REMOVER SERVICIOS SYSTEMD
# =====================================================
echo ""
echo "⚙️ 1. Deteniendo y removiendo servicios de Systemd..."

# Detener servicios si están corriendo
systemctl stop sensortes-backend.service 2>/dev/null || true
systemctl stop sensortes-frontend.service 2>/dev/null || true

# Deshabilitar arranque automático
systemctl disable sensortes-backend.service 2>/dev/null || true
systemctl disable sensortes-frontend.service 2>/dev/null || true

# Eliminar archivos físicos de Systemd
rm -f /etc/systemd/system/sensortes-backend.service
rm -f /etc/systemd/system/sensortes-frontend.service

# Recargar el demonio para aplicar cambios de inmediato
systemctl daemon-reload
systemctl reset-failed

echo "   ✓ Servicios de Systemd removidos del sistema."

# =====================================================
# 2. LIMPIEZA DE ENVIROMENTS (.env) Y CACHÉ DE LOGS
# =====================================================
echo ""
echo "🧹 2. Eliminando archivos de configuración del entorno (.env)..."
rm -f "$BACKEND_DIR/.env"
rm -f "$FRONTEND_DIR/.env"
echo "   ✓ Archivos .env limpiados."

echo ""
echo "📊 3. Vaciando registros históricos de logs (journalctl)..."
journalctl --vacuum-time=1s >/dev/null 2>&1 || true
echo "   ✓ Caché de logs del sistema liberado."

# =====================================================
# 3. LIMPIEZA DE NODE_MODULES (OPCIONAL)
# =====================================================
echo ""
read -p "  ¿Deseas eliminar la carpeta 'node_modules' del frontend? [s/N]: " RM_NODE
RM_NODE=${RM_NODE:-N}
if [[ "$RM_NODE" =~ ^[Ss]$ ]]; then
    echo "   → Removiendo dependencias de Node (frontend/node_modules)..."
    rm -rf "$FRONTEND_DIR/node_modules"
    rm -f "$FRONTEND_DIR/package-lock.json"
    echo "   ✓ node_modules eliminado."
fi

# =====================================================
# 4.1 REMOCIÓN COMPLETA DEL MOTOR MYSQL (OPCIONAL)
# =====================================================
echo ""
echo "🖥️ ¿Deseas DESINSTALAR por completo el motor de MySQL del sistema?"
read -p "  (Esto borrará los binarios y configuraciones de MySQL) [s/N]: " PURGE_MYSQL
PURGE_MYSQL=${PURGE_MYSQL:-N}

if [[ "$PURGE_MYSQL" =~ ^[Ss]$ ]]; then
    echo "   → Deteniendo el servicio de MySQL..."
    systemctl stop mysql 2>/dev/null || true
    
    echo "   📦 Purgando paquetes de MySQL de forma completa..."
    # Eliminamos el servidor, el cliente y las configuraciones comunes
    apt-get purge -y mysql-server mysql-client mysql-common mysql-server-core-* mysql-client-core-*
    
    echo "   🧹 Eliminando residuos y dependencias huérfanas..."
    apt-get autoremove -y
    apt-get autoclean
    
    echo "   📁 Borrando directorios de datos y logs físicos..."
    rm -rf /etc/mysql /var/lib/mysql /var/log/mysql 2>/dev/null || true
    
    echo "   ✅ Motor de MySQL eliminado por completo del sistema operativo."
else
    echo "   ℹ️ El motor de MySQL se mantuvo instalado en el servidor."
fi

# =====================================================
# CIERRE
# =====================================================
echo ""
echo "=========================================================="
echo "          🛑 DESINSTALACIÓN COMPLETADA"
echo "=========================================================="
echo "  Los daemons, entornos virtuales y configuraciones locales"
echo "  fueron removidos. El servidor quedó limpio. 🧼"
echo "=========================================================="
echo ""