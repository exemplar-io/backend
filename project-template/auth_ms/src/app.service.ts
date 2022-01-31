import { UnauthorizedException } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dtos/login.dto';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class AppService {
  constructor(private readonly jwtService: JwtService) {}

  users = [
    {
      username: 'admin',
      password: 'password',
    },
  ];

  login(loginDto: LoginDto): string {
    const idx = this.users.findIndex(
      (u) =>
        u.username === loginDto.username && u.password === loginDto.password,
    );

    if (idx === -1) throw new RpcException('Unauthorized');

    return this.jwtService.sign(loginDto);
  }
}
