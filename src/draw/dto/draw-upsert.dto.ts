import {
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class DrawUpsertDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  value: string;

  @IsNotEmpty()
  project: number

  @IsOptional()
  @IsNumber()
  @IsIn([1, 0])
  private: number;
}
