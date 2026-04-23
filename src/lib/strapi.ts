import * as dotenv from 'dotenv';
dotenv.config();

type StrapiResponse<T> = {
  data: T;
  meta?: any;
} | null;

class StrapiAPI {
  private baseUrl: string;
  private token?: string;

  constructor() {
    this.baseUrl = process.env.PUBLIC_STRAPI_URL || '';
    this.token = process.env.PUBLIC_STRAPI_TOKEN;
  }

  getURL() {
    return this.baseUrl;
  }

  /**
   * Método general para hacer peticiones
   */
  async fetch<T>(
    endpoint: string,
    options: {
      method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
      params?: Record<string, string | number>;
      body?: any;
    } = {}
  ): Promise<StrapiResponse<T>> {
    const { method = 'GET', params, body } = options;

    // Construir URL con parámetros
    let url = `${this.baseUrl}/api${endpoint}`;
    
    if (params) {
      const queryParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        queryParams.append(key, String(value));
      });
      url += `?${queryParams.toString()}`;
    }

    // Configurar headers
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    try {
      const response = await fetch(url, {
        method,
        headers,
        body: body ? JSON.stringify({ data: body }) : undefined,
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching from Strapi:', error);
      return null;
    }
  }

  /**
   * Métodos helpers para operaciones comunes
   */
  async get<T>(
    endpoint: string,
    params?: Record<string, string | number>
  ): Promise<StrapiResponse<T>> {
    return this.fetch<T>(endpoint, { method: 'GET', params });
  }

  async post<T>(
    endpoint: string,
    data: any
  ): Promise<StrapiResponse<T>> {
    return this.fetch<T>(endpoint, { method: 'POST', body: data });
  }

  async put<T>(
    endpoint: string,
    data: any
  ): Promise<StrapiResponse<T>> {
    return this.fetch<T>(endpoint, { method: 'PUT', body: data });
  }

  async delete<T>(
    endpoint: string
  ): Promise<StrapiResponse<T>> {
    return this.fetch<T>(endpoint, { method: 'DELETE' });
  }
}

// Exportar una sola instancia
export const strapi = new StrapiAPI();
export const url_API = strapi.getURL();