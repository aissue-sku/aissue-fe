import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import mascot from "../../assets/mascot.png";
import { useAuth } from "../../hooks/useAuth";

const SignupPage = () => {
  const navigate = useNavigate();
  const { signup, loading, error } = useAuth();
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

  const displayError = localError ?? error;

  return (
    <div className="min-h-dvh bg-[#f2f2f7] flex flex-col animate-page-enter">
      {/* 헤더 */}
      <div className="h-14 flex items-center px-5 pt-5">
        <button
          onClick={() => navigate(-1)}
          className="size-6 flex items-center justify-center"
        >
          <ChevronLeft size={24} className="text-[#1a1a1a]" />
        </button>
      </div>

      <div className="flex flex-col items-center px-5 pt-6 pb-10">
        {/* 마스코트 + 타이틀 */}
        <div className="flex flex-col items-center mb-3">
          <img
            src={mascot}
            alt="아이슈 마스코트"
            className="w-28 h-auto object-contain"
          />
          <span className="text-base font-semibold text-gray-800 mt-2">
            회원가입
          </span>
        </div>

        {/* 회원가입 카드 */}
        <div className="w-full max-w-sm bg-white rounded-2xl shadow-sm px-6 py-8">
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
                className="h-13 border border-gray-200 rounded-xl px-4 text-[16px] text-gray-900 placeholder-gray-300 outline-none focus:border-[#5b9cf6] transition-colors"
              />
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
                className="h-13 border border-gray-200 rounded-xl px-4 text-[16px] text-gray-900 placeholder-gray-300 outline-none focus:border-[#5b9cf6] transition-colors"
              />
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
                className="h-13 border border-gray-200 rounded-xl px-4 text-[16px] text-gray-900 placeholder-gray-300 outline-none focus:border-[#5b9cf6] transition-colors"
              />
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
                className="h-13 border border-gray-200 rounded-xl px-4 text-[16px] text-gray-900 placeholder-gray-300 outline-none focus:border-[#5b9cf6] transition-colors"
              />
            </div>

            {/* 에러 메시지 */}
            {displayError && (
              <p className="text-xs text-red-500 -mt-2">{displayError}</p>
            )}

            {/* 가입하기 버튼 */}
            <button
              type="submit"
              disabled={loading}
              className="w-full h-14 bg-[#5b9cf6] text-white text-base font-bold rounded-2xl mt-1 active:bg-[#4a8ae0] transition-colors cursor-pointer disabled:opacity-60"
            >
              {loading ? "처리 중..." : "가입하기"}
            </button>
          </form>

          {/* 로그인 링크 */}
          <p className="mt-5 text-center text-sm text-gray-400">
            이미 계정이 있으신가요?{" "}
            <span
              className="text-[#5b9cf6] font-semibold cursor-pointer"
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
