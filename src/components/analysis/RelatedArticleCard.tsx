interface Props {
  title: string;
  url?: string;
  publisher: string;
  timeAgo: string;
  trustScore: number;
}

const RelatedArticleCard = ({ title, url, publisher, timeAgo, trustScore }: Props) => (
  <div
    className="bg-[#FBFBFB] border border-[#E5E5E5] rounded-[12px] px-5 py-[15px] flex flex-col gap-2 cursor-pointer active:opacity-75 transition-opacity"
    onClick={() => url && window.open(url, "_blank", "noopener,noreferrer")}
  >
    <div className="flex items-start justify-between gap-3">
      <p className="text-[14px] font-medium text-[#1A1A1A] flex-1 leading-[1.5]">{title}</p>
      <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        className="shrink-0 mt-0.5"
      >
        <path
          d="M3.5 12.5L12.5 3.5M12.5 3.5H6.5M12.5 3.5V9.5"
          stroke="#1A1A1A"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <span className="text-[12px] font-medium text-[#8F8F8F]">{publisher}</span>
        <span className="text-[14px] text-[#E5E5E5] leading-none">•</span>
        <span className="text-[12px] font-medium text-[#8F8F8F]">{timeAgo}</span>
      </div>
      <div className="flex items-center gap-1.5">
        <div className="bg-[#E5E5E5] h-[6px] w-10 rounded-full overflow-hidden">
          <div
            className="bg-[var(--color-primary)] h-full rounded-full"
            style={{ width: `${trustScore}%` }}
          />
        </div>
        <span className="text-[11px] font-semibold text-[var(--color-primary)]">{trustScore}</span>
      </div>
    </div>
  </div>
);

export default RelatedArticleCard;
