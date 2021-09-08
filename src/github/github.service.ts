import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { map, zip } from 'rxjs';
// import { exec } from 'child_process';
import { UnauthorizedException } from '@nestjs/common';
import { UnprocessableEntityException } from '@nestjs/common';
import { InternalServerErrorException } from '@nestjs/common';
import { promisify } from 'util';
const exec = promisify(require('child_process').exec);

@Injectable()
export class GithubService {
  constructor(
    private httpService: HttpService,
    private configService: ConfigService,
  ) {}

  authGithub = (code: string) =>
    this.httpService
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

  createRepo = (msName, rootName, token) =>
    zip(
      this.createRepoHTTPRequest(msName, token),
      this.createRepoHTTPRequest(rootName, token),
    ).pipe(
      map(async ([msUrl, rootUrl]) => {
        GithubService.addFilesToRepo(token, msUrl);
        await GithubService.addFilesToRoot(token, msUrl, rootUrl);
        GithubService.gitCleanup();
        return { msUrl, rootUrl };
      }),
    );

  private createRepoHTTPRequest = (name, token) =>
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
      .pipe(map((res) => res.data.clone_url));

  private static addFilesToRepo(token, url: string) {
    const githubUrl = 'https://' + token + '@' + url.substring(8);

    exec(
      'cd ./project-template/nest && ' +
        'git config init.defaultBranch main && ' +
        'git init &&  ' +
        'git add . && ' +
        'git commit -m "first commit"  &&' +
        'git remote add origin ' +
        githubUrl +
        ' && ' +
        'git push -u origin main ',
    );
  }

  private static async addFilesToRoot(token, msUrl, rootUrl) {
    const githubUrl = 'https://' + token + '@' + rootUrl.substring(8);
    await exec(
      'cd ./project-template && ' +
        'git config init.defaultBranch main && ' +
        'git init &&  ' +
        'git submodule add ' +
        msUrl +
        ' nest && ' +
        'git add . && ' +
        'git commit -m "first commit" && ' +
        'git remote add origin ' +
        githubUrl +
        ' && ' +
        'git push -u origin main ',
    );
  }
  private static gitCleanup() {
    exec(
      'cd ./project-template && rm -rf .git && rm .gitmodules && rm -rf nest/.git',
    );
  }

  deleteRepos = (msRepoName: any, rootRepoName: any, token: any) =>
    zip(
      this.deleteRepoHttpRequest(msRepoName, token).pipe(
        map((res) => res.status),
      ),
      this.deleteRepoHttpRequest(rootRepoName, token).pipe(
        map((res) => res.status),
      ),
    ).pipe(
      map(([res1, res2]) => {
        return { res1, res2 };
      }),
    );

  private deleteRepoHttpRequest = (repoName, token) =>
    this.httpService.delete(
      'https://api.github.com/repos/christianhjelmslund/' + repoName,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
}
