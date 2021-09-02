import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { map } from 'rxjs';

@Injectable()
export class GithubService {
  constructor(
    private httpService: HttpService,
    private configService: ConfigService,
  ) {}

  authGithub(code: string) {
    return this.httpService
      .post(
        'https://github.com/login/oauth/access_token',
        {
          client_id: this.configService.get<string>('GITHUB_CLIENT_ID'),
          client_secret: this.configService.get<string>('GITHUB_SECRET'),
          code,
        },
        {
          headers: { Accept: 'application/json' },
        },
      )
      .pipe(map((response) => response.data['access_token']));
  }

  createRepo(name, token) {
    return this.httpService
      .post(
        'https://api.github.com/user/repos',
        {
          name,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )
      .pipe(map((response) => response.data.clone_url));
  }
}
