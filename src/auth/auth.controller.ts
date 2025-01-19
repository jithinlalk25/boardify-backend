import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AdminSigninDto } from './dto/admin-signin.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('admin/signin')
  async adminSignin(@Body() adminSigninDto: AdminSigninDto) {
    return this.authService.adminSignin(adminSigninDto);
  }
}
