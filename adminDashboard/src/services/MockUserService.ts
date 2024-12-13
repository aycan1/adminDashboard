import { User, PaginatedResponse } from '../types';
import { IUserService } from './interfaces/IUserService';
import { MOCK_USERS } from './UserService';

export class MockUserService implements IUserService {
  async getUsers(
    page: number,
    role?: string,
    pageSize: number = 10
  ): Promise<PaginatedResponse<User>> {
    return {
      data: MOCK_USERS,
      total: MOCK_USERS.length,
      page,
      pageSize
    };
  }

  async createUser(userData: Partial<User>): Promise<User> {
    throw new Error('Method not implemented.');
  }

  async updateUser(id: number, userData: Partial<User>): Promise<User> {
    throw new Error('Method not implemented.');
  }
} 