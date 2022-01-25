import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AppService } from './app.service';
import { LoginDto } from './dtos/login.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @MessagePattern('get-hello')
  getHello(): string {
    return this.appService.getHello();
  }

  @MessagePattern('login')
  login(@Payload() loginDto: LoginDto) {
    return this.appService.login(loginDto);
  }
}
