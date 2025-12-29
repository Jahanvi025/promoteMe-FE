import { Box } from "@mui/material";
import PageHeader from "../components/PageHeader";
import { createStyles } from "@mui/styles";
import AccountTabs from "../components/AccountTabs";
import theme from "../themes";

export default function Account() {
  const styles = useStyles();

  return (
    <Box sx={styles.container} mr={"3%"}>
      <PageHeader title="Account" isProfile />
      <Box sx={styles.innerContainer}>
        <AccountTabs />
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
        marginTop: "106px",
      },
      [theme.breakpoints.down(900)]: {
        marginLeft: "5%",
      },
      [theme.breakpoints.down(600)]: {
        marginLeft: "3%",
        marginTop: "62px",
      },
    },
    innerContainer: {
      display: "flex",
      flexDirection: "row",
    },
  });
