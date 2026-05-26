import { BASE_URL } from './index';

// 쿠키 기반 인증으로 변경 — 실제 토큰은 ACCESS_TOKEN 쿠키에 저장됨
// localStorage는 로그인 상태 플래그만 보관
const SESSION_KEY = 'aissue_logged_in';

export const tokenStorage = {
  getAccess: () => localStorage.getItem(SESSION_KEY),
  set: () => localStorage.setItem(SESSION_KEY, '1'),
  clear: () => localStorage.removeItem(SESSION_KEY),
};

export class ApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

async function request<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  const res = await fetch(`${BASE_URL}${path}`, { ...options, headers, credentials: 'include' });

  if (res.status === 401) {
    if (!path.startsWith('/api/auths/')) {
      try {
        const refreshRes = await fetch(`${BASE_URL}/api/auths/refresh`, {
          method: 'POST',
          credentials: 'include',
        });

        if (refreshRes.ok) {
          // 새 ACCESS_TOKEN 쿠키가 브라우저에 자동 설정됨 → 바로 재시도
          const retryRes = await fetch(`${BASE_URL}${path}`, {
            ...options,
            headers,
            credentials: 'include',
          });

          if (!retryRes.ok) {
            const errBody = await retryRes.json().catch(() => ({}));
            throw new ApiError(retryRes.status, errBody.message ?? `요청 실패 (${retryRes.status})`);
          }
          if (retryRes.status === 204) return undefined as T;
          return retryRes.json() as Promise<T>;
        }
      } catch (e) {
        if (e instanceof ApiError) throw e;
      }
    }
    tokenStorage.clear();
    window.location.href = '/login';
    throw new ApiError(401, '인증이 만료되었습니다.');
  }

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new ApiError(res.status, body.message ?? `요청 실패 (${res.status})`);
  }

  if (res.status === 204) return undefined as T;

  return res.json() as Promise<T>;
}

export const http = {
  get: <T>(path: string) =>
    request<T>(path, { method: 'GET' }),

  post: <T>(path: string, body?: unknown) =>
    request<T>(path, { method: 'POST', body: JSON.stringify(body) }),

  patch: <T>(path: string, body?: unknown) =>
    request<T>(path, { method: 'PATCH', body: JSON.stringify(body) }),

  delete: <T>(path: string) =>
    request<T>(path, { method: 'DELETE' }),
};
