import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import { userService } from "../../services/user";
import type { CharacterItem } from "../../types/api";
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
  itemCode?: string;
}

const CHARACTERS: Character[] = [
  {
    id: "1",
    name: "아이슈",
    price: 0,
    image: mascot,
    filter: "none",
    category: "색상",
    itemCode: "AISSUE",
  },
  {
    id: "2",
    name: "잔망슈",
    price: 200,
    image: mascot,
    filter: "hue-rotate(305deg) saturate(1.1) brightness(1.2)",
    category: "색상",
    itemCode: "JANMANG",
  },
  {
    id: "3",
    name: "선셋슈",
    price: 400,
    image: mascot,
    filter: "hue-rotate(155deg) saturate(0.9) brightness(1.1)",
    category: "색상",
    itemCode: "SUNSET",
  },
  {
    id: "4",
    name: "레트로슈",
    price: 350,
    image: mascot,
    filter: "hue-rotate(40deg) saturate(0.85) brightness(1.1)",
    category: "색상",
    itemCode: "RETRO",
  },
  {
    id: "5",
    name: "달콤슈",
    price: 300,
    image: mascot,
    filter: "hue-rotate(225deg) saturate(0.85) brightness(1.2)",
    category: "색상",
    itemCode: "SWEET",
  },
  {
    id: "6",
    name: "쿨슈",
    price: 250,
    image: mascot,
    filter: "hue-rotate(345deg) saturate(1.0) brightness(1.1)",
    category: "색상",
    itemCode: "COOL",
  },
  {
    id: "h1",
    name: "망고 모자",
    price: 200,
    image: hat1,
    heroImage: mascotHat1,
    filter: "none",
    category: "모자",
    itemCode: "MANGO_HAT",
  },
  {
    id: "h2",
    name: "베레모",
    price: 150,
    image: hat2,
    heroImage: mascotHat2,
    filter: "none",
    category: "모자",
    itemCode: "BERET",
  },
  {
    id: "h3",
    name: "곰 후드",
    price: 300,
    image: hat3,
    heroImage: mascotHat3,
    filter: "none",
    category: "모자",
    itemCode: "BEAR_HOOD",
  },
  {
    id: "h4",
    name: "신사 모자",
    price: 250,
    image: hat4,
    heroImage: mascotHat4,
    filter: "none",
    category: "모자",
    itemCode: "GENTLEMEN_HAT",
  },
  {
    id: "h5",
    name: "야구 모자",
    price: 150,
    image: hat5,
    heroImage: mascotHat5,
    filter: "none",
    category: "모자",
    itemCode: "BASEBALL_CAP",
  },
  {
    id: "h6",
    name: "헤드폰",
    price: 300,
    image: hat6,
    heroImage: mascotHat6,
    filter: "none",
    category: "모자",
    itemCode: "HEADPHONE",
  },
  {
    id: "f1",
    name: "기본",
    price: 0,
    image: mascot,
    filter: "none",
    category: "얼굴",
    itemCode: "BASIC",
  },
  {
    id: "f2",
    name: "행복",
    price: 100,
    image: mascotHappy,
    filter: "none",
    category: "얼굴",
    itemCode: "HAPPY",
  },
  {
    id: "f3",
    name: "장난",
    price: 100,
    image: mascotFunny,
    filter: "none",
    category: "얼굴",
    itemCode: "MISCHIEF",
  },
  {
    id: "f4",
    name: "슬픔",
    price: 100,
    image: mascotSad,
    filter: "none",
    category: "얼굴",
    itemCode: "SAD",
  },
  {
    id: "f5",
    name: "화남",
    price: 150,
    image: mascotAngry,
    filter: "none",
    category: "얼굴",
    itemCode: "ANGRY",
  },
  {
    id: "f6",
    name: "예민",
    price: 150,
    image: mascotGlare,
    filter: "none",
    category: "얼굴",
    itemCode: "SENSITIVE",
  },
  {
    id: "f7",
    name: "피곤",
    price: 100,
    image: mascotTired,
    filter: "none",
    category: "얼굴",
    itemCode: "TIRED",
  },
  {
    id: "c1",
    name: "브라운 셔츠",
    price: 200,
    image: brownshirts,
    heroImage: mascotBrownshirts,
    filter: "none",
    category: "옷",
    itemCode: "BROWN_SHIRT",
  },
  {
    id: "c2",
    name: "그린 셔츠",
    price: 200,
    image: greenshirts,
    heroImage: mascotGreenshirts,
    filter: "none",
    category: "옷",
    itemCode: "GREEN_SHIRT",
  },
  {
    id: "c3",
    name: "파자마",
    price: 250,
    image: pajama,
    heroImage: mascotPajama,
    filter: "none",
    category: "옷",
    itemCode: "PAJAMA",
  },
  {
    id: "c4",
    name: "바지",
    price: 150,
    image: pants,
    heroImage: mascotPants,
    filter: "none",
    category: "옷",
    itemCode: "PANTS",
  },
  {
    id: "c5",
    name: "핑크 스커트",
    price: 200,
    image: pinkskirt,
    heroImage: mascotPinkskirt,
    filter: "none",
    category: "옷",
    itemCode: "PINK_SKIRT",
  },
  {
    id: "c6",
    name: "정장",
    price: 350,
    image: suit,
    heroImage: mascotSuit,
    filter: "none",
    category: "옷",
    itemCode: "SUIT",
  },
];

// 포인트 배지 (카드용 소형)
const PointBadgeSm = ({
  price,
  owned,
  equipped,
}: {
  price: number;
  owned: boolean;
  equipped: boolean;
}) => (
  <div
    className={`flex items-center justify-center border border-[var(--color-primary)] rounded-full py-0.5 gap-0.5 ${owned ? "px-4" : "pl-3 pr-1.5"}`}
  >
    <span className="text-[16px] font-bold text-[var(--color-primary)] leading-[1.6]">
      {equipped ? "착용중" : owned ? "보유중" : price}
    </span>
    {!owned && (
      <div className="w-[18px] h-[18px] rounded-full bg-[var(--color-primary-bg)] flex items-center justify-center shrink-0">
        <span className="text-[10px] font-bold text-[var(--color-primary)]">
          P
        </span>
      </div>
    )}
  </div>
);

// 캐릭터 카드
interface CharacterCardProps {
  character: Character;
  selected: boolean;
  owned: boolean;
  equipped: boolean;
  onSelect: () => void;
}

const CharacterCard = ({
  character,
  selected,
  owned,
  equipped,
  onSelect,
}: CharacterCardProps) => (
  <button
    onClick={onSelect}
    className="relative flex flex-col items-center justify-end rounded-[15px] overflow-hidden cursor-pointer active:opacity-80 transition-opacity"
    style={{
      width: "100%",
      height: 212,
      background: equipped ? "var(--color-primary-bg)" : "#FBFBFB",
      border: selected
        ? "1.5px solid var(--color-primary)"
        : "1px solid #F5F5F5",
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
      <PointBadgeSm price={character.price} owned={owned} equipped={equipped} />
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
  // 카테고리별 현재 착용 중인 캐릭터 id
  const [equippedIds, setEquippedIds] = useState<
    Partial<Record<string, string>>
  >({});
  // 보유한 아이템 id (기본 제공 + 구매 완료)
  const [ownedIds, setOwnedIds] = useState<Set<string>>(
    () => new Set(CHARACTERS.filter((c) => c.price === 0).map((c) => c.id)),
  );
  const [purchaseError, setPurchaseError] = useState<string | null>(null);
  const [purchasing, setPurchasing] = useState(false);
  const [toast, setToast] = useState<{ msg: string; exiting: boolean } | null>(
    null,
  );

  useEffect(() => {
    const main = document.querySelector("main");
    if (main) main.scrollTop = 0;
  }, []);

  // 마운트 시 전체 캐릭터 정보 로드
  useEffect(() => {
    userService
      .getCharacter()
      .then((data) => {
        // 보유 아이템 초기화
        const owned = new Set(
          data.items
            .filter((item) => item.purchased)
            .flatMap((item) => {
              const char = CHARACTERS.find((c) => c.itemCode === item.key);
              return char ? [char.id] : [];
            }),
        );
        setOwnedIds(owned);

        // 착용 중인 아이템으로 선택 상태 초기화
        const equipped: Partial<Record<string, string>> = {};
        const slots: Array<
          [CharacterItem | null, string, (id: string | null) => void]
        > = [
          [data.equipped.hat, "모자", setSelectedHatId],
          [data.equipped.face, "얼굴", setSelectedFaceId],
          [data.equipped.clothes, "옷", setSelectedClothId],
          [data.equipped.color, "색상", setSelectedColorId],
        ];
        for (const [slotItem, category, setSelected] of slots) {
          if (!slotItem) continue;
          const char = CHARACTERS.find((c) => c.itemCode === slotItem.key);
          if (char) {
            equipped[category] = char.id;
            setSelected(char.id);
          }
        }
        setEquippedIds(equipped);
      })
      .catch(() => {});
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
    if (character.category === "모자") setSelectedHatId(character.id);
    else if (character.category === "얼굴") setSelectedFaceId(character.id);
    else if (character.category === "색상") setSelectedColorId(character.id);
    else if (character.category === "옷") setSelectedClothId(character.id);
    setPurchaseError(null);
  };

  const handleCategoryChange = (cat: string) => {
    if (cat === activeCategory) return;
    // 착용하지 않은 상태로 탭 이동 시 현재 카테고리 선택 초기화
    const equippedId = equippedIds[activeCategory] ?? null;
    const selId = getSelectedId(activeCategory);
    if (selId !== equippedId) {
      if (activeCategory === "모자") setSelectedHatId(equippedId);
      else if (activeCategory === "얼굴") setSelectedFaceId(equippedId);
      else if (activeCategory === "색상") setSelectedColorId(equippedId);
      else if (activeCategory === "옷") setSelectedClothId(equippedId);
    }
    setPurchaseError(null);
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

  // 선택된 아이템이 현재 착용 중인 아이템인지
  const isCurrentEquipped =
    !!currentSelected && equippedIds[activeCategory] === currentSelected.id;

  // 선택된 아이템을 보유 중인지
  const isCurrentOwned = !!currentSelected && ownedIds.has(currentSelected.id);

  const setEquipped = (category: string, id: string | null) => {
    setEquippedIds((prev) => ({ ...prev, [category]: id ?? undefined }));
  };

  const showToast = (msg: string) => {
    setToast({ msg, exiting: false });
    setTimeout(
      () => setToast((prev) => (prev ? { ...prev, exiting: true } : null)),
      1500,
    );
    setTimeout(() => setToast(null), 1500);
  };

  const handlePurchase = async () => {
    if (!currentSelected?.itemCode || purchasing) return;
    setPurchaseError(null);
    setPurchasing(true);
    try {
      await userService.purchaseItem(currentSelected.itemCode);
      setOwnedIds((prev) => new Set([...prev, currentSelected.id]));
      await userService.equipItem(currentSelected.itemCode);
      setEquipped(currentSelected.category, currentSelected.id);
      showToast(`${currentSelected.name} 구매 완료!`);
    } catch (e) {
      const status = (e as { status?: number }).status;
      if (status === 409) {
        setOwnedIds((prev) => new Set([...prev, currentSelected.id]));
        try {
          await userService.equipItem(currentSelected.itemCode);
          setEquipped(currentSelected.category, currentSelected.id);
        } catch {
          setPurchaseError("착용에 실패했습니다.");
        }
      } else if (status === 400) {
        setPurchaseError("구매할 수 없는 아이템입니다.");
      } else {
        setPurchaseError("포인트가 부족하거나 구매에 실패했습니다.");
      }
    } finally {
      setPurchasing(false);
    }
  };

  const handleEquip = async () => {
    if (!currentSelected?.itemCode) return;
    try {
      await userService.equipItem(currentSelected.itemCode);
      setEquipped(currentSelected.category, currentSelected.id);
      showToast(`${currentSelected.name} 착용 완료!`);
    } catch {
      // 착용 실패 시 UI 변경 없음
    }
  };

  const handleUnequip = async () => {
    if (!currentSelected) return;
    try {
      if (currentSelected.category === "색상") {
        await userService.equipItem("AISSUE");
      } else if (currentSelected.category === "얼굴") {
        await userService.equipItem("BASIC");
      } else if (currentSelected.category === "모자") {
        await userService.unequipItem("HAT");
      } else if (currentSelected.category === "옷") {
        await userService.unequipItem("CLOTHES");
      }
      if (currentSelected.category === "색상") {
        const defaultColor = CHARACTERS.find((c) => c.itemCode === "AISSUE");
        setSelectedColorId(defaultColor?.id ?? null);
      }
      setEquipped(currentSelected.category, null);
      showToast(`${currentSelected.name} 해제 완료!`);
    } catch {
      // 해제 실패 시 UI 변경 없음
    }
  };

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
    <>
      {toast &&
        createPortal(
          <div
            className={`fixed left-1/2 top-1/2 z-[9999] pointer-events-none ${toast.exiting ? "animate-toast-out" : "animate-toast-in"}`}
            style={{ transform: "translate(-50%, -50%)" }}
          >
            <div
              className="bg-white rounded-2xl px-6 py-5 flex flex-col items-center gap-3 min-w-[200px]"
              style={{ boxShadow: "0 8px 40px rgba(0,0,0,0.18)" }}
            >
              <div
                className="w-14 h-14 rounded-full flex items-center justify-center"
                style={{ backgroundColor: "var(--color-primary-bg)" }}
              >
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M20 6L9 17l-5-5"
                    stroke="var(--color-primary)"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <p className="text-[15px] font-bold text-[#1A1A1A] text-center">
                {toast.msg}
              </p>
            </div>
          </div>,
          document.body,
        )}
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
              style={{ filter: heroFilter }}
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
                  background:
                    activeCategory === cat ? "#E3E8EA" : "transparent",
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
            className="grid grid-cols-2 gap-[6px] px-5 pt-2"
            style={{ paddingBottom: 16 }}
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
                    selected={
                      getSelectedId(character.category) === character.id
                    }
                    owned={ownedIds.has(character.id)}
                    equipped={equippedIds[character.category] === character.id}
                    onSelect={() => handleSelect(character)}
                  />
                </div>
              ),
            )}
          </div>
        </div>

        {createPortal(
          <div
            className="w-full bg-white border-t border-[#F0F0F0] shadow-[0_-4px_12px_rgba(0,0,0,0.06)] px-5 py-3 transition-all duration-300 ease-out overflow-hidden"
            style={{
              maxHeight:
                currentSelected &&
                !(
                  isCurrentEquipped &&
                  (activeCategory === "색상" || activeCategory === "얼굴")
                )
                  ? "120px"
                  : "0px",
              paddingTop:
                currentSelected &&
                !(
                  isCurrentEquipped &&
                  (activeCategory === "색상" || activeCategory === "얼굴")
                )
                  ? undefined
                  : "0",
              paddingBottom:
                currentSelected &&
                !(
                  isCurrentEquipped &&
                  (activeCategory === "색상" || activeCategory === "얼굴")
                )
                  ? undefined
                  : "0",
            }}
          >
            {isCurrentOwned ? (
              // 보유 중인 아이템
              activeCategory === "색상" || activeCategory === "얼굴" ? (
                // 색상/얼굴: 해제 없이 착용하기만
                <button
                  onClick={handleEquip}
                  className="w-full h-[50px] rounded-[10px] text-[16px] font-bold text-white bg-[var(--color-primary)] active:opacity-80 transition-opacity"
                >
                  {currentSelected!.name} 착용하기
                </button>
              ) : isCurrentEquipped ? (
                // 모자/옷: 해제 가능
                <button
                  onClick={handleUnequip}
                  className="w-full h-[50px] rounded-[10px] text-[16px] font-bold text-white bg-[#FF6B6B] active:opacity-80 transition-opacity"
                >
                  {currentSelected!.name} 해제하기
                </button>
              ) : (
                <button
                  onClick={handleEquip}
                  className="w-full h-[50px] rounded-[10px] text-[16px] font-bold text-white bg-[var(--color-primary)] active:opacity-80 transition-opacity"
                >
                  {currentSelected!.name} 착용하기
                </button>
              )
            ) : (
              <div className="flex flex-col gap-1.5">
                {purchaseError && (
                  <p className="text-[13px] text-[#FF6B6B] text-center">
                    {purchaseError}
                  </p>
                )}
                <button
                  onClick={handlePurchase}
                  disabled={purchasing}
                  className="w-full h-[50px] rounded-[10px] text-[16px] font-bold text-white bg-[var(--color-primary)] active:opacity-80 transition-opacity disabled:opacity-60"
                >
                  {purchasing
                    ? "처리 중..."
                    : currentSelected
                      ? `${currentSelected.name} 구매하기 (${currentSelected.price}P)`
                      : ""}
                </button>
              </div>
            )}
          </div>,
          document.getElementById("bottom-action-bar") ?? document.body,
        )}
      </div>
    </>
  );
};

export default CharacterShopPage;
