import { BadRequestException, Injectable } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { RegisterDto } from './dto/register.dto';
import * as bcryptjs from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService) {}
  login() {
    return 'This login';
  }

  async register(registerDto: RegisterDto) {
    const user = await this.userService.findOneByEmail(registerDto.email);
    if (user) {
      throw new BadRequestException('User already exists');
    }
    const { password, ...result } = registerDto;
    return await this.userService.create({
      ...result,
      password: await bcryptjs.hash(password, 10),
    });
  }
}
