import { Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AliasUserDto } from '@jumper-commons/commons/domain/auth';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('identify')
  async identifyUser(): Promise<string> {
    const userId = await this.authService.identifyUser();

    return userId;
  }

  @Post('alias')
  async aliasUser(aliasUserDto: AliasUserDto): Promise<void> {
    await this.authService.aliasUser(aliasUserDto);
  }
}
