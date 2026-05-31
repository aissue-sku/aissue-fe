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

export interface MascotConfig {
  filter: string;
  faceImage: string;
  hatImage: string | null;
  clothImage: string | null;
}

export function useMascotConfig(): MascotConfig {
  const [config, setConfig] = useState<MascotConfig>({
    filter: "none",
    faceImage: mascot,
    hatImage: null,
    clothImage: null,
  });

  useEffect(() => {
    userService.getCharacter().then((data) => {
      setConfig({
        filter: COLOR_FILTERS[data.equipped.color?.key ?? "AISSUE"] ?? "none",
        faceImage: FACE_IMAGES[data.equipped.face?.key ?? "BASIC"] ?? mascot,
        hatImage: data.equipped.hat ? (HAT_IMAGES[data.equipped.hat.key] ?? null) : null,
        clothImage: data.equipped.clothes ? (CLOTHES_IMAGES[data.equipped.clothes.key] ?? null) : null,
      });
    }).catch(() => {});
  }, []);

  return config;
}
