import { useState, useEffect } from "react";
import { userService } from "../services/user";
import mascot from "../assets/mascot.png";
import mascotHappy from "../assets/mascot-happy.png";
import mascotFunny from "../assets/mascot-funny.png";
import mascotSad from "../assets/mascot-sad.png";
import mascotAngry from "../assets/mascot-angry.png";
import mascotGlare from "../assets/mascot-glare.png";
import mascotTired from "../assets/mascot-tired.png";
import mascotHat1 from "../assets/mascot-hat1.png";
import mascotHat2 from "../assets/mascot-hat2.png";
import mascotHat3 from "../assets/mascot-hat3.png";
import mascotHat4 from "../assets/mascot-hat4.png";
import mascotHat5 from "../assets/mascot-hat5.png";
import mascotHat6 from "../assets/mascot-hat6.png";
import mascotBrownshirts from "../assets/mascot-brownshirts.png";
import mascotGreenshirts from "../assets/mascot-greenshirts.png";
import mascotPajama from "../assets/mascot-pajama.png";
import mascotPants from "../assets/mascot-pants.png";
import mascotPinkskirt from "../assets/mascot-pinkskirt.png";
import mascotSuit from "../assets/mascot-suit.png";

const FACE_IMAGES: Record<string, string> = {
  BASIC: mascot,
  HAPPY: mascotHappy,
  MISCHIEF: mascotFunny,
  SAD: mascotSad,
  ANGRY: mascotAngry,
  SENSITIVE: mascotGlare,
  TIRED: mascotTired,
};

const HAT_IMAGES: Record<string, string> = {
  MANGO_HAT: mascotHat1,
  BERET: mascotHat2,
  BEAR_HOOD: mascotHat3,
  GENTLEMEN_HAT: mascotHat4,
  BASEBALL_CAP: mascotHat5,
  HEADPHONE: mascotHat6,
};

const CLOTHES_IMAGES: Record<string, string> = {
  BROWN_SHIRT: mascotBrownshirts,
  GREEN_SHIRT: mascotGreenshirts,
  PAJAMA: mascotPajama,
  PANTS: mascotPants,
  PINK_SKIRT: mascotPinkskirt,
  SUIT: mascotSuit,
};

const COLOR_FILTERS: Record<string, string> = {
  AISSUE:  "none",
  JANMANG: "hue-rotate(305deg) saturate(1.1) brightness(1.2)",
  SUNSET:  "hue-rotate(155deg) saturate(0.9) brightness(1.1)",
  RETRO:   "hue-rotate(40deg) saturate(0.85) brightness(1.1)",
  SWEET:   "hue-rotate(225deg) saturate(0.85) brightness(1.2)",
  COOL:    "hue-rotate(345deg) saturate(1.0) brightness(1.1)",
};

const THEME_COLORS: Record<string, string> = {
  AISSUE:  "#51A2FF",
  JANMANG: "#10E7B8",
  SUNSET:  "#FF8D63",
  RETRO:   "#B297FF",
  SWEET:   "#9EC938",
  COOL:    "#3EBDFF",
};

function lightenColor(hex: string, alpha: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `#${Math.round(255 + (r - 255) * alpha).toString(16).padStart(2, "0")}${Math.round(255 + (g - 255) * alpha).toString(16).padStart(2, "0")}${Math.round(255 + (b - 255) * alpha).toString(16).padStart(2, "0")}`;
}

function hexToRgba(hex: string, alpha: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}

function applyTheme(hex: string, filter: string) {
  const root = document.documentElement;
  root.style.setProperty("--color-primary", hex);
  root.style.setProperty("--color-primary-bg", lightenColor(hex, 0.1));
  root.style.setProperty("--color-primary-border", lightenColor(hex, 0.3));
  root.style.setProperty("--color-primary-filter", filter);
  root.style.setProperty("--color-primary-shadow", hexToRgba(hex, 0.2));
}

export interface MascotConfig {
  filter: string;
  faceImage: string;
  hatImage: string | null;
  clothImage: string | null;
  themeColor: string;
}

let cachedTheme: { hex: string; filter: string } | null = null;

export function useMascotConfig(): MascotConfig {
  const [config, setConfig] = useState<MascotConfig>(() => {
    if (cachedTheme) applyTheme(cachedTheme.hex, cachedTheme.filter);
    return {
      filter: cachedTheme?.filter ?? "none",
      faceImage: mascot,
      hatImage: null,
      clothImage: null,
      themeColor: cachedTheme?.hex ?? "#51A2FF",
    };
  });

  useEffect(() => {
    if (!cachedTheme) applyTheme("#51A2FF", "none");
    userService.getCharacter().then((data) => {
      const colorKey = data.equipped.color?.key ?? "AISSUE";
      const themeColor = THEME_COLORS[colorKey] ?? "#51A2FF";
      const filter = COLOR_FILTERS[colorKey] ?? "none";
      cachedTheme = { hex: themeColor, filter };
      applyTheme(themeColor, filter);
      setConfig({
        filter,
        faceImage: FACE_IMAGES[data.equipped.face?.key ?? "BASIC"] ?? mascot,
        hatImage: data.equipped.hat ? (HAT_IMAGES[data.equipped.hat.key] ?? null) : null,
        clothImage: data.equipped.clothes ? (CLOTHES_IMAGES[data.equipped.clothes.key] ?? null) : null,
        themeColor,
      });
    }).catch(() => {});
  }, []);

  return config;
}
