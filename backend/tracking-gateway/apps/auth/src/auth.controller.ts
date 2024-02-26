import { Controller, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { MessagePattern, Payload } from '@nestjs/microservices';

import { AuthEvents } from '@jumper-commons/commons/domain/events';
import {
  IdentifyUserDto,
  AliasUserDto,
} from '@jumper-commons/commons/domain/auth';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @MessagePattern(AuthEvents.IdentifyUser)
  identifyUser(@Payload() identifyUserDto: IdentifyUserDto) {
    return this.authService.identifyUser(identifyUserDto);
  }

  @MessagePattern(AuthEvents.AliasUser)
  aliasUser(@Payload(ValidationPipe) aliasUserDto: AliasUserDto) {
    return this.authService.aliasUser(aliasUserDto);
  }
}
