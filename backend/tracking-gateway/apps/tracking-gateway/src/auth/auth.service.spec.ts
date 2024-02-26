import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { ClientProxy } from '@nestjs/microservices/client/client-proxy';
import { Events } from '@jumper-commons/commons/domain/events';
import { AliasUserDto } from '@jumper-commons/commons/domain/auth';
import { CLIENT_PROXY } from '../constants';
import { of } from 'rxjs';

describe('AuthService', () => {
  let service: AuthService;
  let transportClientMock: ClientProxy;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: CLIENT_PROXY,
          useValue: {
            send: jest.fn().mockReturnValue(Promise.resolve('')),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    transportClientMock = module.get<ClientProxy>(CLIENT_PROXY);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('identifyUser', () => {
    it('should call transportClient.send with correct event', async () => {
      jest.spyOn(transportClientMock, 'send').mockReturnValueOnce(of({}));

      await service.identifyUser();
      expect(transportClientMock.send).toHaveBeenCalledWith(
        Events.IdentifyUser,
        {},
      );
    });

    it('should return the result of transportClient.send', async () => {
      const expectedResult = 'user_id';
      jest
        .spyOn(transportClientMock, 'send')
        .mockReturnValueOnce(of(expectedResult));
      const result = await service.identifyUser();
      expect(result).toEqual(expectedResult);
    });
  });

  describe('aliasUser', () => {
    it('should call transportClient.send with correct event and data', async () => {
      const aliasUserDto: AliasUserDto = {
        identityId: 'identityId',
        newAccountId: 'newAccountId',
      };
      jest.spyOn(transportClientMock, 'send').mockReturnValueOnce(of({}));
      await service.aliasUser(aliasUserDto);
      expect(transportClientMock.send).toHaveBeenCalledWith(
        Events.AliasUser,
        aliasUserDto,
      );
    });

    it('should return the result of transportClient.send', async () => {
      const aliasUserDto: AliasUserDto = {
        identityId: 'identityId',
        newAccountId: 'newAccountId',
      };
      const expectedResult = 'result';
      jest
        .spyOn(transportClientMock, 'send')
        .mockReturnValueOnce(of(expectedResult));
      const result = await service.aliasUser(aliasUserDto);
      expect(result).toEqual(expectedResult);
    });
  });
});
