import { Box } from "@mui/system";
import { Theme, Typography, useTheme } from "@mui/material";
import { createStyles } from "@mui/styles";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../store/reducers/authReducer";
import { RootState } from "../store/store";
// import { useGetUnseenCountQuery } from "../services/api";

interface Props {
  Icon: React.FC<React.SVGProps<SVGSVGElement>>;
  name: string;
  selectedMenuItem: number;
  index: number;
  setSelectedMenuItem: (value: number) => void;
  setShowSidebar: (value: boolean) => void;
}

function MenuItem(props: Props) {
  const {
    Icon,
    name,
    index,
    selectedMenuItem,
    setSelectedMenuItem,
    setShowSidebar,
  } = props;
  const theme = useTheme();
  const navigate = useNavigate();

  const dispatch = useDispatch();
  const styles = useStyles(theme, index, selectedMenuItem);

  const location = useLocation();
  const userIdFromPath = location.pathname.split("/")[2];

  const role = useSelector(
    (state: RootState) => state.auth.user?.lastActiveRole
  );

  useEffect(() => {
    const isMongoId = (id: string) => /^[0-9a-fA-F]{24}$/.test(id);

    if (location.pathname === "/feed" || location.pathname === "feed") {
      setSelectedMenuItem(0);
    } else if (location.pathname === "/add-post" && role === "CREATOR") {
      setSelectedMenuItem(1);
    } else if (
      (location.pathname === "/search" && role === "FAN") ||
      (location.pathname.startsWith("/profile/") && isMongoId(userIdFromPath))
    ) {
      setSelectedMenuItem(1);
    } else if (location.pathname === "/messages") {
      setSelectedMenuItem(2);
    } else if (location.pathname === "/profile") {
      setSelectedMenuItem(3);
    } else if (location.pathname === "/account" && role === "CREATOR") {
      setSelectedMenuItem(4);
    } else if (location.pathname === "/change-password") {
      setSelectedMenuItem(role === "CREATOR" ? 5 : 4);
    }
  }, [location.pathname]);

  const handleMenuItem = () => {
    setSelectedMenuItem(index);
    setShowSidebar(false);
    if (name === "Add post") navigate("/add-post");
    else if (name === "Feed") navigate("/feed");
    else if (name === "Logout") {
      dispatch(logout());
      navigate("/login");
    } else if (name === "Message") navigate("/messages");
    else if (name === "Profile") navigate("/profile");
    else if (name === "Account") navigate("/account");
    else if (name === "Change Password") navigate("/change-password");
    else if (name === "Search") navigate("/search");
  };

  // const { data } = useGetUnseenCountQuery();
  // dispatch(setMessageCount({ count: data?.data?.unseenCount || 0 }));

  // const unseenCount = useSelector(
  //   (state: RootState) => state.auth.messageCount
  // );

  return (
    <Box
      component="div"
      onClick={handleMenuItem}
      sx={styles.sidebarOption}
      px={2}
      py={1.5}
    >
      <Box sx={styles.innerContainer}>
        <Box sx={styles.innerContainerIcon}>
          <Icon
            color={
              index === selectedMenuItem ? "white" : theme.palette.primary.light
            }
          />
        </Box>
        <Typography sx={styles.name}>{name}</Typography>
      </Box>
      {/* {name === "Message" && unseenCount > 0 && (
        <Box sx={styles.notificationCounter} p={0.5}>
          <Typography fontSize={15} lineHeight={0}>
            {unseenCount}
          </Typography>
        </Box>
      )} */}
    </Box>
  );
}

export default MenuItem;

const useStyles = (theme: Theme, index: number, selectedMenuItem: number) => {
  const isSelected = index === selectedMenuItem;
  const primary = theme.palette.primary;
  return createStyles({
    sidebarOption: {
      display: "flex",
      flexDirection: "row",
      margin: "0 auto",
      alignItems: "center",
      backgroundColor: isSelected ? primary.main : primary.contrastText,
      borderRadius: 4,
      cursor: "pointer",
      justifyContent: "space-between",
      [theme.breakpoints.down(1000)]: {
        padding: "10px 16px",
      },
      [theme.breakpoints.down(600)]: {
        padding: "15px 16px",
      },
    },
    name: {
      color: isSelected ? primary.contrastText : primary.light,
    },
    innerContainer: {
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      zIndex: "101",
    },
    notificationCounter: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      lineHeight: 0,
      borderRadius: "50%",
      backgroundColor: isSelected ? primary.contrastText : primary.main,
      color: isSelected ? primary.main : primary.contrastText,
      height: 18,
      width: 18,
    },
    innerContainerIcon: {
      marginRight: 2,
      display: "flex",

      [theme.breakpoints.down(1000)]: {
        marginRight: 1,
      },
      "& path": {
        stroke: isSelected ? "white" : "gray",
      },
    },
  });
};
