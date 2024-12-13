import { AxiosInstance } from 'axios';
import { User, PaginatedResponse } from '../types';
import { IUserService } from './interfaces/IUserService';
import { BaseApiService } from './BaseApiService';


export const MOCK_USERS: User[] = [
  // Admin users
  { id: 1, username: "admin", email: "admin@example.com", role: "Admin" },
  { id: 2, username: "admin2", email: "admin2@example.com", role: "Admin" },
  
  // Editor users
  { id: 3, username: "editor", email: "editor@example.com", role: "Editor" },
  { id: 4, username: "editor2", email: "editor2@example.com", role: "Editor" },
  { id: 5, username: "editor3", email: "editor3@example.com", role: "Editor" },
  { id: 6, username: "editor4", email: "editor4@example.com", role: "Editor" },
  { id: 7, username: "editor5", email: "editor5@example.com", role: "Editor" },
  
  // Viewer users
  { id: 8, username: "viewer", email: "viewer@example.com", role: "Viewer" },
  { id: 9, username: "viewer2", email: "viewer2@example.com", role: "Viewer" },
  { id: 10, username: "viewer3", email: "viewer3@example.com", role: "Viewer" },
  { id: 11, username: "viewer4", email: "viewer4@example.com", role: "Viewer" },
  { id: 12, username: "viewer5", email: "viewer5@example.com", role: "Viewer" },
  { id: 13, username: "viewer6", email: "viewer6@example.com", role: "Viewer" },
  { id: 14, username: "viewer7", email: "viewer7@example.com", role: "Viewer" },
  { id: 15, username: "viewer8", email: "viewer8@example.com", role: "Viewer" },
  
  // More editors
  { id: 16, username: "editor6", email: "editor6@example.com", role: "Editor" },
  { id: 17, username: "editor7", email: "editor7@example.com", role: "Editor" },
  { id: 18, username: "editor8", email: "editor8@example.com", role: "Editor" },
  { id: 19, username: "editor9", email: "editor9@example.com", role: "Editor" },
  { id: 20, username: "editor10", email: "editor10@example.com", role: "Editor" },
  
  // More viewers
  { id: 21, username: "viewer9", email: "viewer9@example.com", role: "Viewer" },
  { id: 22, username: "viewer10", email: "viewer10@example.com", role: "Viewer" },
  { id: 23, username: "viewer11", email: "viewer11@example.com", role: "Viewer" },
  { id: 24, username: "viewer12", email: "viewer12@example.com", role: "Viewer" },
  { id: 25, username: "viewer13", email: "viewer13@example.com", role: "Viewer" },
  
  // Additional users
  { id: 26, username: "admin3", email: "admin3@example.com", role: "Admin" },
  { id: 27, username: "editor11", email: "editor11@example.com", role: "Editor" },
  { id: 28, username: "viewer14", email: "viewer14@example.com", role: "Viewer" },
  { id: 29, username: "editor12", email: "editor12@example.com", role: "Editor" },
  { id: 30, username: "viewer15", email: "viewer15@example.com", role: "Viewer" },
  
  // More users to reach 50
  { id: 31, username: "viewer16", email: "viewer16@example.com", role: "Viewer" },
  { id: 32, username: "editor13", email: "editor13@example.com", role: "Editor" },
  { id: 33, username: "viewer17", email: "viewer17@example.com", role: "Viewer" },
  { id: 34, username: "editor14", email: "editor14@example.com", role: "Editor" },
  { id: 35, username: "viewer18", email: "viewer18@example.com", role: "Viewer" },
  { id: 36, username: "admin4", email: "admin4@example.com", role: "Admin" },
  { id: 37, username: "editor15", email: "editor15@example.com", role: "Editor" },
  { id: 38, username: "viewer19", email: "viewer19@example.com", role: "Viewer" },
  { id: 39, username: "editor16", email: "editor16@example.com", role: "Editor" },
  { id: 40, username: "viewer20", email: "viewer20@example.com", role: "Viewer" },
  { id: 41, username: "admin5", email: "admin5@example.com", role: "Admin" },
  { id: 42, username: "editor17", email: "editor17@example.com", role: "Editor" },
  { id: 43, username: "viewer21", email: "viewer21@example.com", role: "Viewer" },
  { id: 44, username: "editor18", email: "editor18@example.com", role: "Editor" },
  { id: 45, username: "viewer22", email: "viewer22@example.com", role: "Viewer" },
  { id: 46, username: "admin6", email: "admin6@example.com", role: "Admin" },
  { id: 47, username: "editor19", email: "editor19@example.com", role: "Editor" },
  { id: 48, username: "viewer23", email: "viewer23@example.com", role: "Viewer" },
  { id: 49, username: "editor20", email: "editor20@example.com", role: "Editor" },
  { id: 50, username: "viewer24", email: "viewer24@example.com", role: "Viewer" }
];

export class UserService extends BaseApiService implements IUserService {
  constructor(api: AxiosInstance) {
    super(api);
  }

  async getUsers(
    page: number,
    role?: string,
    pageSize: number = 5
  ): Promise<PaginatedResponse<User>> {
    try {
   
      // GET /api/users?page={page}&role={role}&pageSize={pageSize}
      // Response: { data: User[], total: number, page: number, pageSize: number }
      // const response = await this.api.get<PaginatedResponse<User>>(`/users`, {
      //   params: { page, role, pageSize }
      // });
      // return response.data;

   
      const filteredUsers = role
        ? MOCK_USERS.filter(user => user.role === role)
        : MOCK_USERS;

      const start = page * pageSize;
      const paginatedUsers = filteredUsers.slice(start, start + pageSize);

      return {
        data: paginatedUsers,
        total: filteredUsers.length,
        page,
        pageSize
      };
    } catch (error) {
      this.handleError(error);
    }
  }

  async createUser(userData: Partial<User>): Promise<User> {
    try {
    
      // POST /api/users
      // Request body: { username: string, email: string, role: string }
      // Response: User
      const response = await this.api.post<User>('/users', userData);
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  async updateUser(id: number, userData: Partial<User>): Promise<User> {
    try {
     
      // PUT /api/users/:id
      // Request body: { username?: string, email?: string, role?: string }
      // Response: User
      const response = await this.api.put<User>(`/users/${id}`, userData);
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }
}
