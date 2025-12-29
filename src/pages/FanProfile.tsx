import { Box } from "@mui/material";
import PageHeader from "../components/PageHeader";
import { createStyles } from "@mui/styles";
import theme from "../themes";
import FanProfileTabs from "../components/FanProfileTabs";

export default function FanProfile() {
  const styles = useStyles();

  return (
    <Box sx={styles.container} mr={"3%"}>
      <PageHeader title="Profile" isProfile />
      <Box sx={styles.innerContainer}>
        <FanProfileTabs />
      </Box>
    </Box>
  );
}

const useStyles = () =>
  createStyles({
    container: {
      marginLeft: "24%",
      position: "sticky",
      top: "109px",
      marginTop: "110px",
      [theme.breakpoints.down(1000)]: {
        marginLeft: "25%",
      },
      [theme.breakpoints.down(900)]: {
        marginLeft: "5%",
      },
      [theme.breakpoints.down(600)]: {
        marginLeft: "3%",
        marginTop: "65px",
      },
    },
    innerContainer: {
      display: "flex",
      flexDirection: "row",
    },
  });
