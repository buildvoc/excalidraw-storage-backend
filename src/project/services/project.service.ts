import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { Project } from '../entities/project.entity';
import { ProjectCreateDto } from '../dto/project-create.dto';
import { ProjectUpdateDto } from '../dto/project-update.dto';

@Injectable()
export class ProjectService {
  constructor(
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
  ) {}

  async create(user: User, projectCreateDto: ProjectCreateDto): Promise<Project> {

    const data = Object.assign(projectCreateDto, { user });

    const project = this.projectRepository.create(data);

    return await this.projectRepository.save(project);
  }

  async list(user: User): Promise<Project[]> {
    return await this.projectRepository.find({
      where: { user: { id: user.id } },
      order: { createdAt: 'DESC' },
      loadRelationIds: true,
    });
  }

  async findOne(id: number): Promise<Project> {
    const project = await this.projectRepository.findOne({
      where: { id },
      loadRelationIds: true,
    });

    if (!project) throw new NotFoundException(`There isn't any data with id: ${id}`);

    return project;
  }

  async update(id: number, updates: ProjectUpdateDto): Promise<Project> {
    const project = await this.findOne(id);

    this.projectRepository.merge(project, updates);

    return await this.projectRepository.save(project);
  }

  async remove(id: number): Promise<Project> {
    const project = await this.findOne(id);

    return await this.projectRepository.remove(project);
  }

}
