import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinTable,
} from 'typeorm';
import { Exclude } from 'class-transformer';

import { User } from 'src/user/entities/user.entity';
import { Draw } from 'src/draw/draw.entity';


@Entity()
export class Project {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  projectName: string;

  @Column({ nullable: true })
  projectDescription: string;

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

  @OneToMany(() => Draw, (draw) => draw.project, {eager: true,})
  @JoinTable()
  draws: Draw[]

}
