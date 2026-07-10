# app/core/logger.py

import logging
import os
import sys

LOG_DIR = "/var/log/sensortes"
os.makedirs(LOG_DIR, exist_ok=True)

logger = logging.getLogger("sensortes")
logger.setLevel(logging.INFO)

formatter = logging.Formatter(
    "%(asctime)s %(levelname)s %(filename)s:%(lineno)d %(message)s"
)

# Consola (journalctl)
console = logging.StreamHandler(sys.stdout)
console.setFormatter(formatter)

# Archivo
file = logging.FileHandler(f"{LOG_DIR}/backend.log")
file.setFormatter(formatter)

logger.addHandler(console)
logger.addHandler(file)