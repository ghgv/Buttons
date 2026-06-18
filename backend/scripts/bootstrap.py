from app.core.database import SessionLocal
from app.models.models import Client, User
from app.core.security import get_password_hash

import sys

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

    existing = db.query(User).filter(
        User.email == admin_email
    ).first()

    if existing:
        print("El usuario ya existe")
        sys.exit(1)

    client = Client(
        nit=client_nit,
        name=client_name,
        email=client_email
    )

    db.add(client)
    db.commit()
    db.refresh(client)

    admin = User(
        client_id=client.id,
        name=admin_name,
        email=admin_email,
        password_hash=get_password_hash(admin_password),
        role="client_admin"
    )

    db.add(admin)
    db.commit()

    print("Bootstrap completado")

finally:
    db.close()