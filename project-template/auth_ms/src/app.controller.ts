import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AppService } from './app.service';
import { LoginDto } from './dtos/login.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @MessagePattern('login')
  login(@Payload() loginDto: LoginDto) {
    return this.appService.login(loginDto);
  }
}
