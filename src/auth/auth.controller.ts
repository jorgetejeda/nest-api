import { Body, Controller, Get, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { Role } from '../common/enums/rol.enum';
import { Auth } from './decorators/auth.decorators';
import { ActiveUser } from '../common/decorators/active-user.decorators';
import { IUserActive } from '../common/interfaces/user-active.interfaces';
import { ApiBearerAuth, ApiExtraModels, ApiTags } from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiExtraModels(LoginDto)
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Post('register')
  @ApiExtraModels(RegisterDto)
  register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Get('profile')
  // @Roles(Role.ADMIN, Role.USER)
  // @UseGuards(AuthGuard, RolesGuard)
  @ApiBearerAuth()
  @Auth(Role.ADMIN, Role.USER)
  profile(@ActiveUser() user: IUserActive) {
    return user;
  }
}
