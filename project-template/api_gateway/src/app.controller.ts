import { Body, Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('login')
  login(@Body() body) {
    return this.appService.login(body);
  }
  @Get()
  getHello() {
    return this.appService.getHello();
  }
}
