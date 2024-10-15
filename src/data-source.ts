import * as dotenv from 'dotenv';
import { DataSource, type DataSourceOptions } from 'typeorm';
import { type SeederOptions } from 'typeorm-extension';

import { CreateUser1557166726050 } from './migrations/1557166726050-CreateUser';
import { CreateProfile1570141220019 } from './migrations/1570141220019-CreateProfile';
import { CreateSessionStorage1584985637890 } from './migrations/1584985637890-CreateSessionStorage';
import { ModifyUser1597166726050 } from './migrations/1597166726050-ModifyUser';
import { Profile } from './user/entities/profile.entity';
import { User } from './user/entities/user.entity';
import { profileFactory } from './user/factories/profile.factory';
import { userFactory } from './user/factories/user.factory';
import { ProfileSeeder } from './user/seeders/profile.seeder';
import { UserSeeder } from './user/seeders/user.seeder';
import { CreateProject1728548094000 } from './migrations/1728548094000-CreateProject';
import { projectFactory } from './project/factories/project.factory';
import { ProjectSeeder } from './project/seeders/project.seeder';
import { CreateDraw1728548094000 } from './migrations/1728548094001-CreateDraw';
import { Project } from './project/entities/project.entity';
import { Draw } from './draw/draw.entity';

dotenv.config();

export const dataSourceOptions: DataSourceOptions & SeederOptions = {
  type: 'postgres',
  url: process.env.DATABASE_URL,
  entities: [User, Profile, Project, Draw],
  migrations: [
    CreateUser1557166726050,
    CreateProfile1570141220019,
    CreateSessionStorage1584985637890,
    ModifyUser1597166726050,
    CreateProject1728548094000,
    CreateDraw1728548094000,
  ],
  synchronize: false,
  extra: {
    ssl:
      process.env.SSL_MODE === 'require'
        ? {
            rejectUnauthorized: false,
          }
        : false,
  },
  factories: [userFactory, profileFactory, projectFactory],
  seeds: [UserSeeder, ProfileSeeder, ProjectSeeder],
};

export const appDataSource = new DataSource(dataSourceOptions);