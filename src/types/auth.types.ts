

export interface UserInfo {
  name: string;
  role: string;
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
  user_info: UserInfo;
}