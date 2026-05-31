import { useState, useEffect } from "react";
import { userService } from "../services/user";

const COLOR_FILTERS: Record<string, string> = {
  AISSUE:  "none",
  JANMANG: "hue-rotate(305deg) saturate(1.1) brightness(1.2)",
  SUNSET:  "hue-rotate(155deg) saturate(0.9) brightness(1.1)",
  RETRO:   "hue-rotate(40deg) saturate(0.85) brightness(1.1)",
  SWEET:   "hue-rotate(225deg) saturate(0.85) brightness(1.2)",
  COOL:    "hue-rotate(345deg) saturate(1.0) brightness(1.1)",
};

export function useMascotFilter() {
  const [filter, setFilter] = useState("none");

  useEffect(() => {
    userService
      .getProfile()
      .then((profile) => {
        setFilter(COLOR_FILTERS[profile.color] ?? "none");
      })
      .catch(() => {});
  }, []);

  return filter;
}
