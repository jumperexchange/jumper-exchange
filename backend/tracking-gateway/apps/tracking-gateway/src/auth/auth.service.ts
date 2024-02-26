import { Inject, Injectable } from '@nestjs/common';
import { CLIENT_PROXY } from '../constants';
import { ClientProxy } from '@nestjs/microservices/client/client-proxy';
import { Events } from '@jumper-commons/commons/domain/events';
import { firstValueFrom } from 'rxjs';
import { AliasUserDto } from '@jumper-commons/commons/domain/auth';

@Injectable()
export class AuthService {
  constructor(
    @Inject(CLIENT_PROXY) private readonly transportClient: ClientProxy,
  ) {}

  async identifyUser(): Promise<string> {
    return firstValueFrom(this.transportClient.send(Events.IdentifyUser, {}));
  }

  async aliasUser(aliasUserDto: AliasUserDto): Promise<string> {
    return firstValueFrom(
      this.transportClient.send(Events.AliasUser, aliasUserDto),
    );
  }
}
