import { type DataSource } from 'typeorm';
import { Seeder, type SeederFactoryManager } from 'typeorm-extension';

import { User } from 'src/user/entities/user.entity';
import { Project } from '../entities/project.entity';

export class ProjectSeeder implements Seeder {
  public async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager,
  ): Promise<void> {
    const userRepository = dataSource.getRepository(User);
    const projectFactory = factoryManager.get(Project);

    await projectFactory.save({
      id: 1,
      projectName: 'Project 1',
      projectDescription: 'Description of Project 1',
      user: await userRepository.findOneOrFail({ where: { email: 'john@doe.me' } }),
    });
    await projectFactory.save({
      id: 2,
      projectName: 'Project 2',
      projectDescription: 'Description of Project 2',
      user: await userRepository.findOneOrFail({ where: { email: 'jane@doe.me' } }),
    });
  }
}
