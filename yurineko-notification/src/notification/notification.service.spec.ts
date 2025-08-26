import { Test, TestingModule } from '@nestjs/testing';
import { NotificationIcon, NotificationType } from './dto';
import { NotificationService } from './notification.service';

describe('NotificationService', () => {
  let service: NotificationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [NotificationService],
    }).compile();

    service = module.get<NotificationService>(NotificationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createNotificationStacking', () => {
    it('should be defined', async () => {
      expect(
        await service.createNotificationStacking({
          receiptentId: [1, 2, 3, 4],
          mTitle: 'test',
          mBody: 'test',
          mType: NotificationType.COMMENT_REACTION,
          mUrl: 'test',
          mIcon: NotificationIcon.REACTION_ANGRY,
          mImage: 'test',
          mObjectId: 1,
        }),
      ).toBeCalled();
    });
  });
});
