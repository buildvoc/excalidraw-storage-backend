import {
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class ProjectCreateDto {
  @IsNotEmpty()
  @IsString()
  projectName: string;

  @IsOptional()
  @IsString()
  projectDescription: string;

  @IsOptional()
  @IsNumber()
  @IsIn([1, 0])
  private: number;
}
