import { Test, TestingModule } from '@nestjs/testing';
import { UserPreferenceController } from './user-preference.controller';

describe('UserPreferenceController', () => {
  let controller: UserPreferenceController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserPreferenceController],
    }).compile();

    controller = module.get<UserPreferenceController>(UserPreferenceController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
