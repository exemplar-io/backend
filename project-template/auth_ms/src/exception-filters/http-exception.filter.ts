import { ArgumentsHost, Catch, HttpException } from '@nestjs/common';
import { ExceptionsFilter } from '@nestjs/core/router/interfaces/exceptions-filter.interface';
import { Controller } from '@nestjs/common/interfaces';
import { ContextId } from '@nestjs/core';
import { ExceptionsHandler } from '@nestjs/core/exceptions/exceptions-handler';
import { throwError } from 'rxjs';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionsFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    return throwError(exception.getResponse());
  }

  create(
    instance: Controller,
    callback: Function,
    module: string,
    contextId?: ContextId,
    inquirerId?: string,
  ): ExceptionsHandler {
    return undefined;
  }
}
