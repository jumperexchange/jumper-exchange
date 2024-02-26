import { Global, Module } from '@nestjs/common';
import { ClientProxyProvider } from './clientProxyProvider';
import { CLIENT_PROXY } from '../constants';

@Global()
@Module({
  providers: [ClientProxyProvider],
  exports: [CLIENT_PROXY],
})
export class ClientProxyModule {}
