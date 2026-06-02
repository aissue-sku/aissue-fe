// AI-SERVICE (Gateway → /api/analysis/**)
import { http } from './client';
import type {
  ApiResponse,
  AnalysisRequest,
  AnalysisResponse,
  CritiqueResponse,
  ContentAnalysisResponse,
  AnalysisHistoryItem,
} from '../types/api';

export const analysisService = {
  analyze: (body: AnalysisRequest): Promise<AnalysisResponse> =>
    http.post('/content/analysis', body),

  getById: (id: string): Promise<AnalysisResponse> =>
    http.get(`/content/analysis/${id}`),

  getCritique: (id: string): Promise<CritiqueResponse> =>
    http
      .get<ApiResponse<CritiqueResponse>>(`/api/analysis/content/${id}/critique`)
      .then((res) => res.data),

  getContentAnalysis: (id: string): Promise<ContentAnalysisResponse> =>
    http
      .get<ApiResponse<ContentAnalysisResponse>>(`/api/analysis/content/${id}/score`)
      .then((res) => res.data),

  submitContent: (type: 'URL' | 'TEXT', content: string): Promise<ContentAnalysisResponse> =>
    http
      .post<ApiResponse<ContentAnalysisResponse>>('/api/analysis/submit', { type, content })
      .then((res) => res.data),

  getHistory: (): Promise<AnalysisHistoryItem[]> =>
    http
      .get<ApiResponse<AnalysisHistoryItem[]>>('/api/analysis/history')
      .then((res) => res.data),

};
