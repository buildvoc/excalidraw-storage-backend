import { setSeederFactory } from 'typeorm-extension';

import { Project } from '../entities/project.entity';

export const projectFactory = setSeederFactory(Project, faker => {
  const project = new Project();
  project.projectName = faker.animal.rabbit();
  project.projectDescription = faker.animal.rabbit();
  project.private = 1;

  return project;
});
