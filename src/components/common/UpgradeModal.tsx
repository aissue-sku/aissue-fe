import { useState } from 'react';
import { createPortal } from 'react-dom';

const FREE_KEYWORD_LIMIT = 3;

const UpgradeModal = ({ onClose }: { onClose: () => void }) => {
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
          <h2 className="text-[20px] font-bold text-[#1A1A1A]">키워드 한도 초과</h2>
          <button onClick={handleClose} className="p-1 active:opacity-60 transition-opacity">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M18 6L6 18M6 6l12 12" stroke="#A8A8A8" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </div>
        <div className="bg-[#F7F9FF] rounded-2xl px-5 py-4 flex flex-col gap-1.5">
          <p className="text-[15px] font-semibold text-[#1A1A1A]">
            무료 플랜은 키워드 {FREE_KEYWORD_LIMIT}개까지 등록 가능해요
          </p>
          <p className="text-[13px] text-[#A8A8A8] leading-[1.5]">
            프로 플랜으로 업그레이드하면 키워드를 무제한으로 등록하고 더 많은 알림을 받을 수 있어요.
          </p>
        </div>
        <div className="flex flex-col gap-2 mt-1">
          {['키워드 알림 무제한', '기사 분석 무제한', '모든 캐릭터 해금'].map((item) => (
            <div key={item} className="flex items-center gap-2">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <circle cx="8" cy="8" r="7" stroke="#51A2FF" strokeWidth="1.4" />
                <path d="M5 8l2 2 4-4" stroke="#51A2FF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span className="text-[13px] text-[#555]">{item}</span>
            </div>
          ))}
        </div>
        <button className="w-full bg-[#51A2FF] rounded-[12px] py-3.5 text-white text-[16px] font-bold active:opacity-90 transition-opacity mt-1">
          프로 플랜 업그레이드하기
        </button>
      </div>
    </div>,
    document.body
  );
};

export default UpgradeModal;
