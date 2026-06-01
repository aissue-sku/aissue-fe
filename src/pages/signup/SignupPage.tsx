import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import mascot from "../../assets/mascot.png";
import { useAuth } from "../../hooks/useAuth";

const SignupPage = () => {
  const navigate = useNavigate();
  const { signup, loading, error, fieldErrors } = useAuth();
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [localError, setLocalError] = useState<string | null>(null);

  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLocalError(null);

    if (password !== passwordConfirm) {
      setLocalError("비밀번호가 일치하지 않습니다.");
      return;
    }

    await signup({ username, name, password });
  };

  return (
    <div className="min-h-dvh bg-[#f2f2f7] flex flex-col animate-page-enter">
      {/* 헤더 */}
      <div className="h-14 flex items-center px-5 pt-10">
        <button
          onClick={() => navigate(-1)}
          className="size-6 flex items-center justify-center"
        >
          <ChevronLeft size={24} className="text-[#1a1a1a]" />
        </button>
      </div>

      <div className="flex flex-col items-center px-5 pb-10">
        {/* 마스코트 + 타이틀 */}
        <div className="flex flex-col items-center mb-12">
          <img
            src={mascot}
            alt="아이슈 마스코트"
            className="w-28 h-auto object-contain"
          />
          <span className="text-[24px] font-semibold text-gray-800 mt-2">
            회원가입
          </span>
        </div>

        {/* 회원가입 카드 */}
        <div className="w-full max-w-sm bg-white rounded-2xl shadow-sm px-6 py-8 -mt-6">
          <form onSubmit={handleSignup} className="flex flex-col gap-5">
            {/* 아이디 */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-gray-900">
                아이디
              </label>
              <input
                type="text"
                placeholder="영문·숫자 4~20자"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className={`h-13 border rounded-xl px-4 text-[16px] text-gray-900 placeholder-gray-300 outline-none focus:border-[var(--color-primary)] transition-colors ${fieldErrors?.username ? "border-red-400" : "border-gray-200"}`}
              />
              {fieldErrors?.username && (
                <p className="text-xs text-red-500">{fieldErrors.username}</p>
              )}
            </div>

            {/* 이름 */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-gray-900">
                이름
              </label>
              <input
                type="text"
                placeholder="홍길동"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={`h-13 border rounded-xl px-4 text-[16px] text-gray-900 placeholder-gray-300 outline-none focus:border-[var(--color-primary)] transition-colors ${fieldErrors?.name ? "border-red-400" : "border-gray-200"}`}
              />
              {fieldErrors?.name && (
                <p className="text-xs text-red-500">{fieldErrors.name}</p>
              )}
            </div>

            {/* 비밀번호 */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-gray-900">
                비밀번호
              </label>
              <input
                type="password"
                placeholder="영문·숫자·특수문자 포함 8~20자"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`h-13 border rounded-xl px-4 text-[16px] text-gray-900 placeholder-gray-300 outline-none focus:border-[var(--color-primary)] transition-colors ${fieldErrors?.password ? "border-red-400" : "border-gray-200"}`}
              />
              {fieldErrors?.password && (
                <p className="text-xs text-red-500">{fieldErrors.password}</p>
              )}
            </div>

            {/* 비밀번호 확인 */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-gray-900">
                비밀번호 확인
              </label>
              <input
                type="password"
                placeholder="비밀번호를 다시 입력하세요"
                value={passwordConfirm}
                onChange={(e) => setPasswordConfirm(e.target.value)}
                className={`h-13 border rounded-xl px-4 text-[16px] text-gray-900 placeholder-gray-300 outline-none focus:border-[var(--color-primary)] transition-colors ${localError ? "border-red-400" : "border-gray-200"}`}
              />
              {localError && (
                <p className="text-xs text-red-500">{localError}</p>
              )}
            </div>

            {/* 일반 에러 메시지 */}
            {error && !fieldErrors && (
              <p className="text-xs text-red-500 -mt-2">{error}</p>
            )}

            {/* 가입하기 버튼 */}
            <button
              type="submit"
              disabled={loading}
              className="w-full h-14 bg-[var(--color-primary)] text-white text-base font-bold rounded-2xl mt-1 active:bg-[var(--color-primary)] transition-colors cursor-pointer disabled:opacity-60"
            >
              {loading ? "처리 중..." : "가입하기"}
            </button>
          </form>

          {/* 로그인 링크 */}
          <p className="mt-5 text-center text-sm text-gray-400">
            이미 계정이 있으신가요?{" "}
            <span
              className="text-[var(--color-primary)] font-semibold cursor-pointer"
              onClick={() => navigate("/login")}
            >
              로그인
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
