import type { Article } from '../../types';

interface Props {
  article: Article;
  active?: boolean;
  onClick?: () => void;
}

const NewsCard = ({ article, active = false, onClick }: Props) => {
  return (
    <div onClick={onClick} className={`bg-[#FBFBFB] rounded-2xl overflow-hidden flex-shrink-0 w-[clamp(248px,_63vw,_360px)] flex flex-col transition-all duration-300 border-[1.2px] border-[#E5E5E5] ${active ? 'h-[clamp(320px,_81vw,_464px)]' : 'h-[clamp(256px,_65vw,_371px)]'} ${onClick ? 'cursor-pointer' : ''}`}>
      {/* 썸네일 */}
      <div className="relative bg-gray-200 overflow-hidden flex-shrink-0 h-[clamp(128px,_32.5vw,_186px)]">
        <img
          src={article.imageUrl}
          alt={article.title}
          className="w-full h-full object-cover"
        />
        {article.trusted !== undefined && (
          <div
            className={`absolute top-2.5 right-2.5 flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold backdrop-blur-sm ${
              article.trusted
                ? "bg-[#51A2FF]/85 text-white"
                : "bg-[#FF8C42]/85 text-white"
            }`}
          >
            {article.trusted ? (
              <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
                <path d="M2 6l3 3 5-5" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            ) : (
              <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
                <path d="M6 2v4M6 8.5v.5" stroke="white" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
            )}
            {article.trusted ? "신뢰" : "주의"}
          </div>
        )}
      </div>

      {/* 본문 */}
      <div className="flex flex-col flex-1 p-4 overflow-hidden">
        <p className="text-xs font-semibold text-[#5b9cf6] mb-1">{article.timeAgo}</p>

        {active && (
          <h3 className="text-[15px] font-bold text-gray-900 leading-snug mb-2 line-clamp-2">
            {article.title}
          </h3>
        )}

        {/* 태그 */}
        <div className={`flex flex-wrap gap-2 ${active ? "mb-2" : "mt-1"}`}>
          {article.tags.map((tag) => (
            <span
              key={tag}
              className="text-xs text-[#3B91F4] bg-[#EEF8FF] border-[0.96px] border-[#3B91F4] rounded-[5px] px-3 py-1"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* 카테고리 */}
        {active && article.category && (
          <div className="mt-auto pt-1">
            <span className="text-xs font-semibold text-[#8f8f8f] bg-[#f5f5f5] rounded-[5px] px-2 py-1">
              {article.category}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default NewsCard;
