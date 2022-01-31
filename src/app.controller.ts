import { Controller, Get } from '@nestjs/common';
import { ApiBearerAuth, ApiProperty, ApiResponse } from '@nestjs/swagger';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @ApiResponse({
    status: 200,
    description:
      'Endpoint for testing connection. Returns simple Hello World! ',
    content: {
      'text/html': {
        schema: { type: 'string', example: 'Hello World!' },
      },
    },
  })
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
