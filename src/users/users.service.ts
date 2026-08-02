import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from './create-user-dto.js';
import { LoginUserDto } from './login-user-dto.js';
import * as bcrypt from 'bcrypt';

export interface signUpUserResponse {
  id: string;
  email: string;
}

@Injectable()
export class UsersService {



  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService
  ) {}

  async signUp(payload: CreateUserDto): Promise<signUpUserResponse> {
   const existingUser = await this.prisma.user.findFirst({
     where: {
       email: payload.email,
     },
   });

   if (existingUser) {
    throw new BadRequestException('user created with the email you provided', {
  cause: new Error(),
  description: 'user already registered',
});
   }

  const hash=await this.encryptPassword(payload.password,10);

  payload.password=hash;

  return await this.prisma.user.create({
    data: payload,  
    select: {
      id: true,
      email: true,
    },  
  });

  }


   async login(loginUserDto: LoginUserDto) {
    const user = await this.prisma.user.findFirst({
      where: {
        email: loginUserDto.email,
      },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isMatched = await this.decryptPassword(
      loginUserDto.password,
      user.password,
    );

    if (!isMatched) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const accessToken = await this.jwtService.signAsync(
      {
        email: user.email,
        sub: user.id,
      },
      {
        expiresIn: '1d',
      },
    );

    return {
      accessToken,
    };
  }
  async encryptPassword(plainText, saltRounds): Promise<string> {
    return await bcrypt.hash(plainText, saltRounds);
  }

  async decryptPassword(plainText, hash): Promise<boolean> {
    return await bcrypt.compare(plainText, hash);
  }

  // async createUser(data: { name: string; email: string; password: string }) {
  //   return this.prisma.user.create({
  //     data,
  //   });
  // }

  // async getAllUsers() {
  //   return this.prisma.user.findMany();
  // }

  // async getUserById(id: string) {
  //   return this.prisma.user.findUnique({
  //     where: { id },
  //   });
  // }

  // async updateUser(id: string, data: { name?: string; email?: string; password?: string }) {
  //   return this.prisma.user.update({
  //     where: { id },
  //     data,
  //   });
  // }

  // async deleteUser(id: string) {
  //   return this.prisma.user.delete({
  //     where: { id },
  //   });
  // }
}
