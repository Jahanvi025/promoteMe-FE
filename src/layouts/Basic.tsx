import { Box, Theme, useTheme } from "@mui/material";
import { Outlet } from "react-router-dom";
import { createStyles } from "@mui/styles";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import { BiMenu } from "react-icons/bi";
import { useEffect, useRef, useState } from "react";

const Basic = () => {
  const theme = useTheme();
  const styles = useStyle(theme);

  const [showSidebar, setShowSidebar] = useState(false);
  const handleSidebar = () => {
    setShowSidebar(!showSidebar);
  };

  const sidebarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target as Node)
      ) {
        setShowSidebar(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <Box sx={styles.root}>
      <Header />
      <Box sx={styles.menuButton}>
        <BiMenu onClick={handleSidebar} />
      </Box>
      <Box ref={sidebarRef}>
        <Sidebar showSidebar={showSidebar} setShowSidebar={setShowSidebar} />
      </Box>

      <Outlet />
    </Box>
  );
};

export default Basic;

const useStyle = (theme: Theme) =>
  createStyles({
    root: {
      height: "100%",
      width: "100%",
      [theme.breakpoints.up("md")]: {
        backgroundColor: theme.palette.primary.contrastText,
      },
      position: "relative",
    },
    menuButton: {
      marginLeft: "5px",
      position: "fixed",
      display: "none",
      top: "110px",
      [theme.breakpoints.down(900)]: {
        display: "block",
      },
      [theme.breakpoints.down(600)]: {
        top: "60px",
        zIndex: 20,
      },

      "& svg": {
        fontSize: "25px",

        [theme.breakpoints.down(600)]: {
          fontSize: "35px",
        },
      },
    },
  });
