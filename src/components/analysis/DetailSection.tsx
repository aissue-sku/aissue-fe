interface SubItem {
  label: string;
  score: number;
}

interface Props {
  title: string;
  score: number;
  maxScore: number;
  items: SubItem[];
  isLast?: boolean;
}

const DetailSection = ({ title, score, maxScore, items, isLast }: Props) => (
  <div className={`flex flex-col gap-2 pb-3 ${!isLast ? "border-b border-[#E5E5E5]" : ""}`}>
    <div className="relative flex items-center" style={{ minHeight: 21 }}>
      <div className="absolute left-0 top-[6px] w-2 h-2 rounded-full bg-[#51A2FF]" />
      <p className="pl-4 text-[14px] font-medium text-[#1A1A1A]">
        {title} ({score}/{maxScore}점)
      </p>
    </div>
    <div className="flex flex-col gap-2 pl-1">
      {items.map((item) => (
        <div key={item.label} className="flex items-center justify-between">
          <span className="text-[13px] text-[#5E5E5E]">{item.label}</span>
          <span className="text-[13px] text-[#1A1A1A]">{item.score}점</span>
        </div>
      ))}
    </div>
  </div>
);

export default DetailSection;
