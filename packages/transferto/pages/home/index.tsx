import { Button, Typography } from "@mui/material";
import { useIsMobile } from "@transferto/shared/hooks";
import { theme } from "@transferto/shared/theme";
import { useEffect, useState } from "react";
import { Link } from "@transferto/shared/atoms/link";

export default function Home() {
  const isMobile: boolean = useIsMobile();
  const [mobileActive, setMobileActive] = useState(false);
  useEffect(() => {
    setMobileActive(isMobile);
  }, [isMobile]);
  return (
    <>
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
