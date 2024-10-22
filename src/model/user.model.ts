export class UserResponse {
  id: number;
  userId?: string;
  username?: string;
  email?: string;
  image?: string;
  name?: string;
  token?: string;
}

export class RegisterUserRequest {
  username?: string;
  name?: string;
  password?: string;
}

export class LoginUserRequest {
  userId?: number;
  email?: string;
  image?: string;
  username?: string;
  password?: string;
  token?: string;
}
