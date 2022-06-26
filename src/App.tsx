import React, { useEffect, useState } from "react";
import "./App.css";
import WebFont from "webfontloader";
import { ThemeProvider } from "styled-components";
import { useTheme } from "./theme/useTheme";
import Router from "./router/Router";
import { GlobalStyles } from "./theme/GlobalStyles";

function App(props: any): JSX.Element {
  const { theme, themeLoaded, getFonts } = useTheme();
  const [selectedTheme, setSelectedTheme] = useState(theme);

  useEffect(() => {
    setSelectedTheme(theme);
  }, [themeLoaded]);

  useEffect(() => {
    WebFont.load({
      google: {
        api: "https://fonts.googleapis.com/css2",
        families: getFonts(),
      },
    });
  }, []);

  return (
    <>
      {themeLoaded && (
        <ThemeProvider theme={selectedTheme}>
          <GlobalStyles />
          <Router near={props} />
        </ThemeProvider>
      )}
    </>
  );
}

export default App;
