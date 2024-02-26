import { Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('identify')
  async createEvent(): Promise<string> {
    const userId = await this.authService.identifyUser();

    return userId;
  }
}
