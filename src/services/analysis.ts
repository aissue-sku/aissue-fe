// CONTENT-COLLECTION-SERVICE (Gateway → :8083)
import { http } from './client';
import type {
  ApiResponse,
  AnalysisRequest,
  AnalysisResponse,
  CritiqueResponse,
  ContentAnalysisResponse,
} from '../types/api';

export const analysisService = {
  analyze: (body: AnalysisRequest): Promise<AnalysisResponse> =>
    http.post('/content/analysis', body),

  getById: (id: string): Promise<AnalysisResponse> =>
    http.get(`/content/analysis/${id}`),

  getCritique: (id: string): Promise<CritiqueResponse> =>
    http
      .get<ApiResponse<CritiqueResponse>>(`/api/contents/${id}/critique`)
      .then((res) => res.data),

  getContentAnalysis: (id: string): Promise<ContentAnalysisResponse> =>
    http
      .get<ApiResponse<ContentAnalysisResponse>>(`/api/contents/${id}/analysis`)
      .then((res) => res.data),

  submitContent: (type: 'URL' | 'TEXT', content: string): Promise<ContentAnalysisResponse> =>
    http
      .post<ApiResponse<ContentAnalysisResponse>>('/api/contents/submit', { type, content })
      .then((res) => res.data),
};
