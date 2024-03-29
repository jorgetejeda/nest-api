import { Body, Controller, Get, Post, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { Role } from 'src/enums/rol.enum';
import { Auth } from './decorators/auth.decorators';

interface RequestWithUser extends Request {
  user: {
    email: string;
    role: string;
  };
}

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Post('register')
  register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Get('profile')
  // @Roles(Role.ADMIN, Role.USER)
  // @UseGuards(AuthGuard, RolesGuard)
  @Auth(Role.ADMIN, Role.USER)
  profile(@Request() req: RequestWithUser) {
    return req.user;
  }
}
