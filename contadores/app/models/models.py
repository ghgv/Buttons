import enum
from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, ForeignKey, Enum
from sqlalchemy.orm import relationship
from app.core.database import Base 
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()

class GenderEnum(str, enum.Enum):
    men = "men"
    women = "women"
    mixed = "mixed"
    disabled = "disabled"

class UserRoleEnum(str, enum.Enum):
    nubeware_admin = "nubeware_admin"
    client_admin = "client_admin"
    supervisor = "supervisor"



class Client(Base):
    __tablename__ = "clients"

    id = Column(Integer, primary_key=True, index=True)
    nit = Column(Integer, nullable=True)
    name = Column(String(255), nullable=False)
    email = Column(String(255), nullable=True)
    address = Column(String(255), nullable=True)
    lat = Column(Float, nullable=True)
    lon = Column(Float, nullable=True)

    # Relaciones
    users = relationship("User", back_populates="client", cascade="all, delete")
    staff = relationship("Staff", back_populates="client", cascade="all, delete")
    sedes = relationship("Sede", back_populates="client", cascade="all, delete")


class Sede(Base):
    __tablename__ = "sedes"

    id = Column(Integer, primary_key=True, index=True)
    client_id = Column(Integer, ForeignKey("clients.id", ondelete="CASCADE"), nullable=False)
    name = Column(String(255), nullable=False)
    address = Column(String(255), nullable=True)

    # Relaciones
    client = relationship("Client", back_populates="sedes")
    levels = relationship("Level", back_populates="sede", cascade="all, delete")


class Level(Base):
    __tablename__ = "levels"

    id = Column(Integer, primary_key=True, index=True)
    # Cambiamos client_id por sede_id para mantener la jerarquía correcta
    sede_id = Column(Integer, ForeignKey("sedes.id", ondelete="CASCADE"), nullable=False)
    name = Column(String(100), nullable=False)
    floor = Column(Integer, nullable=False)

    # Relaciones
    sede = relationship("Sede", back_populates="levels")
    bathrooms = relationship("Bathroom", back_populates="level", cascade="all, delete")


class Bathroom(Base):
    __tablename__ = "bathrooms"

    id = Column(Integer, primary_key=True, index=True)
    level_id = Column(Integer, ForeignKey("levels.id", ondelete="CASCADE"), nullable=False)
    gender = Column(Enum(GenderEnum), nullable=False)
    description = Column(String(255), nullable=True)

    # Relaciones
    level = relationship("Level", back_populates="bathrooms")
    button_boxes = relationship("ButtonBox", back_populates="bathroom", cascade="all, delete")
    counters = relationship("Counter", back_populates="bathroom", cascade="all, delete")


class ButtonBox(Base):
    __tablename__ = "button_box_1"

    serie = Column(Integer, primary_key=True, index=True)
    bathroom_id = Column(Integer, ForeignKey("bathrooms.id", ondelete="CASCADE"), nullable=False)
    install_time = Column(DateTime, nullable=False)

    # Relaciones
    bathroom = relationship("Bathroom", back_populates="button_boxes")
    logs = relationship("ButtonLog", back_populates="button_box", cascade="all, delete")


class ButtonLog(Base):
    __tablename__ = "button_logs"

    id = Column(Integer, primary_key=True, index=True)
    button_box_serie = Column(Integer, ForeignKey("button_box_1.serie"), index=True, nullable=False)
    letter = Column(String(255), nullable=False)
    label = Column(String(255), nullable=False)
    create_time = Column(DateTime, nullable=False)

    # Relaciones
    button_box = relationship("ButtonBox", back_populates="logs")


class Counter(Base):
    __tablename__ = "counters_1"

    serie = Column(Integer, primary_key=True, index=True)
    bathroom_id = Column(Integer, ForeignKey("bathrooms.id", ondelete="CASCADE"), nullable=False)
    install_time = Column(DateTime, nullable=False)

    # Relaciones
    bathroom = relationship("Bathroom", back_populates="counters")
    logs = relationship("CounterLog", back_populates="counter", cascade="all, delete")


class CounterLog(Base):
    __tablename__ = "counter_logs"

    id = Column(Integer, primary_key=True, index=True)
    create_time = Column(DateTime, nullable=True)
    counter_serie = Column(Integer, ForeignKey("counters_1.serie"), index=True, nullable=True)
    amount = Column(Integer, nullable=True)

    # Relaciones
    counter = relationship("Counter", back_populates="logs")

# =========================
# MODELOS DE PERSONAL Y USUARIOS
# =========================

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    client_id = Column(Integer, ForeignKey("clients.id", ondelete="CASCADE"), nullable=False)
    name = Column(String(255), nullable=False)
    email = Column(String(255), unique=True, nullable=False, index=True)
    password_hash = Column(String(255), nullable=False)
    role = Column(Enum(UserRoleEnum), nullable=False)
    is_active = Column(Boolean, default=True)

    # Relaciones
    client = relationship("Client", back_populates="users")


class Staff(Base):
    __tablename__ = "staff"

    id = Column(Integer, primary_key=True, index=True)
    client_id = Column(Integer, ForeignKey("clients.id", ondelete="CASCADE"), nullable=False)
    name = Column(String(255), nullable=False)
    role = Column(String(100), nullable=False)
    is_active = Column(Boolean, default=True)

    # Relaciones
    client = relationship("Client", back_populates="staff")