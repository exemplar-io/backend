import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';

import { AppService } from './app.service';
import { RpcException } from '@nestjs/microservices';

describe('AppService', () => {
  let appService: AppService;
  const jwt = 'jwt';

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      providers: [
        AppService,
        {
          provide: JwtService,
          useValue: { sign: jest.fn(() => jwt) },
        },
      ],
    }).compile();

    appService = app.get<AppService>(AppService);
  });

  describe('login', () => {
    it('should throw 401 if credentials were incorrect', () => {
      const username = 'incorrect';
      const password = 'credentials';
      expect(() => appService.login({ username, password })).toThrow(
        RpcException,
      );
    });

    it('Should return jwt if correct credentials provided', () => {
      const username = 'admin';
      const password = 'password';

      expect(appService.login({ username, password })).toEqual(jwt);
    });
  });
});
