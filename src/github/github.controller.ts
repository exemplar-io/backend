import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { CreateRepoDto } from './dto/createRepoDto';
import { GithubAuthDto } from './dto/githubAuthDto';
import { GithubService } from './github.service';

@Controller('github')
export class GithubController {
  constructor(private readonly githubService: GithubService) {}

  @ApiResponse({
    status: 200,
    description: 'Retrieve Auth Token',
    content: {
      'text/html': {
        schema: {
          type: 'string',
          example: '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',
        },
      },
    },
  })
  @Post('auth')
  authGithub(@Body() githubAuthDto: GithubAuthDto) {
    return this.githubService.authGithub(githubAuthDto.githubCode);
  }

  @Post('repo')
  createRepo(@Body() createRepoDto: CreateRepoDto) {
    return this.githubService.createRepo(
      createRepoDto.repoName,
      createRepoDto.githubToken,
    );
  }
}
