import { Injectable } from '@nestjs/common';
import { GithubService } from '../github/github.service';

@Injectable()
export class AuthService {
  constructor(private githubService: GithubService) {}

  createRepo(name, token) {
    this.githubService.createRepo(name, token);
  }
}
