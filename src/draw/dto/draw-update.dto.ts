import { PartialType } from '@nestjs/mapped-types';
import { DrawUpsertDto } from './draw-upsert.dto';

export class DrawUpdateDto extends PartialType(DrawUpsertDto) {}
