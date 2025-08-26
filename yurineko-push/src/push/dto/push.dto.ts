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
