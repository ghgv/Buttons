from pydantic import BaseModel


class MobileDeviceRegister(BaseModel):

    fcm_token: str

    platform: str

    app_version: str

    model: str

    android_version: str



from typing import Optional
from pydantic import BaseModel


class MobileDeviceRegister(BaseModel):

    fcm_token: str

    platform: Optional[str] = None

    app_version: Optional[str] = None

    model: Optional[str] = None

    android_version: Optional[str] = None