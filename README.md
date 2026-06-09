# Ver estado del servicio
sudo systemctl status sensor-frontend

# Detener el servicio
sudo systemctl stop sensor-frontend

# Reiniciar el servicio
sudo systemctl restart sensor-frontend

# Ver logs en tiempo real
sudo journalctl -u sensor-frontend -f

# Ver logs del archivo específico
sudo tail -f /var/log/sensor-frontend.log

# Ver las últimas líneas del log
sudo tail -100 /var/log/sensor-frontend.log