import { AxiosInstance } from 'axios';

export class ApiError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

export abstract class BaseApiService {
  constructor(protected readonly api: AxiosInstance) {}

  protected handleError(error: unknown): never {
    if (error instanceof Error) {
      throw new ApiError(error.message);
    }
    throw new ApiError('An unknown error occurred');
  }
} 