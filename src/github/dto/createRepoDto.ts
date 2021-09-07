import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  Length,
  length,
  MaxLength,
} from 'class-validator';

export class CreateRepoDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'Repository Name' })
  repoName: string;

  // @IsString()
  @IsNotEmpty()
  @Length(40, 40, {
    message: 'githubToken length must be equal to 40 characters',
  })
  @ApiProperty({ example: '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' })
  githubToken: string;
}
