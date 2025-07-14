import { AuthRequestUser } from './auth-request-user.interface';

export interface AuthRequest extends Request {
  user: AuthRequestUser;
}
