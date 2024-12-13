import { User, PaginatedResponse, LoginCredentials } from '../../types';

export interface IUserService {
  getUsers(page: number, role?: string, pageSize?: number): Promise<PaginatedResponse<User>>;
  createUser(userData: Partial<User>): Promise<User>;
  updateUser(id: number, userData: Partial<User>): Promise<User>;
}

export interface IAuthService {
  login(credentials: LoginCredentials): Promise<void>;
  logout(): Promise<void>;
  isAuthenticated(): boolean;
} 