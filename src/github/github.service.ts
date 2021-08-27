import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class GithubService {
  constructor(private httpService: HttpService) {}

  createRepo(name, token) {
    this.httpService
      .post(
        '/user/repos',
        {
          name: name,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )
      .subscribe({
        next: (response) => console.log(response.status),
        error: (error) => console.log(error),
      });
  }
}
