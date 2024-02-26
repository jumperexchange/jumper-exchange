import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class AuthService {
  async identifyUser(): Promise<string> {
    // Currently this method just returns new uuid.
    // There are numerous options which could be used to track user
    // 1. fingerprinting
    // 2. etag
    // 3. cookie
    return uuidv4();
  }
}
