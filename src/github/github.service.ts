import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { map } from 'rxjs';
import { exec } from 'child_process';
import { UnauthorizedException } from '@nestjs/common';
import { UnprocessableEntityException } from '@nestjs/common';
import { InternalServerErrorException } from '@nestjs/common';

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
      .pipe(
        map((response) => {
          if (response.data.error)
            throw new UnauthorizedException(response.data.error_description);
          console.log(response.data['access_token']);
          return response.data['access_token'];
        }),
      );
  }

  async createRepo(name, token) {
    const msUrl = await this.createRepoHTTPRequest(name, token);
    GithubService.addFilesToRepo(token, msUrl);
    const rootUrl = await this.createRepoHTTPRequest('kojdojixxx', token);
    GithubService.addFilesToRoot(token, msUrl, rootUrl);
    return rootUrl;
  }

  private createRepoHTTPRequest(name, token) {
    return new Promise((resolve) =>
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
          next: (response) => {
            resolve(response.data.clone_url);
          },
          error: (err) => {
            if (err.response.status === 422)
              throw new UnprocessableEntityException(
                'Repository name already in use',
              );
            else if (err.response.status === 401)
              throw new UnauthorizedException(
                'Invalid Github Authentication token',
              );
            throw new InternalServerErrorException(err);
          },
        }),
    );
  }

  private static addFilesToRepo(token, url) {
    exec(`
      cd project-template/nest && \
      git config init.defaultBranch main && \
      git init && \
      git add . && \
      git commit -m "first commit" && \
      git remote add origin https://${token}@${url.substring(8)} && \
      git push -u origin main && \
    `);
  }

  private static addFilesToRoot(token, msUrl, rootUrl) {
    // TODO: fix
    exec(`
      cd project-template && \
      git config init.defaultBranch main && \
      git init && \
      git submodule add ${msUrl} nest && \
      git add . && \
      git commit -m "first commit" && \
      git remote add origin https://${token}@${rootUrl.substring(8)} && \
      git push -u origin main && \
      rm -rf .git
    `);
    // exec('ls').stdout.on('data', (data) => {
    //   console.log(data);
    // });
  }
}
