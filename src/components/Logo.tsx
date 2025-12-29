import { Avatar } from "@mui/material";
import logo from "../assets/png/logo.png";
import { createStyles } from "@mui/styles";

const Logo = ({ type }: LogoProps) => {
  const styles = useStyles();
  const class_logo = type === "sidebar" ? styles.logoSidebar : {};
  return <Avatar src={logo} alt="" sx={class_logo} />;
};

export default Logo;

const useStyles = () =>
  createStyles({
    logoSidebar: {
      position: "absolute",
      top: "30px",
      height: "48px",
      width: "48px",
    },
  });
