import headerimage from "../assets/png/headerimage.png";
import fanHeaderimage from "../assets/png/fanPortalheader.png";
import { createStyles } from "@mui/styles";
import { Avatar, Box } from "@mui/material";
import theme from "../themes";
import { RootState, useAppSelector } from "../store/store";

const Header = () => {
  const styles = useStyles();
  const role = useAppSelector(
    (state: RootState) => state?.auth?.user?.lastActiveRole
  );

  return (
    <Box sx={styles.container}>
      <Avatar
        src={role === "CREATOR" ? headerimage : fanHeaderimage}
        alt="header-image"
        sx={styles.headerImage}
      />
    </Box>
  );
};

export default Header;

const useStyles = () =>
  createStyles({
    container: {
      position: "fixed",
      top: 0,
      zIndex: 100,
    },
    headerImage: {
      width: "100vw",
      height: "100px",
      [theme.breakpoints.down(600)]: {
        height: "60px",
      },
    },
  });
