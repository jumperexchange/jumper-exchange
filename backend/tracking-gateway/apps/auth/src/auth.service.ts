import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { IdentifyUserDto } from '@jumper-commons/commons/domain/auth/identifyUserDto';
import { AliasUserDto } from '@jumper-commons/commons/domain/auth/aliasUserDto';

@Injectable()
export class AuthService {
  async identifyUser(identifyUserDto: IdentifyUserDto): Promise<string> {
    // Currently this method just returns new uuid.
    // There are numerous options which could be used to track user
    // 1. fingerprinting
    // 2. etag
    // 3. cookie
    return uuidv4();
  }

  async aliasUser(aliasUserDto: AliasUserDto): Promise<void> {
    // alias old and new user identities
    return;
  }
}
