import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Length } from 'class-validator';

export class GithubAuthDto {
  @ApiProperty({ example: '4518c52eda8205aa47ff' })
  @Length(20, 20, {
    message: 'githubCode length must be equal to 20 characters',
  })
  @IsString()
  @IsNotEmpty()
  githubCode: string;
}
