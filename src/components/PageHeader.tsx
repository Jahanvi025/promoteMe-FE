import {
  Box,
  Typography,
  useTheme,
  Theme,
  IconButton,
  Button,
  Backdrop,
  CircularProgress,
} from "@mui/material";
import { createStyles } from "@mui/styles";
import { ReactComponent as BackIcon } from "../assets/svg/backArrow.svg";
import { ReactComponent as ForwardIcon } from "../assets/svg/forwardArrow.svg";
import { useAppDispatch, useAppSelector } from "../store/store";
import { useEffect, useState } from "react";
import { useSwitchProfileMutation } from "../services/api";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { switchUserProfile } from "../store/reducers/authReducer";

interface Props {
  title: string;
  isTrendingCard?: boolean;
  selectedPage?: number;
  setSelectedPage?: (value: number) => void;
  trendingUserCount?: number;
  isProfile?: boolean;
  width?: string;
}

export default function PageHeader(props: Props) {
  const {
    title,
    selectedPage,
    isTrendingCard,
    setSelectedPage,
    trendingUserCount,
    isProfile,
    width,
  } = props;
  const theme = useTheme();
  const styles = useStyles(theme, width);

  const role = useAppSelector((state) => state?.auth?.user?.lastActiveRole);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [isBackdropOpen, setBackdropOpen] = useState(false);

  const [
    switchProfile,
    {
      isSuccess: isSwitchSuccess,
      isError: isSwitchError,
      error: switchError,
      data: switchedUser,
    },
  ] = useSwitchProfileMutation();

  const totalPages =
    role === "FAN"
      ? (trendingUserCount || 2) / 2
      : (trendingUserCount || 3) / 3;

  const handleTrendingNavigation = (isNext: boolean) => {
    if (isNext && selectedPage! < totalPages - 1)
      setSelectedPage!(selectedPage! + 1);
    else if (!isNext && selectedPage! > 0) setSelectedPage!(selectedPage! - 1);
  };

  const handleSwitch = () => {
    setBackdropOpen(true);
    switchProfile();
  };

  useEffect(() => {
    if (isSwitchSuccess) {
      navigate("/feed");
      dispatch(
        switchUserProfile({
          lastActiveRole: switchedUser?.data?.lastActiveRole,
        })
      );
      toast.success(
        `Switched to ${
          role === "FAN" ? "Creator" : "Fan"
        } profile successfully!`,
        {
          delay: 100,
        }
      );
    }

    if (isSwitchError) {
      const errorMessage = switchError as ApiError;
      toast.error(errorMessage.data.message);
    }

    setBackdropOpen(false);
  }, [isSwitchError, isSwitchSuccess]);

  return (
    <Box sx={styles.container} marginY={1}>
      <Typography sx={styles.title}>{title}</Typography>
      {isTrendingCard && (
        <Box>
          <IconButton
            disabled={selectedPage === 0}
            onClick={() => handleTrendingNavigation(false)}
            sx={styles.iconButton}
          >
            <BackIcon color="black" />
          </IconButton>
          <IconButton
            disabled={selectedPage === totalPages}
            onClick={() => handleTrendingNavigation(true)}
            sx={{ ...styles.iconButton, marginLeft: 1 }}
          >
            <ForwardIcon />
          </IconButton>
        </Box>
      )}

      {isProfile && (
        <Button
          variant="contained"
          sx={{ boxShadow: "unset" }}
          onClick={handleSwitch}
        >
          {`Switch to ${role === "CREATOR" ? "Fan" : "Creator"}`}
        </Button>
      )}

      <Backdrop sx={{ color: "#fff", zIndex: 999 }} open={isBackdropOpen}>
        <CircularProgress color="inherit" />
        <Typography variant="h6" sx={{ ml: 2 }}>
          Switching Profile...
        </Typography>
      </Backdrop>
    </Box>
  );
}

const useStyles = (theme: Theme, width: string | undefined) => {
  const primary = theme.palette.primary;
  return createStyles({
    container: {
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      [theme.breakpoints.down(900)]: {
        width: "100%",
      },
      [theme.breakpoints.down(600)]: {
        position: "relative",
        left: "35px",
        width: width ? width : "90%",
      },
    },
    title: {
      fontWeight: 600,
      fontSize: "25px",
      color: primary.dark,
      [theme.breakpoints.down(1000)]: {
        fontSize: "19px",
      },
    },
    iconButton: {
      height: 40,
      width: 40,
      border: "1px solid rgba(119, 118, 122, 1)",

      [theme.breakpoints.down(900)]: {
        height: 30,
        width: 30,
      },
    },
  });
};
