from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.api.deps import get_db, get_current_user

from app.schemas.mobile_devices import MobileDeviceRegister
from app.services.mobile_devices import register_device


router = APIRouter(

    prefix="/mobile",

    tags=["Mobile"]

)


@router.post("/device")

def register_mobile(

    body: MobileDeviceRegister,

    db: Session = Depends(get_db),

    current_user: dict = Depends(get_current_user),

):

    return register_device(

        db=db,

        user_id=current_user["user_id"],

        body=body,

    )