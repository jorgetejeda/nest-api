import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Breed } from './entities/breed.entity';
import { CreateBreedDto } from './dto/create-breed.dto';

@Injectable()
export class BreedsService {
  constructor(
    @InjectRepository(Breed)
    private breedsRepository: Repository<Breed>,
  ) {}

  create(createBreedDto: CreateBreedDto) {
    const breed = this.breedsRepository.create(createBreedDto);
    return this.breedsRepository.save(breed);
  }

  findAll() {
    return this.breedsRepository.find();
  }
}
