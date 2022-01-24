import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {

  returnSomeMessage(): string {
    return 'You have created a new endpoint which uses Redis';
  }
}
