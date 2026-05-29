import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import mascot from "../../assets/mascot.png";
import mascotGlass from "../../assets/mascot-glass.png";
import mascotHand from "../../assets/mascot-hand.png";
import hat1 from "../../assets/hat1.png";
import hat2 from "../../assets/hat2.png";
import hat3 from "../../assets/hat3.png";
import hat4 from "../../assets/hat4.png";
import hat5 from "../../assets/hat5.png";
import hat6 from "../../assets/hat6.png";
import mascotHat1 from "../../assets/mascot-hat1.png";
import mascotHat2 from "../../assets/mascot-hat2.png";
import mascotHat3 from "../../assets/mascot-hat3.png";
import mascotHat4 from "../../assets/mascot-hat4.png";
import mascotHat5 from "../../assets/mascot-hat5.png";
import mascotHat6 from "../../assets/mascot-hat6.png";
import mascotHappy from "../../assets/mascot-happy.png";
import mascotFunny from "../../assets/mascot-funny.png";
import mascotSad from "../../assets/mascot-sad.png";
import mascotAngry from "../../assets/mascot-angry.png";
import mascotGlare from "../../assets/mascot-glare.png";
import mascotTired from "../../assets/mascot-tired.png";
import brownshirts from "../../assets/brownshirts.png";
import greenshirts from "../../assets/greenshirts.png";
import pajama from "../../assets/pajama.png";
import pants from "../../assets/pants.png";
import pinkskirt from "../../assets/pinkskirt.png";
import suit from "../../assets/suit.png";
import mascotBrownshirts from "../../assets/mascot-brownshirts.png";
import mascotGreenshirts from "../../assets/mascot-greenshirts.png";
import mascotPajama from "../../assets/mascot-pajama.png";
import mascotPants from "../../assets/mascot-pants.png";
import mascotPinkskirt from "../../assets/mascot-pinkskirt.png";
import mascotSuit from "../../assets/mascot-suit.png";

const CATEGORIES = ["모자", "얼굴", "옷", "색상", "기타"];

interface Character {
  id: string;
  name: string;
  price: number;
  image: string;
  heroImage?: string;
  filter: string;
  category: string;
}

const CHARACTERS: Character[] = [
  {
    id: "1",
    name: "아이슈",
    price: 0,
    image: mascot,
    filter: "none",
    category: "색상",
  },
  {
    id: "2",
    name: "잔망슈",
    price: 200,
    image: mascot,
    filter: "hue-rotate(305deg) saturate(1.1) brightness(1.2)",
    category: "색상",
  },
  {
    id: "3",
    name: "선셋슈",
    price: 400,
    image: mascot,
    filter: "hue-rotate(155deg) saturate(0.9) brightness(1.1)",
    category: "색상",
  },
  {
    id: "4",
    name: "레트로슈",
    price: 350,
    image: mascot,
    filter: "hue-rotate(40deg) saturate(0.85) brightness(1.1)",
    category: "색상",
  },
  {
    id: "5",
    name: "달콤슈",
    price: 300,
    image: mascot,
    filter: "hue-rotate(225deg) saturate(0.85) brightness(1.2)",
    category: "색상",
  },
  {
    id: "6",
    name: "쿨슈",
    price: 250,
    image: mascot,
    filter: "hue-rotate(345deg) saturate(1.0) brightness(1.1)",
    category: "색상",
  },
  {
    id: "h1",
    name: "망고 모자",
    price: 200,
    image: hat1,
    heroImage: mascotHat1,
    filter: "none",
    category: "모자",
  },
  {
    id: "h2",
    name: "베레모",
    price: 150,
    image: hat2,
    heroImage: mascotHat2,
    filter: "none",
    category: "모자",
  },
  {
    id: "h3",
    name: "곰 후드",
    price: 300,
    image: hat3,
    heroImage: mascotHat3,
    filter: "none",
    category: "모자",
  },
  {
    id: "h4",
    name: "신사 모자",
    price: 250,
    image: hat4,
    heroImage: mascotHat4,
    filter: "none",
    category: "모자",
  },
  {
    id: "h5",
    name: "야구 모자",
    price: 200,
    image: hat5,
    heroImage: mascotHat5,
    filter: "none",
    category: "모자",
  },
  {
    id: "h6",
    name: "헤드폰",
    price: 350,
    image: hat6,
    heroImage: mascotHat6,
    filter: "none",
    category: "모자",
  },
  {
    id: "f1",
    name: "기본",
    price: 0,
    image: mascot,
    filter: "none",
    category: "얼굴",
  },
  {
    id: "f2",
    name: "행복",
    price: 200,
    image: mascotHappy,
    filter: "none",
    category: "얼굴",
  },
  {
    id: "f3",
    name: "장난",
    price: 200,
    image: mascotFunny,
    filter: "none",
    category: "얼굴",
  },
  {
    id: "f4",
    name: "슬픔",
    price: 200,
    image: mascotSad,
    filter: "none",
    category: "얼굴",
  },
  {
    id: "f5",
    name: "화남",
    price: 250,
    image: mascotAngry,
    filter: "none",
    category: "얼굴",
  },
  {
    id: "f6",
    name: "예민",
    price: 250,
    image: mascotGlare,
    filter: "none",
    category: "얼굴",
  },
  {
    id: "f7",
    name: "피곤",
    price: 200,
    image: mascotTired,
    filter: "none",
    category: "얼굴",
  },
  {
    id: "c1",
    name: "브라운 셔츠",
    price: 200,
    image: brownshirts,
    heroImage: mascotBrownshirts,
    filter: "none",
    category: "옷",
  },
  {
    id: "c2",
    name: "그린 셔츠",
    price: 200,
    image: greenshirts,
    heroImage: mascotGreenshirts,
    filter: "none",
    category: "옷",
  },
  {
    id: "c3",
    name: "파자마",
    price: 250,
    image: pajama,
    heroImage: mascotPajama,
    filter: "none",
    category: "옷",
  },
  {
    id: "c4",
    name: "바지",
    price: 150,
    image: pants,
    heroImage: mascotPants,
    filter: "none",
    category: "옷",
  },
  {
    id: "c5",
    name: "핑크 스커트",
    price: 200,
    image: pinkskirt,
    heroImage: mascotPinkskirt,
    filter: "none",
    category: "옷",
  },
  {
    id: "c6",
    name: "정장",
    price: 350,
    image: suit,
    heroImage: mascotSuit,
    filter: "none",
    category: "옷",
  },
];

// 포인트 배지 (카드용 소형)
const PointBadgeSm = ({ price }: { price: number }) => (
  <div
    className={`flex items-center justify-center border border-[#51A2FF] rounded-full py-0.5 gap-0.5 ${price === 0 ? "px-4" : "pl-3 pr-1.5"}`}
  >
    <span className="text-[16px] font-bold text-[#3B91F4] leading-[1.6]">
      {price === 0 ? "보유중" : price}
    </span>
    {price > 0 && (
      <div className="w-[18px] h-[18px] rounded-full bg-[#EEF8FF] flex items-center justify-center shrink-0">
        <span className="text-[10px] font-bold text-[#3B91F4]">P</span>
      </div>
    )}
  </div>
);

// 캐릭터 카드
interface CharacterCardProps {
  character: Character;
  selected: boolean;
  onSelect: () => void;
}

const CharacterCard = ({
  character,
  selected,
  onSelect,
}: CharacterCardProps) => (
  <button
    onClick={onSelect}
    className="relative flex flex-col items-center justify-end bg-[#FBFBFB] rounded-[15px] overflow-hidden cursor-pointer active:opacity-80 transition-opacity"
    style={{
      width: 172,
      height: 212,
      border: selected ? "1.5px solid #51A2FF" : "1px solid #F5F5F5",
    }}
  >
    {/* 캐릭터 이미지 */}
    <img
      src={character.image}
      alt={character.name}
      className={`absolute left-1/2 -translate-x-1/2 object-contain ${
        character.category === "모자"
          ? "top-4 w-[88px] h-[88px] object-top"
          : "top-3 w-[110px] h-[110px]"
      }`}
      style={{ filter: character.filter }}
    />
    {/* 구분선 */}
    <div
      className="absolute w-[120px] border-t border-[#E5E5E5]"
      style={{ top: 128 }}
    />
    {/* 이름 */}
    <p
      className="absolute text-[18px] font-semibold text-[#1A1A1A] text-center"
      style={{ top: 135 }}
    >
      {character.name}
    </p>
    {/* 가격 배지 */}
    <div className="absolute" style={{ bottom: 15 }}>
      <PointBadgeSm price={character.price} />
    </div>
  </button>
);

// ── 메인 페이지 ────────────────────────────────────────────────────────────
const CharacterShopPage = () => {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState("색상");
  const [selectedHatId, setSelectedHatId] = useState<string | null>(null);
  const [selectedFaceId, setSelectedFaceId] = useState<string | null>(null);
  const [selectedColorId, setSelectedColorId] = useState<string | null>(null);
  const [selectedClothId, setSelectedClothId] = useState<string | null>(null);
  const [isExiting, setIsExiting] = useState(false);
  const [equippedMode, setEquippedMode] = useState(false);

  useEffect(() => {
    const main = document.querySelector("main");
    if (main) main.scrollTop = 0;
  }, []);

  const selectedHat = CHARACTERS.find((c) => c.id === selectedHatId);
  const selectedFace = CHARACTERS.find((c) => c.id === selectedFaceId);
  const selectedColor = CHARACTERS.find((c) => c.id === selectedColorId);
  const selectedCloth = CHARACTERS.find((c) => c.id === selectedClothId);

  const getSelectedId = (category: string) => {
    if (category === "모자") return selectedHatId;
    if (category === "얼굴") return selectedFaceId;
    if (category === "색상") return selectedColorId;
    if (category === "옷") return selectedClothId;
    return null;
  };

  const handleSelect = (character: Character) => {
    const wasSelected = getSelectedId(character.category) === character.id;
    setEquippedMode(wasSelected && character.price === 0);
    // 이미 선택된 아이템도 항상 선택 유지 (해제는 플로팅 버튼으로)
    if (character.category === "모자") setSelectedHatId(character.id);
    else if (character.category === "얼굴") setSelectedFaceId(character.id);
    else if (character.category === "색상") setSelectedColorId(character.id);
    else if (character.category === "옷") setSelectedClothId(character.id);
  };

  const handleUnequip = () => {
    if (!currentSelected) return;
    if (currentSelected.category === "모자") setSelectedHatId(null);
    else if (currentSelected.category === "얼굴") setSelectedFaceId(null);
    else if (currentSelected.category === "색상") setSelectedColorId(null);
    else if (currentSelected.category === "옷") setSelectedClothId(null);
    setEquippedMode(false);
  };

  const handleCategoryChange = (cat: string) => {
    if (cat === activeCategory) return;
    // 착용하지 않은 상태로 탭 이동 시 현재 카테고리 선택 초기화
    if (!equippedMode && currentSelected) {
      if (activeCategory === "모자") setSelectedHatId(null);
      else if (activeCategory === "얼굴") setSelectedFaceId(null);
      else if (activeCategory === "색상") setSelectedColorId(null);
      else if (activeCategory === "옷") setSelectedClothId(null);
    }
    setEquippedMode(false);
    setActiveCategory(cat);
  };

  // 현재 카테고리에서 선택된 캐릭터 (버튼용)
  const currentSelected =
    activeCategory === "모자"
      ? selectedHat
      : activeCategory === "얼굴"
        ? selectedFace
        : activeCategory === "색상"
          ? selectedColor
          : activeCategory === "옷"
            ? selectedCloth
            : undefined;

  // 히어로 합성
  const heroBase = selectedFace ? selectedFace.image : mascot;
  const heroHat = selectedHat?.heroImage ?? selectedHat?.image ?? null;
  const heroCloth = selectedCloth?.heroImage ?? selectedCloth?.image ?? null;
  const heroFilter = selectedColor?.filter ?? "none";

  const handleBack = () => {
    setIsExiting(true);
    setTimeout(() => navigate(-1), 280);
  };

  return (
    <div
      className={`flex flex-col min-h-full ${isExiting ? "animate-slide-out" : "animate-slide-in"}`}
      style={{
        background: "linear-gradient(to bottom, #FBFBFB 55%, #E1F3FF 100%)",
      }}
    >
      {/* 헤더 (fixed) */}
      <header className="fixed top-6 left-0 right-0 z-10 h-16 flex items-end justify-center px-5 pb-3 bg-transparent">
        <button
          onClick={handleBack}
          className="absolute left-5 bottom-3 p-1 cursor-pointer active:opacity-60 transition-opacity"
          aria-label="뒤로 가기"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path
              d="M15 18l-6-6 6-6"
              stroke="#1A1A1A"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
        <h1 className="text-[18px] font-semibold text-[#1A1A1A] tracking-[-0.45px]">
          캐릭터 상점
        </h1>
      </header>

      {/* 히어로: 마스코트 */}
      <div className="flex flex-col items-center pt-32 pb-6">
        <div className="relative w-28 h-28">
          {/* 베이스 마스코트 (색상 필터 적용) */}
          <img
            src={heroBase}
            alt="아이슈 마스코트"
            className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1 w-[90%] h-auto"
            style={{ filter: heroFilter, transition: "filter 0.3s ease" }}
          />
          {/* 옷 오버레이 */}
          {heroCloth && (
            <img
              src={heroCloth}
              alt=""
              className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1 w-[90%] h-auto"
            />
          )}
          {/* 모자 오버레이 */}
          {heroHat && (
            <img
              src={heroHat}
              alt=""
              className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1 w-[90%] h-auto"
            />
          )}
          <img
            src={mascotGlass}
            alt=""
            className="absolute top-[10%] left-[16%] w-[70%] h-auto animate-glasses"
            style={{ filter: heroFilter }}
          />
          <img
            src={mascotHand}
            alt=""
            className="absolute top-[20%] left-[75%] w-[38%] h-auto animate-hand"
            style={{ filter: heroFilter }}
          />
        </div>
      </div>

      {/* 흰색 바텀 시트 */}
      <div
        className="flex-1 bg-white shadow-[0px_-2px_4px_0px_rgba(0,0,0,0.1)]"
        style={{ borderRadius: "20px 20px 0 0" }}
      >
        {/* 카테고리 탭 */}
        <div className="flex gap-px items-center px-5 pt-4 pb-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => handleCategoryChange(cat)}
              className="flex items-center justify-center h-[31px] px-[10px] rounded-[30px] cursor-pointer transition-colors"
              style={{
                background: activeCategory === cat ? "#E3E8EA" : "transparent",
              }}
            >
              <span className="text-[14px] font-semibold text-[#303D4C] tracking-[0.35px] whitespace-nowrap">
                {cat}
              </span>
            </button>
          ))}
        </div>

        {/* 캐릭터 그리드 */}
        <div
          key={activeCategory}
          className="grid gap-[6px] px-5 pt-2"
          style={{
            gridTemplateColumns: "repeat(2, 172px)",
            paddingBottom: 60,
          }}
        >
          {CHARACTERS.filter((c) => c.category === activeCategory).map(
            (character, index) => (
              <div
                key={character.id}
                style={{
                  animation: `card-enter 420ms cubic-bezier(0.34, 1.4, 0.64, 1) ${index * 55}ms both`,
                }}
              >
                <CharacterCard
                  character={character}
                  selected={getSelectedId(character.category) === character.id}
                  onSelect={() => handleSelect(character)}
                />
              </div>
            ),
          )}
        </div>
      </div>

      {createPortal(
        <div
          className="fixed bottom-16 left-0 right-0 z-50 bg-white border-t border-[#F0F0F0] shadow-[0_-4px_12px_rgba(0,0,0,0.06)] px-5 py-3 transition-transform duration-300 ease-out"
          style={{
            transform: currentSelected ? "translateY(0)" : "translateY(300%)",
          }}
        >
          {currentSelected && currentSelected.price === 0 ? (
            equippedMode ? (
              <button
                onClick={handleUnequip}
                className="w-full h-[50px] rounded-[10px] text-[16px] font-bold text-white bg-[#FF6B6B] active:opacity-80 transition-opacity"
              >
                {currentSelected.name} 해제하기
              </button>
            ) : (
              <button
                onClick={() => setEquippedMode(true)}
                className="w-full h-[50px] rounded-[10px] text-[16px] font-bold text-white bg-[#51A2FF] active:opacity-80 transition-opacity"
              >
                {currentSelected.name} 착용하기
              </button>
            )
          ) : (
            <button className="w-full h-[50px] rounded-[10px] text-[16px] font-bold text-white bg-[#51A2FF] active:opacity-80 transition-opacity">
              {currentSelected
                ? `${currentSelected.name} 구매하기 (${currentSelected.price}P)`
                : ""}
            </button>
          )}
        </div>,
        document.body,
      )}
    </div>
  );
};

export default CharacterShopPage;
