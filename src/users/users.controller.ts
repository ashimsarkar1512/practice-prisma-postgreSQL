import {
  Body,
  Controller,
  Post,
} from '@nestjs/common';
import { UsersService } from './users.service.js';
import { LoginUserDto } from './login-user-dto.js';
import { CreateUserDto } from './create-user-dto.js';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

    @Post('signup')
  async signUp(@Body() payload: CreateUserDto) {
    return await this.usersService.signUp(payload);
  }

  @Post('login')
  async login(@Body() loginUserDto: LoginUserDto) {
    return await this.usersService.login(loginUserDto);
  }
}
