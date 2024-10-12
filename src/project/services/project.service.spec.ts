import { Test, type TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { createMock } from 'ts-auto-mock';
import type { Repository } from 'typeorm';
import { ProjectService } from './project.service';
import { Project } from '../entities/project.entity';
import { ProjectUpdateDto } from '../dto/project-update.dto';

describe('ProjectService', () => {
  let service: ProjectService;
  let mockedProjectRepository: jest.Mocked<Repository<Project>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProjectService],
    })
      .useMocker(token => {
        if (Object.is(token, getRepositoryToken(Project))) {
          return createMock<Repository<Project>>();
        }
      })
      .compile();

    service = module.get<ProjectService>(ProjectService);
    mockedProjectRepository = module.get(getRepositoryToken(Project));
  });

  it('should be an instanceof ProjectService', () => {
    expect(service).toBeInstanceOf(ProjectService);
  });

  it('should create a new project', async () => {
    const data = {
      projectName: 'Project 1',
      projectDescription: 'Description of Project 1',
      private: 1,
    };

    mockedProjectRepository.save.mockResolvedValueOnce(createMock<Project>(data));
    const project = await service.create(data);

    expect(project).toBeDefined();
  });

  it('should find one project', async () => {
    const id = 1;

    mockedProjectRepository.findOne.mockResolvedValueOnce(
      createMock<Project>({ id }),
    );
    const project = await service.findOne({ where: { id } });

    expect(project).toBeDefined();
    expect(project).toHaveProperty('id', 1);
  });

  it('should throw on find one when the project not exist', async () => {
    mockedProjectRepository.findOne.mockResolvedValueOnce(undefined);

    await expect(
      service.findOne({ where: { id: 10 } }),
    ).rejects.toThrowErrorMatchingInlineSnapshot(
      `"There isn't any project with identifier: [object Object]"`,
    );
  });

  it('should update an project', async () => {
    const id = 1;
    const updates: ProjectUpdateDto = {
      projectName: 'Project 11',
    };

    mockedProjectRepository.save.mockResolvedValueOnce(createMock<Project>(updates));
    const project = await service.update(id, updates);

    expect(project).toBeDefined();
    expect(project).toHaveProperty('projectName', updates.projectName);
  });

  it('should throw on update when the user not exist', async () => {
    const id = 0;
    const updates: ProjectUpdateDto = {
      projectName: 'Project 0',
    };
    mockedProjectRepository.findOneBy.mockResolvedValueOnce(undefined);

    await expect(
      service.update(id, updates),
    ).rejects.toThrowErrorMatchingInlineSnapshot(
      `"There isn't any project with id: 0"`,
    );
  });
});
