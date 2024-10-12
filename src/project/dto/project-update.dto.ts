import { PartialType } from '@nestjs/mapped-types';
import { ProjectCreateDto } from './project-create.dto';

export class ProjectUpdateDto extends PartialType(ProjectCreateDto) {}
