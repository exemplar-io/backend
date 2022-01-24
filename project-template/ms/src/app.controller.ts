import { ConsoleLogger, Controller, Get } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}


  @MessagePattern('empty-ms')
  returnSomeMessage(): string {
    return this.appService.returnSomeMessage();
  }
}
