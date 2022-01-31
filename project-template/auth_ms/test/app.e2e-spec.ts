import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { ClientProxy, ClientsModule, Transport } from '@nestjs/microservices';
import { lastValueFrom, Observable } from 'rxjs';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let client: ClientProxy;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule, ClientsModule.register([
        { name: 'MS', transport: Transport.TCP },
      ]),],
    }).compile();
    app = moduleFixture.createNestApplication();
    
    app.connectMicroservice({
      transport: Transport.TCP,
    });
    
    await app.startAllMicroservices();


    client = app.get('MS');
    await client.connect();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
    client.close();
  });

  it('Should login successfully', async () => {
    const response = await lastValueFrom(client.send(
      "login",
      { username: "admin", password: "password" },
    ));

    expect(typeof response).toBe("string");
    expect(response.length).toBeGreaterThan(10);
  });
});
