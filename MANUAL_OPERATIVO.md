# Manual de Manipulación del Servicio Frontend (Sensor TES)

Este manual describe los procedimientos estrictos para actualizar el código en producción y controlar el estado del demonio del sistema operativo encargado del puerto `5174`.

## Flujo de Trabajo para Actualizaciones de Código (Despliegue)

Cada vez que realices un cambio en los componentes de React/TypeScript y necesites que los cambios se reflejen públicamente en `http://dali.com.co:5174`, debes seguir este orden exacto:

### 1. Compilación Estática (Generar la Build)
El comando `vite preview` se alimenta exclusivamente de los archivos optimizados dentro de la carpeta `dist/`. Por lo tanto, debes reconstruir el proyecto:
cd /home/didier/proyectos/sensor-tes-frontend
npm run build

Nota: Si modificaste variables de entorno en .env.production (como la URL del backend en el puerto 80), este paso las inyectará automáticamente en el código compilado.

2. Reiniciar el Servicio
Para que el servidor de Vite limpie los sockets previos, detecte la nueva carpeta dist/ y aplique los cambios inmediatamente:

sudo systemctl restart sensor-tes.service
Comandos de Control de Infraestructura
Usa estos comandos estándar en la terminal del servidor llama01 para controlar el estado del servicio:

Auditar el estado actual (Ver si está activo, cuánta memoria consume o si falló):

sudo systemctl status sensor-tes.service
Detener el servicio por completo (Apagar la aplicación web):

sudo systemctl stop sensor-tes.service
Iniciar el servicio si se encuentra apagado:

sudo systemctl start sensor-tes.service
Habilitar el arranque automático (Si el servidor físico se reinicia):

sudo systemctl enable sensor-tes.service
Monitoreo de Errores y Logs en Tiempo Real
Si la aplicación no carga o deseas verificar el tráfico y los errores internos de Node/Vite, tienes dos formas de auditar las salidas:

Opción A: Archivo de Log Local (Recomendado - Idéntico a Mock Sodexo)
Muestra las últimas líneas del archivo configurado dentro del proyecto y se actualiza automáticamente:

tail -f /home/didier/proyectos/sensor-tes-frontend/service.log
Opción B: Diario del Sistema (Systemd Journal)
Inspecciona directamente el comportamiento del demonio desde el administrador del sistema operativo:

journalctl -u sensor-tes.service -f -n 50 --no-pager
Notas Críticas de Redirección (Errores 404)
Al usar vite preview como servidor de producción, si un usuario intenta recargar la pestaña (F5) estando dentro de una ruta hija (ej: dali.com.co:5174/dashboard), el servidor buscará físicamente esa carpeta y lanzará un error 404.

Solución operativa: El ingreso inicial a la plataforma web siempre debe realizarse desde la raíz del dominio: http://dali.com.co:5174/. La navegación interna subsiguiente se resolverá mediante el enrutador de React en el navegador del cliente sin inconvenientes.