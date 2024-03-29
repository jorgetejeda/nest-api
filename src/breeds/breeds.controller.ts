import { Body, Controller, Get, Post } from '@nestjs/common';
import { BreedsService } from './breeds.service';
import { CreateBreedDto } from './dto/create-breed.dto';
import { Auth } from 'src/auth/decorators/auth.decorators';
import { Role } from 'src/common/enums/rol.enum';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('breeds')
@Auth(Role.ADMIN)
@Controller('breeds')
export class BreedsController {
  constructor(private readonly breedsService: BreedsService) {}

  @Get()
  findAll() {
    return this.breedsService.findAll();
  }

  @Post()
  create(@Body() createBreedDto: CreateBreedDto) {
    return this.breedsService.create(createBreedDto);
  }
}
