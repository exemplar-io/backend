import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { map } from 'rxjs';

@Injectable()
export class AppService {
  constructor(@Inject('MS') private readonly clientProxy: ClientProxy) {}

  login(user) {
    return this.clientProxy.send('login', user).pipe(
      map((res) => {
        // if (res === '401') throw new UnauthorizedException();
        return res;
      }),
    );
  }
  getHello() {
    return this.clientProxy.send('get-hello', 'hello');
  }
}
