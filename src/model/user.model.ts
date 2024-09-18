export class UserResponse {
  id: number;
  username: string;
  name: string;
  token?: string;
}

export class RegisterUserRequest {
  username: string;
  name: string;
  password: string;
}

export class LoginUserRequest {
  username: string;
  password: string;
}
