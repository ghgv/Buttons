import sys
import os

# Asegurar resolución de módulos de la app en la raíz del backend
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.core.database import SessionLocal
from app.models.models import Client, User
from app.core.security import get_password_hash

if len(sys.argv) != 7:
    print(
        "Uso: python -m scripts.bootstrap "
        "<empresa> <nit> <email_empresa> "
        "<admin> <email_admin> <password>"
    )
    sys.exit(1)

client_name = sys.argv[1]
client_nit = sys.argv[2]
client_email = sys.argv[3]

admin_name = sys.argv[4]
admin_email = sys.argv[5]
admin_password = sys.argv[6]

db = SessionLocal()

try:
    existing = db.query(User).filter(User.email == admin_email).first()

    if existing:
        print("❌ Error: El usuario administrador ya existe.")
        sys.exit(1)

    # 1. Crear el cliente
    client = Client(
        nit=client_nit,
        name=client_name,
        email=client_email
    )

    db.add(client)
    db.commit()
    db.refresh(client)

    # 2. Asignar el administrador de tipo cliente a ese ID generado
    admin = User(
        client_id=client.id,
        name=admin_name,
        email=admin_email,
        password_hash=get_password_hash(admin_password),
        role="client_admin"
    )

    db.add(admin)
    db.commit()

    print("✅ Bootstrap completado: Empresa y administrador creados exitosamente.")

except Exception as e:
    db.rollback()
    print(f"❌ Error en la ejecución del Bootstrap: {e}")
    sys.exit(1)
finally:
    db.close()