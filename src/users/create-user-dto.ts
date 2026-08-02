import { IsBIC, IsBoolean, IsEmail, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateUserDto {
    @IsNotEmpty()
   @IsString()
   name: string;

   @IsEmail()
   @IsNotEmpty()
   email: string;

   @IsString()
   @IsNotEmpty()
   password: string;

   @IsBoolean()
   @IsOptional()
   blocked: boolean;
}