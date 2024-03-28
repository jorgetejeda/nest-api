import { Controller } from '@nestjs/common';
import { BreedsService } from './breeds.service';

@Controller('breeds')
export class BreedsController {
  constructor(private readonly breedsService: BreedsService) {}
}
