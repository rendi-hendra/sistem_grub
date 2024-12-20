import {
  Body,
  Controller,
  Delete,
  HttpCode,
  Param,
  Post,
  // UseInterceptors,
} from '@nestjs/common';
import { UserService } from './user.service';
import {
  LoginUserRequest,
  RegisterUserRequest,
  UserResponse,
} from '../model/user.model';
import { WebResponse } from '../model/web.model';
import { Auth } from 'src/common/auth.decorator';
import { User } from '@prisma/client';
// import { TimeInterceptor } from 'src/common/time.interceptor';

@Controller('/api/users')
export class UserController {
  constructor(private userService: UserService) {}

  @Post()
  @HttpCode(201)
  async register(
    @Body() request: RegisterUserRequest,
  ): Promise<WebResponse<UserResponse>> {
    const result = await this.userService.register(request);
    return {
      data: result,
    };
  }

  @Post('/login')
  @HttpCode(200)
  // @UseInterceptors(TimeInterceptor)
  async login(
    @Body() request: LoginUserRequest,
  ): Promise<WebResponse<UserResponse>> {
    const result = await this.userService.login(request);
    return {
      data: result,
    };
  }

  @Post('/oauth/login')
  @HttpCode(200)
  async oauth(
    @Body() request: LoginUserRequest,
  ): Promise<WebResponse<UserResponse>> {
    const result = await this.userService.oauth(request);
    return {
      data: result,
    };
  }

  @Delete('/signout/:token')
  @HttpCode(200)
  async signOut(
    @Auth() user: User,
    @Param('token') token: string,
  ): Promise<WebResponse<UserResponse>> {
    const result = await this.userService.signOut(user, token);
    return {
      data: result,
    };
  }
}
