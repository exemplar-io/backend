import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { map } from 'rxjs';
import { exec } from 'child_process';
import { UnauthorizedException } from '@nestjs/common';
import { catchError } from 'rxjs';
import { GoneException } from '@nestjs/common';
import { throwError } from 'rxjs';
import { NotFoundException } from '@nestjs/common';
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

          return response.data['access_token'];
        }),
      );
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
      .pipe(
        map((response) => {
          const repoUrl = response.data.clone_url;
          GithubService.addFilesToRepo(token, repoUrl);
          return repoUrl;
        }),
        catchError((err) => {
          if (err.response.status === 422)
            throw new UnprocessableEntityException(
              'Repository name already in use',
            );
          else if (err.response.status === 401)
            throw new UnauthorizedException(
              'Invalid Github Authentication token',
            );

          throw new InternalServerErrorException(err);
        }),
      );
  }

  private static addFilesToRepo(token, url) {
    exec(`
      cd nest-template && \
      git config init.defaultBranch main && \
      git init && \
      git add . && \
      git commit -m "first commit" && \
      git remote add origin https://${token}@${url.substring(8)} && \
      git push -u origin main && \
      rm -rf .git
    `);
  }
}
