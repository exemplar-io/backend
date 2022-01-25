import { Catch, HttpException } from '@nestjs/common';
import { ExceptionsFilter } from '@nestjs/core/router/interfaces/exceptions-filter.interface';
import { ExceptionsHandler } from '@nestjs/core/exceptions/exceptions-handler';
import { throwError } from 'rxjs';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionsFilter {
  catch(exception: HttpException) {
    return throwError(exception.getResponse());
  }

  create(): ExceptionsHandler {
    return undefined;
  }
}
