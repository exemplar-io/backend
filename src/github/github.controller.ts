import { Body, Controller, Delete, Post, Query } from '@nestjs/common';
import { ApiQuery, ApiResponse } from '@nestjs/swagger';
import { create } from 'domain';
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
      createRepoDto.msRepoName,
      createRepoDto.apiRepoName,
      createRepoDto.frontendName,
      createRepoDto.rootRepoName,
      createRepoDto.githubToken,
    );
  }

  @ApiQuery({ name: 'msRepo', example: 'ms-repo-name' })
  @ApiQuery({ name: 'apiRepo', example: 'api-repo-name' })
  @ApiQuery({ name: 'rootRepo', example: 'root-repo-name' })
  @ApiQuery({
    name: 'token',
    example: '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',
  })
  @Delete('repo')
  deleteRepos(
    @Query('msRepo') msRepoName,
    @Query('apiRepo') apiRepoName,
    @Query('rootRepo') rootRepoName,
    @Query('token') token,
  ) {
    return this.githubService.deleteRepos(
      msRepoName,
      apiRepoName,
      rootRepoName,
      token,
    );
  }
}
