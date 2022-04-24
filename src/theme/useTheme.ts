import { useEffect, useState } from "react";
import THEMES from "./THEME_DECLARATIONS";
import _ from "lodash";
import { DefaultTheme } from "styled-components";

export const useTheme = () => {
  const themes: { [key: string]: DefaultTheme } = THEMES;
  const [theme, setTheme] = useState(themes.default);
  const [themeLoaded, setThemeLoaded] = useState(false);

  const getFonts = () => {
    const allFonts = _.values(_.mapValues(themes, "font"));
    return allFonts;
  };

  useEffect(() => {
    setTheme(themes.default);
    setThemeLoaded(true);
  }, []);

  return { theme, setTheme, themeLoaded, getFonts };
};
