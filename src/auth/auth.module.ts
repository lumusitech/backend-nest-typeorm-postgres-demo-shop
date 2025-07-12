import { Module } from '@nestjs/common';
//? Auth
import { PassportModule } from '@nestjs/passport';
//? BD
import { TypeOrmModule } from '@nestjs/typeorm';
//? Rest
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { User } from './entities/user.entity';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([User]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    //? Must be async to get env variables before running
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'), //? secret is an Async property
        signOptions: {
          expiresIn: '2h',
        },
      }),
    }),
  ],
  exports: [TypeOrmModule, JwtStrategy, JwtModule, PassportModule],
})
export class AuthModule {}
