// AUTH-SERVICE (Gateway → :8081)
import { BASE_URL } from './index';
import { http, tokenStorage, ApiError } from './client';
import type { LoginRequest, SignupRequest } from '../types/api';

export const authService = {
  login: async (body: LoginRequest): Promise<void> => {
    const res = await fetch(`${BASE_URL}/api/auths/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      credentials: 'include',
    });

    if (!res.ok) {
      const errBody = await res.json().catch(() => ({}));
      throw new ApiError(res.status, errBody.message ?? '아이디 또는 비밀번호가 올바르지 않습니다.');
    }

    tokenStorage.set(); // ACCESS_TOKEN 쿠키는 브라우저가 자동 저장, 플래그만 기록
  },

  signup: async (body: SignupRequest): Promise<void> => {
    const res = await fetch(`${BASE_URL}/api/users/sign-up`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      credentials: 'include',
    });

    if (!res.ok) {
      const errBody = await res.json().catch(() => ({}));
      throw new ApiError(res.status, errBody.message ?? '회원가입에 실패했습니다.');
    }
  },

  testLogin: async (): Promise<void> => {
    const res = await fetch(`${BASE_URL}/api/auths/test-login`, {
      method: 'POST',
      credentials: 'include',
    });

    if (!res.ok) {
      const errBody = await res.json().catch(() => ({}));
      throw new ApiError(res.status, errBody.message ?? '테스트 로그인에 실패했습니다.');
    }

    tokenStorage.set();
  },

  logout: async (): Promise<void> => {
    await http.post('/api/auths/logout').catch(() => {});
    tokenStorage.clear();
  },
};
