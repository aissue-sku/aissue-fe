import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService, tokenStorage } from '../services';
import type { LoginRequest, SignupRequest } from '../types/api';

type FieldErrors = Record<string, string>;

const parseFieldErrors = (message: string): FieldErrors | null => {
  if (!message.includes('[')) return null;
  const grouped: Record<string, string[]> = {};
  for (const part of message.split(' / ')) {
    const match = part.match(/^\[(\w+)\]\s+(.+)$/);
    if (match) {
      const [, field, msg] = match;
      if (!grouped[field]) grouped[field] = [];
      grouped[field].push(msg.trim());
    }
  }
  if (Object.keys(grouped).length === 0) return null;
  const result: FieldErrors = {};
  for (const [field, msgs] of Object.entries(grouped)) {
    const specific = msgs.filter((m) => !m.includes('필수'));
    result[field] = (specific.length > 0 ? specific[0] : msgs[0]);
  }
  return result;
};

export const useAuth = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors | null>(null);

  const setErrors = (msg: string) => {
    const parsed = parseFieldErrors(msg);
    if (parsed) {
      setFieldErrors(parsed);
      setError(null);
    } else {
      setError(msg);
      setFieldErrors(null);
    }
  };

  const login = async (body: LoginRequest) => {
    setLoading(true);
    setError(null);
    setFieldErrors(null);
    try {
      await authService.login(body);
      navigate('/home');
    } catch (e) {
      setErrors(e instanceof Error ? e.message : '로그인에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const signup = async (body: SignupRequest) => {
    setLoading(true);
    setError(null);
    setFieldErrors(null);
    try {
      await authService.signup(body);
      navigate('/login');
    } catch (e) {
      setErrors(e instanceof Error ? e.message : '회원가입에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const testLogin = async () => {
    setLoading(true);
    setError(null);
    try {
      await authService.testLogin();
      navigate('/home');
    } catch (e) {
      setError(e instanceof Error ? e.message : '테스트 로그인에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    await authService.logout();
    navigate('/login');
  };

  const isLoggedIn = () => !!tokenStorage.getAccess();

  return { login, signup, testLogin, logout, isLoggedIn, loading, error, fieldErrors };
};
