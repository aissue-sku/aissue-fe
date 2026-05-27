import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { keywordService, userService } from "../../services";
import mascot from "../../assets/mascot.png";
import mascotGlass from "../../assets/mascot-glass.png";
import mascotHand from "../../assets/mascot-hand.png";
import star from "../../assets/star.svg";
import bellBlue from "../../assets/bell-blue.svg";

// ── 아이콘 ─────────────────────────────────────────────────────────────
const ChevronRight = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
    <path
      d="M7.5 5l5 5-5 5"
      stroke="#D1D5DC"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const BookIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <path
      d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"
      stroke="#51A2FF"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <path
      d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"
      stroke="#51A2FF"
      strokeWidth="2"
    />
  </svg>
);

const CoinIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="9" stroke="#51A2FF" strokeWidth="2" />
    <path
      d="M12 8v4l2.5 2.5"
      stroke="#51A2FF"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <circle cx="12" cy="12" r="3" stroke="#51A2FF" strokeWidth="2" />
  </svg>
);

const StoreIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <path
      d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"
      stroke="#51A2FF"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M9 22V12h6v10"
      stroke="#51A2FF"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const LogoutIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <path
      d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"
      stroke="#A8A8A8"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M16 17l5-5-5-5M21 12H9"
      stroke="#A8A8A8"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const TrashIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <polyline
      points="3 6 5 6 21 6"
      stroke="#FF6B6B"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6M10 11v6M14 11v6M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"
      stroke="#FF6B6B"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const CrownIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
    <path
      d="M2 20h20M2 20L4.5 9 9 14l3-8 3 8 4.5-5L22 20H2z"
      stroke="#51A2FF"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <circle cx="12" cy="6" r="1.2" fill="#51A2FF" />
    <circle cx="4" cy="9" r="1.2" fill="#51A2FF" />
    <circle cx="20" cy="9" r="1.2" fill="#51A2FF" />
  </svg>
);

const PointBadge = () => (
  <div className="w-9 h-9 rounded-full bg-[#EEF8FF] flex items-center justify-center">
    <span className="text-[15px] font-bold text-[#3B91F4]">P</span>
  </div>
);

// ── 메뉴 아이템 ──────────────────────────────────────────────────────────
interface MenuItemProps {
  icon: React.ReactNode;
  label: string;
  sublabel?: string;
  labelColor?: string;
  onClick?: () => void;
}

const MenuItem = ({
  icon,
  label,
  sublabel,
  labelColor = "#51A2FF",
  onClick,
}: MenuItemProps) => (
  <button
    onClick={onClick}
    className="flex items-center justify-between py-4 w-full cursor-pointer active:opacity-70 transition-opacity"
  >
    <div className="flex items-center gap-1">
      <div className="w-10 h-10 flex items-center justify-center rounded-[10px] shrink-0">
        {icon}
      </div>
      <div className="flex flex-col items-start ml-1">
        <span className="text-[15px] font-medium" style={{ color: labelColor }}>
          {label}
        </span>
        {sublabel && (
          <span className="text-[12px] text-[#A8A8A8] font-medium">
            {sublabel}
          </span>
        )}
      </div>
    </div>
    <ChevronRight />
  </button>
);

// ── 회원 탈퇴 확인 모달 ──────────────────────────────────────────────────
const DeleteAccountModal = ({
  onClose,
  onConfirm,
  loading,
}: {
  onClose: () => void;
  onConfirm: () => void;
  loading: boolean;
}) => {
  const [exiting, setExiting] = useState(false);

  const handleClose = () => {
    setExiting(true);
    setTimeout(onClose, 260);
  };

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/50"
      onClick={handleClose}
    >
      <div
        className={`w-full bg-white rounded-t-[24px] px-6 pt-6 pb-10 flex flex-col gap-4 ${exiting ? 'animate-slide-down' : 'animate-slide-up'}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <h2 className="text-[20px] font-bold text-[#1A1A1A]">회원 탈퇴</h2>
          <button onClick={handleClose} className="p-1 active:opacity-60 transition-opacity">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M18 6L6 18M6 6l12 12" stroke="#A8A8A8" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </div>
        <div className="bg-[#FFF4F4] rounded-2xl px-5 py-4 flex flex-col gap-1.5">
          <p className="text-[15px] font-semibold text-[#1A1A1A]">정말 탈퇴하시겠어요?</p>
          <p className="text-[13px] text-[#A8A8A8] leading-[1.5]">
            탈퇴하면 모든 데이터가 영구적으로 삭제되며 복구할 수 없습니다.
          </p>
        </div>
        <div className="flex gap-2 mt-1">
          <button
            onClick={handleClose}
            className="flex-1 border border-[#E5E5E5] rounded-[12px] py-3.5 text-[15px] font-semibold text-[#888] active:bg-[#f5f5f5] transition-colors"
          >
            취소
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 bg-[#FF6B6B] rounded-[12px] py-3.5 text-white text-[15px] font-bold active:opacity-90 transition-opacity disabled:opacity-60"
          >
            {loading ? '처리 중...' : '탈퇴하기'}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

// ── 플랜 업그레이드 모달 ──────────────────────────────────────────────────
const PlanUpgradeModal = ({ onClose }: { onClose: () => void }) => createPortal(
  <div
    className="fixed inset-0 z-50 flex items-end justify-center bg-black/50"
    onClick={onClose}
  >
    <div
      className="w-full bg-white rounded-t-[24px] px-6 pt-6 pb-10 flex flex-col gap-5 animate-slide-up"
      onClick={(e) => e.stopPropagation()}
    >
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <h2 className="text-[20px] font-bold text-[#1A1A1A]">
          플랜 업그레이드
        </h2>
        <button
          onClick={onClose}
          className="p-1 active:opacity-60 transition-opacity"
          aria-label="닫기"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path
              d="M18 6L6 18M6 6l12 12"
              stroke="#A8A8A8"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </button>
      </div>

      {/* 플랜 카드 */}
      <div className="flex gap-3">
        {/* 무료 플랜 */}
        <div className="flex-1 border border-[#E5E5E5] rounded-2xl p-4 flex flex-col gap-2">
          <span className="text-[13px] font-semibold text-[#A8A8A8]">
            현재 플랜
          </span>
          <span className="text-[18px] font-bold text-[#1A1A1A]">무료</span>
          <ul className="flex flex-col gap-1 mt-1">
            {["키워드 알림 3개", "기사 분석 5회/일", "기본 캐릭터"].map(
              (item) => (
                <li
                  key={item}
                  className="flex items-center gap-1.5 text-[13px] text-[#8F8F8F]"
                >
                  <span className="w-1 h-1 rounded-full bg-[#C0C0C0] shrink-0" />
                  {item}
                </li>
              ),
            )}
          </ul>
        </div>

        {/* 프로 플랜 */}
        <div className="flex-1 border-2 border-[#51A2FF] rounded-2xl p-4 flex flex-col gap-2 relative overflow-hidden">
          <div className="absolute top-0 right-0 bg-[#51A2FF] px-2.5 py-1 rounded-bl-xl">
            <span className="text-[11px] font-bold text-white">추천</span>
          </div>
          <span className="text-[13px] font-semibold text-[#51A2FF]">
            업그레이드
          </span>
          <span className="text-[18px] font-bold text-[#1A1A1A]">프로</span>
          <ul className="flex flex-col gap-1 mt-1">
            {["키워드 알림 무제한", "기사 분석 무제한", "모든 캐릭터 해금"].map(
              (item) => (
                <li
                  key={item}
                  className="flex items-center gap-1.5 text-[13px] text-[#3B91F4]"
                >
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 12 12"
                    fill="none"
                    className="shrink-0"
                  >
                    <path
                      d="M2 6l3 3 5-5"
                      stroke="#51A2FF"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  {item}
                </li>
              ),
            )}
          </ul>
        </div>
      </div>

      {/* 가격 */}
      <div className="bg-[#F7F9FF] rounded-2xl px-5 py-4 flex items-center justify-between">
        <span className="text-[15px] text-[#1A1A1A] font-medium">
          프로 플랜
        </span>
        <div className="flex items-baseline gap-1">
          <span className="text-[22px] font-bold text-[#3B91F4]">₩4,900</span>
          <span className="text-[13px] text-[#A8A8A8]">/ 월</span>
        </div>
      </div>

      {/* 업그레이드 버튼 */}
      <button className="w-full h-[52px] bg-[#51A2FF] text-white text-[17px] font-semibold rounded-[10px] active:opacity-90 transition-opacity">
        프로로 업그레이드하기
      </button>
    </div>
  </div>,
  document.body
);

// ── 메인 페이지 ───────────────────────────────────────────────────────────
const FREE_KEYWORD_LIMIT = 3;

const COLOR_NAME: Record<string, string> = {
  AISSUE: "아이슈",
  JANMANG: "잔망슈",
  SUNSET: "선셋슈",
  RETRO: "레트로슈",
  SWEET: "달콤슈",
  COOL: "쿨슈",
};

const COLOR_FILTER: Record<string, string> = {
  AISSUE: "none",
  JANMANG: "hue-rotate(305deg) saturate(1.1) brightness(1.2)",
  SUNSET: "hue-rotate(155deg) saturate(0.9) brightness(1.1)",
  RETRO: "hue-rotate(40deg) saturate(0.85) brightness(1.1)",
  SWEET: "hue-rotate(225deg) saturate(0.85) brightness(1.2)",
  COOL: "hue-rotate(345deg) saturate(1.0) brightness(1.1)",
};

const ProfilePage = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [showPlanModal, setShowPlanModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [keywordCount, setKeywordCount] = useState<number | null>(null);
  const [userInfo, setUserInfo] = useState<{ color: string; points: number } | null>(null);

  useEffect(() => {
    Promise.all([
      userService.getProfile(),
      keywordService.getSubscriptions(),
    ])
      .then(([profile, subs]) => {
        setUserInfo({ color: profile.color, points: profile.points });
        setKeywordCount((subs as unknown[]).length);
      })
      .catch(() => {});
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate("/login", { replace: true });
  };

  const handleDeleteAccount = async () => {
    setDeleteLoading(true);
    try {
      await userService.deleteAccount();
      await logout();
      navigate("/login", { replace: true });
    } catch {
      setDeleteLoading(false);
    }
  };

  return (
    <div className="min-h-full bg-white flex flex-col animate-page-enter">
      {/* 헤더 */}
      <div className="h-14 flex items-center justify-center mt-5">
        <h1 className="text-[18px] font-semibold text-[#1A1A1A] tracking-[-0.45px]">
          마이페이지
        </h1>
      </div>

      {/* 히어로 영역 */}
      <div className="relative flex flex-col items-center pb-6 mt-6">
        {/* 별 장식 */}
        <img
          src={star}
          alt=""
          className="absolute top-[-50px] left-[17px] w-[34px] opacity-80"
        />
        <img
          src={star}
          alt=""
          className="absolute top-[10px] left-[91px] w-[22px] opacity-70"
        />
        <img
          src={star}
          alt=""
          className="absolute top-[45px] left-[25px] w-[18px] opacity-60"
        />
        <img
          src={star}
          alt=""
          className="absolute top-[10px] right-[60px] w-[36px] opacity-80"
        />
        <img
          src={star}
          alt=""
          className="absolute top-[-50px] right-[55px] w-[18px] opacity-60"
        />
        <img
          src={star}
          alt=""
          className="absolute top-[124px] right-[90px] w-[22px] opacity-50"
        />

        {/* 마스코트 */}
        <div className="relative w-[110px] h-[110px] z-10 mt-2 mb-8">
          <img
            src={mascot}
            alt="아이슈 마스코트"
            className="relative w-full h-auto object-contain"
            style={{ filter: COLOR_FILTER[userInfo?.color ?? ""] ?? "none" }}
          />
          <img
            src={mascotGlass}
            alt=""
            className="absolute top-[8%] left-[16%] w-[70%] h-auto animate-glasses"
            style={{ filter: COLOR_FILTER[userInfo?.color ?? ""] ?? "none" }}
          />
          <img
            src={mascotHand}
            alt=""
            className="absolute top-[35%] left-[75%] w-[48%] h-auto animate-hand"
            style={{ filter: COLOR_FILTER[userInfo?.color ?? ""] ?? "none" }}
          />
        </div>

        {/* 파란 반원 배경 */}
        <div
          className="absolute bottom-0 left-0 right-0 h-[140px] bg-[#E7F2FF]"
          style={{ borderRadius: "120px 120px 0 0" }}
        />

        {/* 캐릭터 / 포인트 */}
        <div className="relative z-10 flex items-center justify-center gap-8 mt-1">
          <div className="flex items-center gap-2">
            <span className="text-[14px] text-[#8F8F8F]">캐릭터</span>
            <span className="text-[18px] font-bold text-[#3B91F4]">
              {userInfo ? (COLOR_NAME[userInfo.color] ?? userInfo.color) : "—"}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[14px] text-[#8F8F8F]">포인트</span>
            <span className="text-[20px] font-bold text-[#3B91F4]">
              {userInfo?.points ?? "—"}
            </span>
            <PointBadge />
          </div>
        </div>
      </div>

      {/* 프로 플랜 배너 */}
      <div className="border-t-[10px] border-b-[10px] border-[#F7F7F7] px-[30px] py-[30px]">
        <div className="flex flex-col gap-4">
          <div className="flex gap-3 items-start">
            <div className="w-10 h-10 rounded-[10px] bg-[#EEF8FF] flex items-center justify-center shrink-0">
              <CrownIcon />
            </div>
            <div className="flex flex-col gap-1">
              <p className="text-[18px] font-bold leading-[1.5]">
                <span className="text-[#3B91F4]">프로 플랜 </span>
                <span className="text-[#1A1A1A]">전용 혜택</span>
              </p>
              <p className="text-[14px] text-[#A8A8A8] leading-[1.5]">
                현재 등록한 키워드 {keywordCount ?? '—'} / {FREE_KEYWORD_LIMIT}개
              </p>
              <p className="text-[14px] text-[#A8A8A8] leading-[1.5]">
                프로 플랜 전환시 키워드 무제한 등록
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowPlanModal(true)}
            className="w-full border border-[#51A2FF] rounded-[5px] py-2 flex items-center justify-center cursor-pointer active:bg-[#EEF8FF] transition-colors"
          >
            <span className="text-[14px] font-semibold text-[#3B91F4]">
              플랜 업그레이드하기
            </span>
          </button>
        </div>
      </div>

      {/* 메뉴 섹션 1 */}
      <div className="border-b-[10px] border-[#F7F7F7] px-5 flex flex-col">
        <MenuItem icon={<BookIcon />} label="사용 가이드" />
        <MenuItem
          icon={<img src={bellBlue} alt="" className="w-5 h-5" />}
          label="키워드 알림 관리"
          onClick={() => navigate("/profile/keywords")}
        />
        <MenuItem
          icon={<CoinIcon />}
          label="출석체크 하기"
          sublabel="매일 포인트를 받아보세요!"
        />
        <MenuItem
          icon={<StoreIcon />}
          label="캐릭터 상점"
          onClick={() => navigate("/profile/shop")}
        />
      </div>

      {/* 메뉴 섹션 2 */}
      <div className="px-5 flex flex-col">
        <MenuItem
          icon={<LogoutIcon />}
          label="로그아웃"
          labelColor="#A8A8A8"
          onClick={handleLogout}
        />
        <MenuItem icon={<TrashIcon />} label="회원 탈퇴" labelColor="#FF6B6B" onClick={() => setShowDeleteModal(true)} />
      </div>

      {showPlanModal && (
        <PlanUpgradeModal onClose={() => setShowPlanModal(false)} />
      )}
      {showDeleteModal && (
        <DeleteAccountModal
          onClose={() => setShowDeleteModal(false)}
          onConfirm={handleDeleteAccount}
          loading={deleteLoading}
        />
      )}
    </div>
  );
};

export default ProfilePage;
