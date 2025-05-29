export interface UserSessionDTO {
  id: number;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
  refreshToken: string;
  userAgent?: string | null;
  ipAddress?: string | null;
  user: {
    uuid: string;
    username: string;
    email: string;
    createdAt: string;
  };
}
