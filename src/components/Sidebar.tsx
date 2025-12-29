import { IconButton, Box, Typography, Avatar } from "@mui/material";
import { ReactComponent as HomeIcon } from "../assets/svg/home.svg";
import { ReactComponent as AddIcon } from "../assets/svg/add.svg";
import { ReactComponent as MessageIcon } from "../assets/svg/message.svg";
import { ReactComponent as ProfileIcon } from "../assets/svg/profile.svg";
import { ReactComponent as AccountIcon } from "../assets/svg/account.svg";
import { ReactComponent as ChangePasswordIcon } from "../assets/svg/changePassword.svg";
import { ReactComponent as LogoutIcon } from "../assets/svg/logout.svg";
import { ReactComponent as SearchIcon } from "../assets/svg/searchIcon.svg";
import { ReactComponent as WalletIcon } from "../assets/svg/walletIcon.svg";
import { ReactComponent as AddToWalletIcon } from "../assets/svg/addIcon.svg";
import { createStyles } from "@mui/styles";
import { Theme, useTheme } from "@mui/material";
import MenuItem from "./MenuItem";
import { useEffect, useState } from "react";
import { RootState, useAppDispatch, useAppSelector } from "../store/store";
import CloseIcon from "@mui/icons-material/Close";
import SidebarImage from "../assets/png/sidebarImage.png";
import { useNavigate } from "react-router-dom";
import { useGetWalletBalanceQuery } from "../services/api";
import { useSelector } from "react-redux";
import { setWalletBalance } from "../store/reducers/authReducer";

interface Props {
  showSidebar: boolean;
  setShowSidebar: (value: boolean) => void;
}

const Sidebar = (props: Props) => {
  const { showSidebar, setShowSidebar } = props;
  const theme = useTheme();
  const styles = useStyle(theme, showSidebar);
  const [selectedMenuItem, setSelectedMenuItem] = useState(0);
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const role = useAppSelector((state) => state.auth.user?.lastActiveRole);
  const navigate = useNavigate();
  const Balance = useSelector((state: RootState) => state.auth?.walletBalance);

  const fanMenuItems: IMenuItem[] = [
    {
      icon: HomeIcon,
      title: "Feed",
    },
    {
      icon: SearchIcon,
      title: "Search",
    },
    {
      icon: MessageIcon,
      title: "Message",
    },
    {
      icon: ProfileIcon,
      title: "Profile",
    },
    {
      icon: ChangePasswordIcon,
      title: "Change Password",
    },
    {
      icon: LogoutIcon,
      title: "Logout",
    },
  ];

  const creatorMenuItems: IMenuItem[] = [
    {
      icon: HomeIcon,
      title: "Feed",
    },
    {
      icon: AddIcon,
      title: "Add post",
    },
    {
      icon: MessageIcon,
      title: "Message",
    },
    {
      icon: ProfileIcon,
      title: "Profile",
    },
    {
      icon: AccountIcon,
      title: "Account",
    },
    {
      icon: ChangePasswordIcon,
      title: "Change Password",
    },
    {
      icon: LogoutIcon,
      title: "Logout",
    },
  ];

  const menuItems = role === "CREATOR" ? creatorMenuItems : fanMenuItems;

  const { data: walletBalance } = useGetWalletBalanceQuery(undefined, {
    skip: role === "CREATOR",
  });

  useEffect(() => {
    if (walletBalance?.data?.balance !== undefined) {
      dispatch(setWalletBalance({ balance: walletBalance.data.balance }));
    }
  }, [walletBalance, dispatch]);

  const handleClick = () => {
    navigate("/wallet");
    setShowSidebar(false);
  };

  return (
    <Box sx={styles.sidebarContainer} paddingX={3}>
      <IconButton sx={styles.closeIcon} onClick={() => setShowSidebar(false)}>
        <CloseIcon />
      </IconButton>
      <Box sx={styles.userSection} paddingX={3}>
        <Avatar
          alt="profile image"
          src={user?.profile_picture}
          sx={styles.profilePicture}
        />
        <Typography sx={styles.userName}>{user?.displayName}</Typography>
        <Typography sx={styles.welcomeText}>{user?.username}</Typography>
      </Box>
      {role === "FAN" && (
        <Box sx={styles.walletCard}>
          <WalletIcon />
          <Typography>${Balance}</Typography>
          <IconButton sx={{ padding: 0 }} onClick={handleClick}>
            <AddToWalletIcon />
          </IconButton>
        </Box>
      )}
      <Box paddingX={3} sx={styles.menuItemContainer}>
        {menuItems.map((item, index) => {
          return (
            <MenuItem
              key={index}
              name={item.title}
              Icon={item.icon}
              selectedMenuItem={selectedMenuItem}
              index={index}
              setSelectedMenuItem={setSelectedMenuItem}
              setShowSidebar={setShowSidebar}
            />
          );
        })}
      </Box>
      <Box sx={styles.imageContainer}>
        <Box sx={styles.sidebarImage}>
          <Box
            component="img"
            src={SidebarImage}
            sx={{
              width: "45%",
              [theme.breakpoints.down(900)]: {
                width: "35%",
              },
            }}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default Sidebar;

const useStyle = (theme: Theme, showSidebar: boolean) =>
  createStyles({
    welcomeText: {
      fontFamily: "Inter",
      fontSize: "15.05px",
      fontWeight: 400,
      lineHeight: "18.21px",
      textAlign: "left",
      color: theme.palette.primary.light,
      marginTop: "3px",
    },
    profilePicture: {
      width: "82px",
      height: "82px",
      borderRadius: "50%",
    },
    userSection: {
      width: "100%",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      marginBottom: "15px",
      [theme.breakpoints.down(600)]: {
        alignItems: "center",
        marginLeft: "-30px",
      },
    },
    sidebarContainer: {
      margin: "20px",
      position: "fixed",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      height: "90vh",
      minHeight: "550px",
      width: "15vw",
      backgroundColor: "#FFFFFF",
      boxShadow: "0px 1.5px 75.23px 0px #0000001A",
      borderRadius: "18px",
      top: 0,
      paddingTop: "1%",
      zIndex: 101,
      overflowY: "scroll",
      overflowX: "hidden",
      scrollbarWidth: "none",
      msOverflowStyle: "none",
      [theme.breakpoints.down(900)]: {
        position: "fixed",
        left: showSidebar ? "0" : "-100%",
        transition: "left 0.4s",
        width: "20vw",
      },
      [theme.breakpoints.down(700)]: {
        width: "25vw",
      },
      [theme.breakpoints.down(600)]: {
        width: "60vw",
        height: "100vh",
        borderRadius: "0",
        alignItems: "flex-start",
        paddingTop: "10px",
        margin: 0,
        left: showSidebar ? "0" : "-120%",
        top: "60px",
        overflow: "hidden",
      },
    },
    "sidebarContainer::-webkit-scrollbar": {
      display: "none",
    },
    sidebarOption: {
      width: "80%",
      display: "flex",
      flexDirection: "row",
      gap: "20px",
      margin: "0 auto",
      alignItems: "center",
    },
    userName: {
      fontFamily: "Inter",
      fontSize: "16.55px",
      fontWeight: "600",
      lineHeight: "20.03px",
      textAlign: "center",
      color: theme.palette.primary.dark,
      marginTop: "10px",
      whiteSpace: "nowrap",
      overflow: "hidden",
      [theme.breakpoints.down(600)]: {
        textAlign: "left",
      },
    },
    imageContainer: {
      position: "relative",
      height: "100%",
      width: "120%",
    },
    sidebarImage: {
      width: "190%",
      position: "absolute",
      left: "-2%",
      top: "-20px",
      [theme.breakpoints.down(1000)]: {
        width: "250%",
        top: "-15px",
      },
      [theme.breakpoints.down(600)]: {
        top: "50px",
        left: "-8%",
      },
    },
    menuItemContainer: {
      width: "16vw",
      [theme.breakpoints.down(1000)]: {
        width: "18vw",
      },
      [theme.breakpoints.down(900)]: {
        width: "22vw",
      },
      [theme.breakpoints.down(700)]: {
        width: "28vw",
      },
      [theme.breakpoints.down(600)]: {
        width: "100%",
        paddingLeft: "0px",
      },
    },
    closeIcon: {
      display: "none",
      position: "absolute",
      top: "10px",
      right: "10px",
      cursor: "pointer",
      [theme.breakpoints.down(600)]: {
        display: "block",
      },
    },

    walletCard: {
      display: "flex",
      flexDirection: "row",
      width: "70%",
      justifyContent: "space-between",
      background: "#F7F7F7",
      padding: "10px 20px",
      borderRadius: "8px",
      marginBottom: "20px",
      cursor: "pointer",
      [theme.breakpoints.down(1200)]: {
        width: "80%",
      },
    },
  });
