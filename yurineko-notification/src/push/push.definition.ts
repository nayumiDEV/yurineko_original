export class PushPayloadData {
  title: string;
  body: string;
  url: string;
  thumbnail: string;
}

export class PushPayload {
  mUserId: number;
  data: PushPayloadData;
}

export const PUSH_NOTIFICATION_SERVICE = 'PUSH_NOTIFICATION_SERVICE';
