import api from '../api/axios';
import { LoginCredentials, AuthTokens, User } from '../types';

export class AuthService {
  private static readonly TOKEN_NAME = 'accessToken';
  private static readonly REFRESH_TOKEN_NAME = 'refreshToken';

  static isAuthenticated(): boolean {
    const token = this.getAccessToken();
    if (!token) return false;

    try {

      const [, , role] = token.split('-');
      return ['Admin', 'Editor', 'Viewer'].includes(role);
    } catch {
      return false;
    }
  }

  static getAccessToken(): string | null {
    return TokenStorage.getToken();
  }

  static async validateToken(): Promise<boolean> {
    const token = this.getAccessToken();
    if (!token) return false;

    try {

      return true;
    } catch {
      this.logout();
      return false;
    }
  }

  static async login(credentials: LoginCredentials): Promise<void> {
    try {
   
      // POST /api/login
      // Request body: { username: string, password: string }
      // Response: { accessToken: string, refreshToken: string }
      // const response = await api.post<AuthTokens>('/login', credentials);
      // const { accessToken, refreshToken } = response.data;

      
      const mockUser = this.checkMockCredentials(credentials);
      if (!mockUser) {
        throw new Error('Invalid credentials');
      }

      const mockTokens = {
        accessToken: `mock-token-${mockUser.role}`,
        refreshToken: 'mock-refresh-token'
      };

      this.setAccessToken(mockTokens.accessToken);
      document.cookie = `${this.REFRESH_TOKEN_NAME}=${mockTokens.refreshToken}; path=/; secure; httponly`;
    } catch (error) {
      throw new Error('Invalid credentials');
    }
  }

  private static checkMockCredentials(credentials: LoginCredentials) {
    const mockUsers = [
      { username: "admin", password: "admin123", role: "Admin" },
      { username: "editor", password: "editor123", role: "Editor" },
      { username: "viewer", password: "viewer123", role: "Viewer" }
    ];

    return mockUsers.find(
      u => u.username === credentials.username && u.password === credentials.password
    );
  }

  static async logout(): Promise<void> {
    TokenStorage.clearToken();
    document.cookie = `${this.REFRESH_TOKEN_NAME}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
  }

  static setAccessToken(token: string): void {
    TokenStorage.setToken(token);
  }

  static getMockUser(credentials: { username: string }): User {
    const mockUsers = [
      { username: "admin", role: "Admin" },
      { username: "editor", role: "Editor" },
      { username: "viewer", role: "Viewer" }
    ];

    const user = mockUsers.find(u => u.username === credentials.username);
    if (!user) {
      throw new Error('User not found');
    }

    return {
      username: user.username,
      role: user.role as 'Admin' | 'Editor' | 'Viewer'
    };
  }
}

class TokenStorage {
  private static readonly TOKEN_KEY = 'auth_token';

  static setToken(token: string | null): void {
    if (token) {
      localStorage.setItem(this.TOKEN_KEY, token);
    } else {
      localStorage.removeItem(this.TOKEN_KEY);
    }
    (window as any).__token = token;
  }
  
  static getToken(): string | null {
    const memoryToken = (window as any).__token;
    if (memoryToken) return memoryToken;

    const token = localStorage.getItem(this.TOKEN_KEY);
    if (token) {
      (window as any).__token = token;
    }
    return token;
  }

  static clearToken(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    (window as any).__token = null;
  }
} 