import { Test, TestingModule } from '@nestjs/testing';
import { GithubService } from './github.service';
import { HttpModule, HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { lastValueFrom, of } from 'rxjs';

describe('GithubService', () => {
  let service: GithubService;
  let httpService: HttpService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GithubService, ConfigService],
      imports: [HttpModule],
    }).compile();

    service = module.get<GithubService>(GithubService);
    httpService = module.get<HttpService>(HttpService);
  });

  it('should be defined', async () => {
    expect(service).toBeDefined();

    jest.spyOn(httpService, 'post').mockReturnValue(
      of({
        data: { access_token: 'fake-token' },
        status: 200,
        statusText: '',
        headers: {},
        config: {},
      }),
    );

    const githubResponse = service.authGithub('fake-code');
    await expect(lastValueFrom(githubResponse)).resolves.toBe('fake-token');
  });
});
