from pydantic import BaseModel


class MobileDeviceRegister(BaseModel):

    fcm_token: str

    platform: str

    app_version: str

    model: str

    android_version: str