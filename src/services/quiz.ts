import { http } from './client';
import type { ApiResponse, DailyQuizResponse, DailyQuizAnswerResponse } from '../types/api';

export const quizService = {
  getDailyQuiz: (): Promise<DailyQuizResponse> =>
    http
      .get<ApiResponse<DailyQuizResponse>>('/api/quiz/daily')
      .then((res) => res.data),

  submitAnswer: (selectedIndex: number): Promise<DailyQuizAnswerResponse> =>
    http
      .post<ApiResponse<DailyQuizAnswerResponse>>('/api/quiz/daily/answer', { selectedIndex })
      .then((res) => res.data),
};
