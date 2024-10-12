import {
  Entity,
  Column,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  PrimaryColumn,
} from 'typeorm';
import { Exclude } from 'class-transformer';

import { User } from 'src/user/entities/user.entity';
import { Project } from 'src/project/entities/project.entity';


@Entity()
export class Draw {
  @PrimaryColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  value: string;

  @Column({ type: 'integer', default: 1 })
  private: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => User, { nullable: false, onDelete: 'RESTRICT' })
  @JoinColumn()
  @Exclude()
  user: User | number;

  @ManyToOne(() => Project, { nullable: false, onDelete: 'RESTRICT' })
  @JoinColumn()
  @Exclude()
  project: Project | number;
}
