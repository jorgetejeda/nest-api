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
    const breed = await this.breedsRepository.findOneBy({
      name: createCatDto.breed,
    });
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

    if (user.role !== Role.ADMIN && cat.userEmail !== user.email) {
      throw new UnauthorizedException();
    }

    return this.catsRepository.findOneBy({ id });
  }

  update(id: number, updateCatDto: UpdateCatDto) {
    // return this.catsRepository.update(id, updateCatDto);
  }

  remove(id: number) {
    return this.catsRepository.softDelete(id);
  }
}
