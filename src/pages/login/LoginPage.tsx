import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import mascot from "../../assets/mascot.png";
import mascotHand from "../../assets/mascot-hand.png";
import logo from "../../assets/logo.svg";
import { useAuth } from "../../hooks/useAuth";

const LoginPage = () => {
  const navigate = useNavigate();
  const { login, testLogin, loading, error, fieldErrors } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    await login({ username, password });
  };

  return (
    <div className="h-dvh overflow-hidden bg-[#f2f2f7] flex flex-col items-center px-5 pt-[6.75rem] pb-10 animate-page-enter">
      {/* 마스코트 + 로고 */}
      <div className="flex flex-col items-center mb-8 -mt-8">
        <div className="relative w-28">
          <img
            src={mascot}
            alt="아이슈 마스코트"
            className="w-full h-auto object-contain"
          />
          <img
            src={mascotHand}
            alt=""
            className="absolute top-[35%] left-[75%] w-[48%] h-auto animate-hand"
          />
        </div>
        <img src={logo} alt="아이슈" className="w-24 h-auto mt-2" />
      </div>

      {/* 로그인 카드 */}
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-sm px-6 py-8">
        <form onSubmit={handleLogin} className="flex flex-col gap-5">
          {/* 아이디 */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-gray-900">
              아이디
            </label>
            <input
              type="text"
              placeholder="아이디를 입력하세요"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className={`h-13 border rounded-xl px-4 text-[16px] text-gray-900 placeholder-gray-300 outline-none focus:border-[#5b9cf6] transition-colors ${fieldErrors?.username ? "border-red-400" : "border-gray-200"}`}
            />
            {fieldErrors?.username && (
              <p className="text-xs text-red-500">{fieldErrors.username}</p>
            )}
          </div>

          {/* 비밀번호 */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-gray-900">
              비밀번호
            </label>
            <input
              type="password"
              placeholder="비밀번호를 입력하세요"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`h-13 border rounded-xl px-4 text-[16px] text-gray-900 placeholder-gray-300 outline-none focus:border-[#5b9cf6] transition-colors ${fieldErrors?.password ? "border-red-400" : "border-gray-200"}`}
            />
            {fieldErrors?.password && (
              <p className="text-xs text-red-500">{fieldErrors.password}</p>
            )}
          </div>

          {/* 일반 에러 메시지 */}
          {error && <p className="text-xs text-red-500 -mt-2">{error}</p>}

          {/* 로그인 버튼 */}
          <button
            type="submit"
            disabled={loading}
            className="w-full h-14 bg-[#5b9cf6] text-white text-base font-bold rounded-2xl mt-1 active:bg-[#4a8ae0] transition-colors cursor-pointer disabled:opacity-60"
          >
            {loading ? "로그인 중..." : "로그인"}
          </button>
        </form>

        {/* 회원가입 링크 */}
        <p className="mt-5 text-center text-sm text-gray-400">
          계정이 없으신가요?{" "}
          <span
            className="text-[#5b9cf6] font-semibold cursor-pointer"
            onClick={() => navigate("/signup")}
          >
            회원가입
          </span>
        </p>

        {/* 테스트 로그인 */}
        <button
          type="button"
          onClick={testLogin}
          disabled={loading}
          className="w-full mt-3 text-sm font-bold text-[#5b9cf6] cursor-pointer text-center disabled:opacity-60"
        >
          Skip for now
        </button>
      </div>
    </div>
  );
};

export default LoginPage;
