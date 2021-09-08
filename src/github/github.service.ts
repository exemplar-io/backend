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

  createRepo = (msName, apiName, rootName, token) =>
    zip(
      this.createRepoHTTPRequest(msName, token),
      this.createRepoHTTPRequest(apiName, token),
      this.createRepoHTTPRequest(rootName, token),
    ).pipe(
      map(async ([msUrl, apiUrl, rootUrl]) => {
        console.log(msUrl);
        console.log(apiUrl);

        await GithubService.addFilesToRepo(token, msUrl, 'ms');
        await GithubService.addFilesToRepo(token, apiUrl, 'api');
        await GithubService.addFilesToRoot(token, msUrl, apiUrl, rootUrl);
        await GithubService.gitCleanup();
        return { msUrl, apiUrl, rootUrl };
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

  private static async addFilesToRepo(token, url: string, name: string) {
    const githubUrl = 'https://' + token + '@' + url.substring(8);

    await exec(
      'cd ./project-template/' +
        name +
        ' && ' +
        'git config init.defaultBranch main && ' +
        'git init &&  ' +
        'git add . && ' +
        'git commit -m "first commit"  && ' +
        'git remote add origin ' +
        githubUrl +
        ' && ' +
        'git push -u origin main ',
    );
  }

  private static async addFilesToRoot(token, msUrl, apiUrl, rootUrl) {
    const githubUrl = 'https://' + token + '@' + rootUrl.substring(8);
    await exec(
      'cd ./project-template && ' +
        'git config init.defaultBranch main && ' +
        'git init &&  ' +
        'git submodule add ' +
        msUrl +
        ' ms && ' +
        'git submodule add ' +
        apiUrl +
        ' api && ' +
        'git add . && ' +
        'git commit -m "first commit"  && ' +
        'git remote add origin ' +
        githubUrl +
        ' && ' +
        'git push -u origin main ',
    );
  }
  private static async gitCleanup() {
    exec('cd ./project-template && rm -rf .git .gitmodules ms/.git api/.git');
  }

  deleteRepos = (
    msRepoName: any,
    apiRepoName: any,
    rootRepoName: any,
    token: any,
  ) =>
    zip(
      this.deleteRepoHttpRequest(msRepoName, token).pipe(
        map((res) => res.status),
      ),
      this.deleteRepoHttpRequest(apiRepoName, token).pipe(
        map((res) => res.status),
      ),
      this.deleteRepoHttpRequest(rootRepoName, token).pipe(
        map((res) => res.status),
      ),
    ).pipe(
      map(([res1, res2, res3]) => {
        return { res1, res2, res3 };
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
