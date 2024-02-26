import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AuthConfigModule } from './config/service';

@Module({
  imports: [AuthConfigModule],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
