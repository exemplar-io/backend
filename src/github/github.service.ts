import { HttpException, Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { catchError, concatMap, map, zip } from 'rxjs';
import { UnauthorizedException } from '@nestjs/common';
import { promisify } from 'util';
import * as fs from 'fs';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const exec = promisify(require('child_process').exec);

@Injectable()
export class GithubService {
  constructor(
    private httpService: HttpService,
    private configService: ConfigService,
  ) {}

  authGithub = (code: string) => {
    console.log(this.configService.get<string>('APP_CLIENT_ID'));
    console.log(this.configService.get<string>('APP_SECRET'));

    return this.httpService
      .post(
        'https://github.com/login/oauth/access_token',
        {
          client_id: this.configService.get<string>('APP_CLIENT_ID'),
          client_secret: this.configService.get<string>('APP_SECRET'),
          code,
        },
        {
          headers: { Accept: 'application/json' },
        },
      )
      .pipe(
        map((response) => {
          if (response.data && response.data.error)
            throw new UnauthorizedException(response.data.error_description);
          return response.data['access_token'];
        }),
      );
  };
  createRepo = (projectName, token) =>
    zip(
      this.createRepoHTTPRequest(projectName + '-ms', token),
      this.createRepoHTTPRequest(projectName + '-api', token),
      this.createRepoHTTPRequest(projectName + '-frontend', token),
      this.createRepoHTTPRequest(projectName, token),
    ).pipe(
      map(async ([msUrl, apiUrl, frontendUrl, rootUrl]) => {
        try {
          await GithubService.gitConfig();
          await Promise.all([
            GithubService.addFilesToRepo(token, msUrl, 'ms'),
            GithubService.addFilesToRepo(token, apiUrl, 'api'),
            GithubService.addFilesToRepo(token, frontendUrl, 'frontend'),
          ]);
          await GithubService.addFilesToRoot(
            token,
            msUrl,
            apiUrl,
            frontendUrl,
            rootUrl,
          );

          GithubService.updateHomepageUrl(frontendUrl);

          await Promise.all([
            GithubService.pushFilesToRepo('ms'),
            GithubService.pushFilesToRepo('api'),
            GithubService.pushFilesToRepo('frontend'),
            GithubService.pushFilesToRepo('root'),
          ]);

          await this.updateGithubPagesBranch(frontendUrl, token).toPromise();

          await GithubService.gitCleanup();
        } catch (e) {
          await GithubService.gitCleanup();
          throw e;
        }

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
      .pipe(
        map((res) => {
          return res.data.clone_url;
        }),
        catchError((err) => {
          throw new HttpException(
            err.response.data.message,
            err.response.status,
          );
        }),
      );

  private static gitConfig() {
    return exec('git config --global user.email "you@example.com"  ');
  }

  private static pushFilesToRepo(name: string) {
    if (name !== 'root')
      return exec(
        'cd ./project-template/' + name + ' && git push -u origin main',
      );
    return exec('cd ./project-template/ && git push -u origin main');
  }

  private static updateHomepageUrl(url: string) {
    const [username, projectName] = url
      .substring(19, url.length - 4)
      .split('/');

    const fileLines = fs
      .readFileSync('./project-template/frontend/package.json')
      .toString()
      .split('\n');
    fileLines[2] = `  "homepage": "https://${username}.github.io/${projectName}/",`;

    fs.writeFileSync(
      './project-template/frontend/package.json',
      fileLines.join('\n'),
    );
  }

  private updateGithubPagesBranch(url: string, token: string) {
    const [username, projectName] = url
      .substring(19, url.length - 4)
      .split('/');

    return this.httpService
      .get(`https://api.github.com/repos/${username}/${projectName}/branches`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .pipe(
        concatMap((res) =>
          this.httpService.post(
            `https://api.github.com/repos/${username}/${projectName}/git/refs`,
            {
              ref: 'refs/heads/gh-pages',
              sha: res.data[0].commit.sha,
            },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            },
          ),
        ),
      )
      .pipe(
        concatMap(() =>
          this.httpService.post(
            `https://api.github.com/repos/${username}/${projectName}/pages`,
            {
              source: {
                branch: 'gh-pages',
                path: '/',
              },
            },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            },
          ),
        ),
      );
  }

  private static addFilesToRepo(token, url: string, name: string) {
    const githubUrl = 'https://' + token + '@' + url.substring(8);

    return exec(
      'cd ./project-template/' +
        name +
        ' && ' +
        'git init -b main && ' +
        'git add . && ' +
        'git commit -m "first commit"  && ' +
        'git remote add origin ' +
        githubUrl,
    );
  }

  private static async addFilesToRoot(
    token,
    msUrl,
    apiUrl,
    frontendUrl,
    rootUrl,
  ) {
    const githubUrl = 'https://' + token + '@' + rootUrl.substring(8);
    await exec(
      'cd ./project-template && ' +
        'git init -b main &&  ' +
        'git submodule add ' +
        msUrl +
        ' ms && ' +
        'git submodule add ' +
        apiUrl +
        ' api && ' +
        'git submodule add ' +
        frontendUrl +
        ' frontend && ' +
        'git add . && ' +
        'git commit -m "first commit"  && ' +
        'git remote add origin ' +
        githubUrl,
    );
  }
  private static async gitCleanup() {
    exec(
      'cd ./project-template && rm -rf .git .gitmodules ms/.git api/.git frontend/.git',
    );
  }

  deleteRepos = (projectName: any, token: any) =>
    zip(
      this.deleteRepoHttpRequest(projectName + '-ms', token),
      this.deleteRepoHttpRequest(projectName + '-api', token),
      this.deleteRepoHttpRequest(projectName + '-frontend', token),
      this.deleteRepoHttpRequest(projectName, token),
    ).pipe(
      map(([res1, res2, res3, res4]) => {
        return { res1, res2, res3, res4 };
      }),
    );

  private deleteRepoHttpRequest = (repoName, token) =>
    this.httpService
      .delete(
        'https://api.github.com/repos/' +
          this.configService.get<string>('DELETE_GITHUB_REPO_NAME', 'sasp1') +
          '/' +
          repoName,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )
      .pipe(
        map((res) => res.status),
        catchError((err) => {
          throw new HttpException(
            err.response.data.message,
            err.response.status,
          );
        }),
      );
}
