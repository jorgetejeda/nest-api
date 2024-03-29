import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateCatDto } from './dto/create-cat.dto';
import { UpdateCatDto } from './dto/update-cat.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Cat } from './entities/cat.entity';
import { Repository } from 'typeorm';
import { Breed } from 'src/breeds/entities/breed.entity';
import { IUserActive } from 'src/common/interfaces/user-active.interfaces';

@Injectable()
export class CatsService {
  constructor(
    @InjectRepository(Cat)
    private catsRepository: Repository<Cat>,
    @InjectRepository(Breed)
    private breedsRepository: Repository<Breed>,
  ) {}

  async create(createCatDto: CreateCatDto, userEmail: string) {
    const breed = await this.breedsRepository.findOneBy({
      name: createCatDto.breed,
    });
    if (!breed) {
      throw new BadRequestException('Breed not found');
    }
    return await this.catsRepository.save({
      ...createCatDto,
      breed,
      userEmail,
    });
  }

  findAll() {
    return this.catsRepository.find();
  }

  findOne(id: number) {
    return this.catsRepository.findOneBy({ id });
  }

  update(id: number, updateCatDto: UpdateCatDto) {
    // return this.catsRepository.update(id, updateCatDto);
  }

  remove(id: number) {
    return this.catsRepository.softDelete(id);
  }
}
