import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { GithubService } from './github.service';

@Module({
  imports: [
    HttpModule.register({
      baseURL: 'https://api.github.com',
    }),
  ],
  providers: [GithubService],
  exports: [GithubService],
})
export class GithubModule {}
