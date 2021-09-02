import { Body, Controller, Get, Post } from '@nestjs/common';
import { GithubService } from './github.service';

@Controller('github')
export class GithubController {
  constructor(private readonly githubService: GithubService) {}

  @Post('auth')
  authGithub(@Body() body) {
    return this.githubService.authGithub(body.code);
  }

  @Post('repo')
  createRepo(@Body() data) {
    return this.githubService.createRepo(data.name, data.token);
  }
}
