import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AliasUserDto } from '@jumper-commons/commons/domain/auth';

describe('AuthController', () => {
  let controller: AuthController;
  let authServiceMock: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            identifyUser: jest.fn(),
            aliasUser: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authServiceMock = module.get<AuthService>(AuthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('identifyUser', () => {
    it('should call authService.identifyUser and return the result', async () => {
      const userId = 'user123';
      jest.spyOn(authServiceMock, 'identifyUser').mockResolvedValue(userId);

      const result = await controller.identifyUser({
        userAgentInfo: {},
      });

      expect(authServiceMock.identifyUser).toHaveBeenCalledWith({
        userAgentInfo: {},
      });
      expect(result).toEqual(userId);
    });
  });

  describe('aliasUser', () => {
    it('should call authService.aliasUser with the correct data', async () => {
      const aliasUserDto: AliasUserDto = {
        identityId: 'identityId_1',
        newAccountId: 'newAccountId_1',
      };

      await controller.aliasUser(aliasUserDto);

      expect(authServiceMock.aliasUser).toHaveBeenCalledWith(aliasUserDto);
    });
  });
});
