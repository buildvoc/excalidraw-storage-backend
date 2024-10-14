import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { Draw } from './draw.entity';
import { DrawUpsertDto } from './dto/draw-upsert.dto';
import { DrawUpdateDto } from './dto/draw-update.dto';

@Injectable()
export class DrawService {
  constructor(
    @InjectRepository(Draw)
    private readonly drawRepository: Repository<Draw>,
  ) {}

  async upsert(user: User, drawUpsertDto: DrawUpsertDto): Promise<Draw> {

    const data = Object.assign(drawUpsertDto, { user });

    await this.drawRepository.upsert(data, {conflictPaths: ['user', 'project', 'title']});

    return data as Draw;
  }

  async list(user: User): Promise<Draw[]> {
    return await this.drawRepository.find({
      where: { user: { id: user.id } },
      order: { createdAt: 'DESC' },
      loadRelationIds: true,
    });
  }

  async findOne(id: number): Promise<Draw> {
    const draw = await this.drawRepository.findOne({
      where: { id },
      loadRelationIds: true,
    });

    if (!draw) throw new NotFoundException(`There isn't any data with id: ${id}`);

    return draw;
  }

  async update(id: number, updates: DrawUpdateDto): Promise<Draw> {
    const draw = await this.findOne(id);

    this.drawRepository.merge(draw, updates);

    return await this.drawRepository.save(draw);
  }

  async remove(id: number): Promise<Draw> {
    const draw = await this.findOne(id);

    return await this.drawRepository.remove(draw);
  }

}
