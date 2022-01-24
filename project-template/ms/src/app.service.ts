import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {

  returnSomeMessage(): string {
    return 'This is the empty MS';
  }
}
