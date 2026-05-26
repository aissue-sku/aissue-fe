import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService, tokenStorage } from '../services';
import type { LoginRequest, SignupRequest } from '../types/api';

export const useAuth = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = async (body: LoginRequest) => {
    setLoading(true);
    setError(null);
    try {
      await authService.login(body);
      navigate('/home');
    } catch (e) {
      setError(e instanceof Error ? e.message : '로그인에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const signup = async (body: SignupRequest) => {
    setLoading(true);
    setError(null);
    try {
      await authService.signup(body);
      navigate('/login');
    } catch (e) {
      setError(e instanceof Error ? e.message : '회원가입에 실패했습니다.');
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

  return { login, signup, testLogin, logout, isLoggedIn, loading, error };
};
