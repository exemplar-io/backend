import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class AppService {
  constructor(@Inject('MS') private readonly clientProxy: ClientProxy) {}
  getHello() {
    return this.clientProxy.send('get-hello', 'hello');
  }
}
