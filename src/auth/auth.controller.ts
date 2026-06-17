import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: any) {
    // Destructure email and password directly from the body object
    const { email, password } = loginDto;
    
    // Pass them as two separate arguments to match your service's signature
    return this.authService.login(email, password);
  }
}