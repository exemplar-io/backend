import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

<<<<<<< HEAD

  @MessagePattern('get-hello')
  getHello(): string {
    return this.appService.getHello();
=======
  @MessagePattern('empty-ms')
  returnSomeMessage(): string {
    return this.appService.returnSomeMessage();
>>>>>>> 1390e4d173a9f5df15d0adf7b281608688124909
  }
}
