import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { keywordService } from '../../services';
import { ApiError } from '../../services/client';
import UpgradeModal from '../../components/common/UpgradeModal';

const FREE_KEYWORD_LIMIT = 3;

const BellIcon = ({ color = '#51A2FF' }: { color?: string }) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <path
      d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M13.73 21a2 2 0 0 1-3.46 0"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const TrashIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <polyline points="3 6 5 6 21 6" stroke="#FF6B6B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path
      d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6M10 11v6M14 11v6M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"
      stroke="#FF6B6B"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const KeywordManagePage = () => {
  const navigate = useNavigate();
  const [subscribed, setSubscribed] = useState<string[]>([]);
  const [trending, setTrending] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [showInput, setShowInput] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [inputError, setInputError] = useState('');
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const isAtLimit = subscribed.length >= FREE_KEYWORD_LIMIT;

  useEffect(() => {
    Promise.all([
      keywordService.getSubscriptions(),
      keywordService.getTrending(),
    ])
      .then(([subs, trend]) => {
        setSubscribed((subs as unknown as { keyword: string }[]).map((s) => s.keyword));
        setTrending(trend.map((t: { keyword: string }) => t.keyword));
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (showInput) inputRef.current?.focus();
  }, [showInput]);

  const handleAdd = async (keyword: string) => {
    const kw = keyword.trim();
    if (!kw || subscribed.includes(kw)) return;
    if (isAtLimit) { setShowUpgradeModal(true); return; }
    try {
      await keywordService.subscribe(kw);
      setSubscribed((prev) => [...prev, kw]);
    } catch (e) {
      if (e instanceof ApiError) setInputError(e.message);
    }
  };

  const handleRemove = async (keyword: string) => {
    try {
      await keywordService.unsubscribe(keyword);
      setSubscribed((prev) => prev.filter((k) => k !== keyword));
    } catch {}
  };

  const handleInputSubmit = async () => {
    setInputError('');
    const kw = inputValue.trim();
    if (!kw) { setInputError('키워드를 입력해주세요.'); return; }
    if (subscribed.includes(kw)) { setInputError('이미 구독 중인 키워드입니다.'); return; }
    await handleAdd(kw);
    setInputValue('');
    setShowInput(false);
  };

  return (
    <div className="h-full overflow-hidden flex flex-col bg-[#f5f5f5] animate-slide-in">
      {/* 헤더 */}
      <header className="bg-white border-b border-[#f0f0f0] h-18 flex items-center justify-center px-5 shrink-0 relative">
        <button
          onClick={() => navigate(-1)}
          className="absolute left-5 p-1 cursor-pointer active:opacity-60 transition-opacity"
          aria-label="뒤로 가기"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M15 18l-6-6 6-6" stroke="#1A1A1A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <h1 className="text-[18px] font-semibold text-[#1A1A1A] tracking-[-0.45px]">키워드 알림관리</h1>
      </header>

      {/* 스크롤 영역 */}
      <div className="flex-1 overflow-y-auto flex flex-col gap-4 p-4">

        {/* 안내 카드 */}
        <div className="bg-white rounded-2xl px-5 py-5">
          <div className="flex items-center gap-2 mb-2">
            <BellIcon />
            <span className="text-[16px] font-semibold text-[#1A1A1A]">키워드 알림</span>
          </div>
          <p className="text-[14px] text-[#8f8f8f] leading-[1.6]">
            구독한 키워드와 관련된 새로운 뉴스가 올라오면 알림을 받을 수 있습니다.
          </p>
        </div>

        {/* 급상승 키워드 */}
        <div className="bg-white rounded-2xl px-5 py-5">
          <p className="text-[15px] font-semibold text-[#1A1A1A] mb-4">급상승 키워드</p>
          {trending.length === 0 ? (
            <div className="flex flex-wrap gap-2">
              {[48, 64, 56, 72, 52, 60].map((w) => (
                <div key={w} className="h-9 rounded-full bg-gray-200 animate-pulse" style={{ width: w }} />
              ))}
            </div>
          ) : (
            <div className="flex flex-wrap gap-2">
              {trending.flatMap((kw) => kw.split(' ').filter(Boolean)).map((word) => {
                const already = subscribed.includes(word);
                return (
                  <button
                    key={word}
                    onClick={() => !already && handleAdd(word)}
                    disabled={already}
                    className={`px-4 py-2 rounded-full text-[14px] font-semibold transition-colors ${
                      already
                        ? 'bg-[#cce4ff] text-[#51A2FF] opacity-50 cursor-default'
                        : 'bg-[#EEF8FF] text-[#51A2FF] active:bg-[#d6edff]'
                    }`}
                  >
                    {already ? word : `+ ${word}`}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* 구독 중인 키워드 */}
        <div className="flex flex-col gap-3">
          {/* 섹션 헤더 */}
          <div className="flex items-center justify-between px-1">
            <span className="text-[15px] font-semibold text-[#1A1A1A]">구독 중인 키워드</span>
            <span className="text-[13px] font-semibold text-[#51A2FF]">
              {loading ? '' : `${subscribed.length}개`}
            </span>
          </div>

          {/* 직접 추가 버튼 / 입력 */}
          {isAtLimit ? (
            <button
              onClick={() => setShowUpgradeModal(true)}
              className="bg-[#FFF4EC] rounded-2xl px-4 py-4 text-[15px] font-semibold text-[#FF8C42] text-center active:bg-[#ffe8d0] transition-colors"
            >
              프로 플랜으로 키워드 더 추가하기
            </button>
          ) : showInput ? (
            <div className="bg-[#EEF8FF] rounded-2xl px-4 py-3 flex flex-col gap-2">
              <div className="flex gap-2">
                <input
                  ref={inputRef}
                  value={inputValue}
                  onChange={(e) => { setInputValue(e.target.value); setInputError(''); }}
                  onKeyDown={(e) => e.key === 'Enter' && handleInputSubmit()}
                  placeholder="키워드를 입력하세요"
                  className="flex-1 bg-white border border-[#c8dff8] rounded-xl px-3 py-2 text-[14px] text-[#1a1a1a] outline-none"
                />
                <button
                  onClick={handleInputSubmit}
                  className="bg-[#51A2FF] text-white text-[14px] font-semibold px-4 rounded-xl active:opacity-80 transition-opacity"
                >
                  추가
                </button>
                <button
                  onClick={() => { setShowInput(false); setInputValue(''); setInputError(''); }}
                  className="text-[#a0a0a0] text-[14px] px-2"
                >
                  취소
                </button>
              </div>
              {inputError && <p className="text-[12px] text-red-400 px-1">{inputError}</p>}
            </div>
          ) : (
            <button
              onClick={() => setShowInput(true)}
              className="bg-[#EEF8FF] rounded-2xl px-4 py-4 text-[15px] font-semibold text-[#51A2FF] text-center active:bg-[#d6edff] transition-colors"
            >
              + 직접 키워드 추가하기
            </button>
          )}

          {/* 구독 목록 */}
          {loading ? (
            <div className="flex flex-col gap-[1px] bg-[#ebebeb] rounded-2xl overflow-hidden">
              {[0, 1, 2].map((i) => (
                <div key={i} className="bg-white px-4 py-4 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-gray-200 animate-pulse flex-shrink-0" />
                  <div className="h-4 bg-gray-200 animate-pulse rounded-full flex-1" />
                  <div className="w-7 h-7 rounded-full bg-gray-200 animate-pulse" />
                </div>
              ))}
            </div>
          ) : subscribed.length === 0 ? (
            <div className="bg-white rounded-2xl px-5 py-6 text-center">
              <p className="text-[14px] text-[#a0a0a0]">구독 중인 키워드가 없습니다.</p>
            </div>
          ) : (
            <div className="flex flex-col gap-[1px] bg-[#ebebeb] rounded-2xl overflow-hidden">
              {subscribed.map((kw) => (
                <div key={kw} className="bg-white px-4 py-4 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-[#EEF8FF] flex items-center justify-center flex-shrink-0">
                    <BellIcon />
                  </div>
                  <span className="flex-1 text-[15px] font-medium text-[#1A1A1A]">{kw}</span>
                  <button
                    onClick={() => handleRemove(kw)}
                    className="p-1.5 rounded-full active:bg-[#fff0f0] transition-colors"
                    aria-label={`${kw} 삭제`}
                  >
                    <TrashIcon />
                  </button>
                </div>
              ))}
            </div>
          )}

        </div>
      </div>

      {showUpgradeModal && <UpgradeModal onClose={() => setShowUpgradeModal(false)} />}
    </div>
  );
};

export default KeywordManagePage;
