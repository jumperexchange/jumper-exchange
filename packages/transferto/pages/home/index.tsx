import { Button, Typography } from "@mui/material";
import { Link } from "@transferto/shared/atoms/link";
import { useIsMobile, useLocales } from "@transferto/shared/hooks";
import { theme } from "@transferto/shared/theme";
import { useEffect, useState } from "react";

export default function Home() {
  const { allLangs, translate, currentLang, onChangeLang } = useLocales();
  const isMobile: boolean = useIsMobile();
  const [mobileActive, setMobileActive] = useState(false);

  const handleChangeLang = () => {
    if (currentLang.value === "en") {
      onChangeLang("de");
    }
    if (currentLang.value === "de") {
      onChangeLang("en");
    }
  };

  useEffect(() => {
    setMobileActive(isMobile);
  }, [isMobile]);

  return (
    <>
      <div>
        <button onClick={handleChangeLang}>change language</button>
        <p>Current Lang: {currentLang.value}</p>
        <p>{translate("Home.HomeHero.introduction")}</p>
      </div>
      <Typography variant="h1">
        is mobile? {mobileActive ? "true" : "false"}
      </Typography>
      <Typography
        variant="h2"
        style={{ color: `${theme?.palette?.brandPrimary.main}` }}
        gutterBottom
      >
        Welcome to Typography
      </Typography>
      <p>Just Text...</p>
      <Button sx={{ width: "90%" }} variant="contained" color="brandPrimary">
        Hello World
      </Button>
      <Link url="https://transferto.xyz">Welcome to transferto.xyz</Link>;
    </>
  );
}
