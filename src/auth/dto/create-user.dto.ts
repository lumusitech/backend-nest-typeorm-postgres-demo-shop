import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsStrongPassword,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

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

  @IsString()
  @MinLength(3)
  fullname: string;
}
