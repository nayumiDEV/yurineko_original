export interface JwtPayload {
  id: number;
  role: string;
  name: string;
  avatar: string;
  isBanned: boolean;
  premiumTime: Date;
  teamId: number;
}
