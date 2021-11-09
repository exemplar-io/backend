import { UnauthorizedException } from '@nestjs/common';
import { Injectable, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dtos/login.dto';
var jwt = require('jsonwebtoken');

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

    if (idx === -1) throw new UnauthorizedException();

    return this.jwtService.sign(loginDto);
  }

  getHello(): string {
    return 'Hello World!';
  }
}
