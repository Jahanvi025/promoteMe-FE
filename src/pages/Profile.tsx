import { Box } from "@mui/material";
import PageHeader from "../components/PageHeader";
import { createStyles } from "@mui/styles";
import ProfileTabs from "../components/ProfileTabs";
import theme from "../themes";
import { useGetUserQuery } from "../services/api";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useAppSelector } from "../store/store";
import UserProfileContainer from "../components/UserProfileContainer";
import { useParams } from "react-router-dom";

export default function Profile() {
  const [user, setUser] = useState<GetUserResponse["data"]["user"] | null>(
    null
  );
  const { userId } = useParams<{ userId: string }>();

  const { isSuccess, isError, error, data, refetch } = useGetUserQuery({
    creatorId: userId ? userId : "",
  });

  const role = useAppSelector((state) => state.auth?.user?.lastActiveRole);
  const styles = useStyles();
  // const location = useLocation();

  useEffect(() => {
    if (
      data?.data?.user?.isFan &&
      data?.data?.user?.isCreator &&
      !data?.data?.user?.category_id
    ) {
      toast.info(
        "Your profile is incomplete, kindly update your Creator Profile",
        {
          delay: 100,
        }
      );
    }
  }, [data]);

  useEffect(() => {
    refetch();
  }, []);

  useEffect(() => {
    if (isSuccess) {
      setUser(data.data.user);
    }

    if (isError) {
      const errorMessage = error as ApiError;
      toast.error(errorMessage.data.message);
    }
  }, [isSuccess, isError, data]);

  return (
    <Box sx={styles.outerContainer}>
      <PageHeader title={role === "CREATOR" ? "Profile" : "Creator Profile"} />
      <Box sx={styles.container}>
        <Box sx={styles.profileCardContainer} mb={2}>
          <Box width="100%">
            <UserProfileContainer
              user={user}
              role={role || "CREATOR"}
              width="100%"
            />
          </Box>
        </Box>
        <Box sx={styles.rightContainer}>
          <ProfileTabs />
        </Box>
      </Box>
    </Box>
  );
}

const useStyles = () =>
  createStyles({
    outerContainer: {
      marginLeft: "24%",
      overflowY: "scroll",
      scrollbarWidth: "none",
      position: "sticky",
      top: "109px",
      marginTop: "105px",
      [theme.breakpoints.down(900)]: {
        marginLeft: "5%",
        marginTop: "102px",
      },
      [theme.breakpoints.down(600)]: {
        marginTop: "57px",
        marginLeft: "2%",
      },
    },
    container: {
      display: "flex",
      flexDirection: "row",
      gap: 5,
      marginLeft: "2px",
      marginRight: "20px",
      [theme.breakpoints.down(700)]: {
        gap: 2,
      },
      [theme.breakpoints.down(600)]: {
        flexDirection: "column",
        marginRight: "10px",
      },
    },
    profileCardContainer: {
      width: "30%",
      display: "flex",
      justifyContent: "center",
      alignItems: "flex-start",
      [theme.breakpoints.down(700)]: {
        width: "35%",
      },
      [theme.breakpoints.down(600)]: {
        width: "100%",
      },
    },
    rightContainer: {
      width: "64%",
      [theme.breakpoints.down(600)]: {
        width: "100%",
      },
    },

    button: {
      marginTop: 2,
      boxShadow: "unset",
      borderRadius: "6px",
    },
  });
