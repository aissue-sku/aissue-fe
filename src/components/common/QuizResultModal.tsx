import { useState } from 'react';
import { createPortal } from 'react-dom';

interface Props {
  correct: boolean;
  pointsEarned: number;
  fakeIndex: number;
  onClose: () => void;
}

const CheckIcon = () => (
  <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
    <path d="M5 12l5 5 9-11" stroke="#2E7D32" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const CloseIcon = () => (
  <svg width="36" height="36" viewBox="0 0 24 24" fill="none">
    <path d="M18 6L6 18M6 6l12 12" stroke="#C62828" strokeWidth="2.5" strokeLinecap="round" />
  </svg>
);

const QuizResultModal = ({ correct, pointsEarned, fakeIndex, onClose }: Props) => {
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
        className={`w-full max-w-[430px] bg-white rounded-t-[24px] px-6 pt-8 pb-10 flex flex-col items-center gap-5 ${exiting ? 'animate-slide-down' : 'animate-slide-up'}`}
        onClick={(e) => e.stopPropagation()}
      >
        {correct ? (
          <>
            <div className="w-20 h-20 rounded-full bg-[#E8F5E9] flex items-center justify-center">
              <CheckIcon />
            </div>
            <div className="flex flex-col items-center gap-1.5">
              <h2 className="text-[22px] font-bold text-[#1A1A1A]">정답이에요!</h2>
              <p className="text-[14px] text-[#888] text-center leading-[1.6]">
                가짜 기사를 정확히 찾아냈어요
              </p>
            </div>
            <div className="bg-[var(--color-primary-bg)] rounded-2xl px-6 py-3">
              <span className="text-[18px] font-bold" style={{ color: 'var(--color-primary)' }}>
                +{pointsEarned}P 획득!
              </span>
            </div>
          </>
        ) : (
          <>
            <div className="w-20 h-20 rounded-full bg-[#FFEBEE] flex items-center justify-center">
              <CloseIcon />
            </div>
            <div className="flex flex-col items-center gap-1.5">
              <h2 className="text-[22px] font-bold text-[#1A1A1A]">아쉬워요!</h2>
              <p className="text-[14px] text-[#888] text-center leading-[1.6]">
                정답은 <span className="font-bold text-[#1A1A1A]">{fakeIndex + 1}번 기사</span>예요<br />
                다음엔 꼭 맞춰봐요
              </p>
            </div>
          </>
        )}
        <button
          onClick={handleClose}
          className="w-full h-[52px] rounded-[12px] text-[16px] font-bold text-white bg-[var(--color-primary)] active:opacity-80 transition-opacity mt-2"
        >
          확인
        </button>
      </div>
    </div>,
    document.body,
  );
};

export default QuizResultModal;
