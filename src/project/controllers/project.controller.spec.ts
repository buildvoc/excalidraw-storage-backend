import { Test, TestingModule } from '@nestjs/testing';
import { createMock } from 'ts-auto-mock';

import { ProjectController } from './project.controller';
import { Project } from '../entities/project.entity';
import { ProjectService } from '../services/project.service';

describe('Project Controller', () => {
  let controller: ProjectController;
  let mockedProjectService: jest.Mocked<ProjectService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProjectController],
    })
      .useMocker(token => {
        if (Object.is(token, ProjectService)) {
          return createMock<ProjectService>();
        }
      })
      .compile();

    controller = module.get<ProjectController>(ProjectController);
    mockedProjectService = module.get<ProjectService, jest.Mocked<ProjectService>>(
      ProjectService,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should get a project', async () => {
    await expect(controller.get(1)).resolves.toBeDefined();
  });

  it('should update a project', async () => {
    const updatesProject = {
      projectName: 'Project 1',
    };

    mockedProjectService.update.mockResolvedValueOnce(
      createMock<Project>({ projectName: updatesProject.projectName }),
    );

    await expect(controller.update(1, updatesProject)).resolves.toBeDefined();
  });
});
