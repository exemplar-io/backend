import { Body, Controller, Get, Post } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post()
  createRepo(@Body() data) {
    // validation on req
    this.authService.createRepo(data.name, data.token);
  }
}
