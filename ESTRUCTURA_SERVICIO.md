# Estructura del Servicio Systemd - Sensor TES Frontend

Este documento registra la configuración interna del servicio encargado de mantener la aplicación frontend corriendo de manera persistente en la máquina virtual `llama01`.

## Ubicación del Archivo en el Servidor
El archivo de configuración original reside en la ruta global del sistema operativo:
`/etc/systemd/system/sensor-tes.service`

## Código Fuente del Servicio (`sensor-tes.service`)

```ini
[Unit]
Description=Servicio Frontend Sensor TES
After=network.target

[Service]
Type=simple
User=didier
WorkingDirectory=/home/didier/proyectos/sensor-tes-frontend

# 1. Inyección del PATH absoluto de NVM para garantizar compatibilidad con Node v20.20.2
Environment="PATH=/home/didier/.nvm/versions/node/v20.20.2/bin:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin"
Environment=NODE_ENV=production

# 2. Ejecución de la vista previa de Vite exponiendo el host para el dominio dali.com.co
ExecStart=/home/didier/.nvm/versions/node/v20.20.2/bin/npx vite preview --host --port 5174

# 3. Políticas de resiliencia y reintentos ante fallos del proceso
Restart=always
RestartSec=3

# 4. Redirección y almacenamiento de logs de la aplicación
StandardOutput=append:/home/didier/proyectos/sensor-tes-frontend/service.log
StandardError=append:/home/didier/proyectos/sensor-tes-frontend/service.log

[Install]
WantedBy=multi-user.target