import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Bell, Trash2 } from 'lucide-react';
import { useNotifications } from '../../hooks/useNotifications';

const SWIPE_THRESHOLD = 80;
const SWIPE_MAX = 100;

const formatTimeAgo = (dateStr: string): string => {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return '방금 전';
  if (mins < 60) return `${mins}분 전`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}시간 전`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days}일 전`;
  return new Date(dateStr).toLocaleDateString('ko-KR', { month: 'long', day: 'numeric' });
};

const NotificationPage = () => {
  const navigate = useNavigate();
  const [isExiting, setIsExiting] = useState(false);
  const { notifications, unreadCount, loading, error, markAsRead, dismiss } =
    useNotifications();

  const [swipeOffsets, setSwipeOffsets] = useState<Record<number, number>>({});
  const [activeSwiping, setActiveSwiping] = useState<number | null>(null);
  const touchStartX = useRef<Record<number, number>>({});

  const handleBack = () => {
    setIsExiting(true);
    setTimeout(() => navigate(-1), 280);
  };

  const handleCardClick = (id: number, contentId: number, title: string) => {
    if ((swipeOffsets[id] ?? 0) < -10) return;
    markAsRead(id);
    navigate('/analysis/trust', { state: { contentId: String(contentId), title } });
  };

  const handleTouchStart = (id: number, e: React.TouchEvent) => {
    touchStartX.current[id] = e.touches[0].clientX;
    setActiveSwiping(id);
  };

  const handleTouchMove = (id: number, e: React.TouchEvent) => {
    const dx = e.touches[0].clientX - (touchStartX.current[id] ?? 0);
    if (dx < 0) {
      setSwipeOffsets((prev) => ({ ...prev, [id]: Math.max(dx, -SWIPE_MAX) }));
    }
  };

  const handleTouchEnd = (id: number) => {
    setActiveSwiping(null);
    if ((swipeOffsets[id] ?? 0) < -SWIPE_THRESHOLD) {
      dismiss(id);
    }
    setSwipeOffsets((prev) => ({ ...prev, [id]: 0 }));
  };

  return (
    <div
      className={`h-full overflow-hidden flex flex-col bg-[#f5f5f5] ${
        isExiting ? 'animate-slide-out' : 'animate-slide-in'
      }`}
    >
      {/* 헤더 */}
      <header className="bg-white border-b border-[#f0f0f0] h-14 flex items-center justify-center px-5 shrink-0 relative">
        <button
          onClick={handleBack}
          className="absolute left-5 p-1 cursor-pointer active:opacity-60 transition-opacity"
          aria-label="뒤로 가기"
        >
          <ChevronLeft size={24} className="text-[#1a1a1a]" />
        </button>
        <h1 className="text-[18px] font-semibold text-[#1a1a1a] tracking-[-0.45px]">
          알림
          {unreadCount > 0 && (
            <span className="ml-2 text-[14px] font-bold text-[#51a2ff]">
              {unreadCount}
            </span>
          )}
        </h1>
      </header>

      {/* 콘텐츠 */}
      <div className="flex-1 overflow-y-auto">
        {loading && (
          <ul className="flex flex-col gap-[1px] bg-[#ebebeb]">
            {[0, 1, 2, 3, 4].map((i) => (
              <li key={i} className="bg-white px-5 py-4 flex items-start gap-3">
                <div className="w-9 h-9 rounded-full bg-gray-200 animate-pulse flex-shrink-0 mt-0.5" />
                <div className="flex flex-col gap-2 flex-1">
                  <div className="h-3.5 bg-gray-200 animate-pulse rounded-full w-4/5" />
                  <div className="h-3 bg-gray-200 animate-pulse rounded-full w-2/5" />
                </div>
              </li>
            ))}
          </ul>
        )}

        {error && (
          <div className="flex items-center justify-center h-40">
            <p className="text-[14px] text-red-400">{error}</p>
          </div>
        )}

        {!loading && !error && notifications.length === 0 && (
          <div className="flex flex-col items-center justify-center h-40 gap-3">
            <Bell size={32} className="text-[#d0d0d0]" />
            <p className="text-[14px] text-[#a0a0a0]">알림이 없습니다.</p>
          </div>
        )}

        {!loading && !error && notifications.length > 0 && (
          <ul className="flex flex-col gap-[1px] bg-[#ebebeb]">
            {notifications.map((item) => {
              const offset = swipeOffsets[item.id] ?? 0;
              const isSwiping = activeSwiping === item.id;
              const deleteProgress = Math.min(Math.abs(offset) / SWIPE_THRESHOLD, 1);

              return (
                <li
                  key={item.id}
                  className="relative bg-[#FF6B6B] overflow-hidden"
                  onTouchStart={(e) => handleTouchStart(item.id, e)}
                  onTouchMove={(e) => handleTouchMove(item.id, e)}
                  onTouchEnd={() => handleTouchEnd(item.id)}
                >
                  {/* 삭제 배경 */}
                  <div className="absolute inset-0 flex items-center justify-end pr-5">
                    <Trash2
                      size={20}
                      className="text-white"
                      style={{ opacity: deleteProgress }}
                    />
                  </div>

                  {/* 슬라이드 콘텐츠 */}
                  <div
                    className="relative bg-white"
                    style={{
                      transform: `translateX(${offset}px)`,
                      transition: isSwiping ? 'none' : 'transform 300ms ease',
                    }}
                  >
                    {/* 읽지 않음 좌측 강조선 */}
                    {!item.read && (
                      <span className="absolute left-0 top-0 bottom-0 w-[3px] bg-[#51a2ff] rounded-r-full" />
                    )}

                    <button
                      onClick={() => handleCardClick(item.id, item.contentId, item.title)}
                      className="w-full text-left px-5 py-4 flex items-start gap-3 active:bg-[#f8f8f8] transition-colors"
                    >
                      {/* 아이콘 */}
                      <div
                        className={`mt-0.5 w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 ${
                          item.read ? 'bg-[#f0f0f0]' : 'bg-[#e8f3ff]'
                        }`}
                      >
                        <Bell
                          size={17}
                          className={item.read ? 'text-[#b0b0b0]' : 'text-[#51a2ff]'}
                        />
                      </div>

                      {/* 텍스트 */}
                      <div className="flex-1 min-w-0 flex flex-col gap-1">
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] font-semibold text-[#51a2ff] bg-[#e8f3ff] rounded-full px-2 py-0.5 leading-none">
                            {item.keyword}
                          </span>
                          <span className="text-[12px] text-[#aaa] ml-auto flex-shrink-0">
                            {formatTimeAgo(item.createdAt)}
                          </span>
                        </div>
                        <p
                          className={`text-[14px] leading-[1.5] line-clamp-2 ${
                            item.read
                              ? 'text-[#888] font-normal'
                              : 'text-[#1a1a1a] font-semibold'
                          }`}
                        >
                          {item.title}
                        </p>
                      </div>
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
};

export default NotificationPage;
