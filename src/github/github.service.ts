import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class GithubService {
  constructor(
    private httpService: HttpService,
    private configService: ConfigService,
  ) {}

  authGithub(code: string) {
    this.httpService
      .post('https://github.com/login/oauth/access_token', {
        client_id: this.configService.get<string>('GITHUB_CLIENT_ID'),
        client_secret: this.configService.get<string>('GITHUB_SECRET'),
        code,
      })
      .subscribe({
        next: (response) => console.log(response),
        error: (error) => console.log(error),
      });
  }

  createRepo(name, token) {
    this.httpService
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
      .subscribe({
        next: (response) => console.log(response.status),
        error: (error) => console.log(error),
      });
  }
}
