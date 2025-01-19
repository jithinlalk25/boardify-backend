import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { AdminService } from '../admin/admin.service';
import { AdminSigninDto } from './dto/admin-signin.dto';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private adminService: AdminService,
  ) {}

  async adminSignin(adminSigninDto: AdminSigninDto) {
    const admin = await this.adminService.findByEmail(adminSigninDto.email);
    if (!admin) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = adminSigninDto.password === admin.password;

    // await bcrypt.compare(
    //   adminSigninDto.password,
    //   admin.password,
    // );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { adminId: admin._id };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
