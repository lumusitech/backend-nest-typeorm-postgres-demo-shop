import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsStrongPassword,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    example: 'youremail@example.com',
    description: 'User email',
    required: true,
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    example: 'mYp4$w0rd',
    description:
      'User password: Should has at least 1 lowercase letter, 1 uppercase letter, 1 number, 1 symbol and min length 6 ',
    required: true,
    minLength: 6,
    maxLength: 20,
  })
  @IsStrongPassword(
    {
      minLength: 6,
      minLowercase: 0,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1,
    },
    {
      message:
        'password should has at least 1 lowercase letter, 1 uppercase letter, 1 number, 1 symbol and min length 6',
    },
  )
  @MaxLength(20)
  password: string;

  @ApiProperty({
    example: 'John Doe',
    description: 'User fullname',
    required: true,
    minLength: 3,
  })
  @IsString()
  @MinLength(3)
  fullname: string;
}
