import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import mascot from "../../assets/mascot.png";
import mascotGlass from "../../assets/mascot-glass.png";
import mascotHand from "../../assets/mascot-hand.png";
import logo from "../../assets/logo.svg";

const SplashPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const t = setTimeout(() => navigate("/login"), 2500);
    return () => clearTimeout(t);
  }, [navigate]);

  return (
    <div className="min-h-dvh bg-white flex flex-col items-center justify-center relative overflow-hidden">
      {/* 떠다니는 장식 원 */}
      <div className="absolute top-[18%] left-[14%] w-3 h-3 rounded-full bg-[var(--color-primary-border)] animate-splash-float-1" />
      <div className="absolute top-[28%] right-[16%] w-2 h-2 rounded-full bg-[var(--color-primary)] animate-splash-float-2" />
      <div className="absolute top-[42%] left-[8%]  w-4 h-4 rounded-full bg-[var(--color-primary-border)] animate-splash-float-3" />
      <div className="absolute bottom-[28%] right-[12%] w-3 h-3 rounded-full bg-[var(--color-primary)]/40 animate-splash-float-4" />
      <div className="absolute bottom-[20%] left-[18%] w-2 h-2 rounded-full bg-[var(--color-primary-border)] animate-splash-float-2" />

      {/* 메인 콘텐츠 */}
      <div className="flex flex-col items-center gap-4 animate-splash-enter">
        <div className="relative w-28">
          {/* 마스코트 배경 글로우 */}
          <div className="absolute -bottom-2 left-1/2 w-44 h-20 bg-[var(--color-primary-border)] rounded-full blur-2xl animate-splash-glow" />
          <img
            src={mascot}
            alt="아이슈 마스코트"
            className="relative w-full h-auto object-contain"
          />
          <img
            src={mascotGlass}
            alt=""
            className="absolute top-[24%] left-[16%] w-[70%] h-auto animate-glasses"
          />
          <img
            src={mascotHand}
            alt=""
            className="absolute top-[35%] left-[75%] w-[48%] h-auto"
          />
        </div>

        <div className="flex flex-col items-center gap-1">
          <img src={logo} alt="아이슈" className="w-20 h-auto" />
          <p className="text-sm text-[var(--color-primary)] opacity-70">
            AI로 요즘 이슈를 알아보다.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SplashPage;
