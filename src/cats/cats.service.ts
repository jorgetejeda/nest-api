import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateCatDto } from './dto/create-cat.dto';
import { UpdateCatDto } from './dto/update-cat.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Cat } from './entities/cat.entity';
import { Repository } from 'typeorm';
import { Breed } from 'src/breeds/entities/breed.entity';
import { IUserActive } from 'src/common/interfaces/user-active.interfaces';
import { Role } from 'src/common/enums/rol.enum';

@Injectable()
export class CatsService {
  constructor(
    @InjectRepository(Cat)
    private catsRepository: Repository<Cat>,
    @InjectRepository(Breed)
    private breedsRepository: Repository<Breed>,
  ) {}

  async create(createCatDto: CreateCatDto, user: IUserActive) {
    const breed = await this.validateBreed(createCatDto.breed);
    if (!breed) {
      throw new BadRequestException('Breed not found');
    }
    return await this.catsRepository.save({
      ...createCatDto,
      breed,
      userEmail: user.email,
    });
  }

  findAll(user: IUserActive) {
    return user.role === Role.ADMIN
      ? this.catsRepository.find()
      : this.catsRepository.find({ where: { userEmail: user.email } });
  }

  async findOne(id: number, user: IUserActive) {
    if (!id) {
      throw new BadRequestException('Id is required');
    }

    const cat = await this.catsRepository.findOneBy({ id });

    if (!cat) {
      throw new BadRequestException('Cat not found');
    }

    this.validateOwnership(cat, user);

    return this.catsRepository.findOneBy({ id });
  }

  async update(id: number, updateCatDto: UpdateCatDto, user: IUserActive) {
    const cat = await this.catsRepository.findOneBy({ id });
    await this.validateOwnership(cat, user);

    return await this.catsRepository.update(id, {
      ...updateCatDto,
      breed: updateCatDto.breed
        ? await this.validateBreed(updateCatDto.breed)
        : undefined,
      userEmail: user.email,
    });
  }

  remove(id: number) {
    return this.catsRepository.softDelete(id);
  }

  private validateOwnership(cat: Cat, user: IUserActive) {
    if (user.role !== Role.ADMIN && cat.userEmail !== user.email) {
      throw new UnauthorizedException();
    }
  }

  private validateBreed(breed: string) {
    const breedEntity = this.breedsRepository.findOneBy({
      name: breed,
    });

    if (!breedEntity) {
      throw new BadRequestException('Breed not found');
    }

    return breedEntity;
  }
}
