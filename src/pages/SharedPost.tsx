import { Avatar, Box } from "@mui/material";
import headerimage from "../assets/png/headerimage.png";
import { createStyles } from "@mui/styles";
import theme from "../themes";
import UserProfileContainer from "../components/UserProfileContainer";
import { useEffect, useState } from "react";
import Post from "../components/Post";
import { useGetPostByIdQuery, useGetUserQuery } from "../services/api";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";

const SharedPost = () => {
  const [user, setUser] = useState<GetUserResponse["data"]["user"] | null>(
    null
  );

  const params = useParams();

  const { data } = useGetPostByIdQuery({
    id: params.postId || "",
  });

  const post = data?.data?.post;

  const {
    data: userData,
    isSuccess,
    isError,
    error,
  } = useGetUserQuery(
    {
      creatorId: post?.user_id._id,
    },
    { skip: !post?.user_id._id }
  );

  useEffect(() => {
    if (isSuccess) {
      setUser(userData.data?.user);
    }
    if (isError) {
      const Error = error as ApiError;
      toast.error(Error.data?.message);
    }
  }, [isSuccess, isError]);

  const styles = useStyles();
  return (
    <Box>
      <Box sx={styles.container}>
        <Avatar src={headerimage} alt="header-image" sx={styles.headerImage} />
      </Box>

      <Box sx={styles.innerContainer}>
        <Box sx={styles.profileCardContainer} mb={2}>
          <Box width="100%">
            <UserProfileContainer user={user} role={"CREATOR"} width="100%" />
          </Box>
        </Box>
        <Box sx={styles.postContainer}>
          {post && <Post {...post} isPurchased={false} />}
        </Box>
      </Box>
    </Box>
  );
};

export default SharedPost;

const useStyles = () =>
  createStyles({
    container: {
      position: "fixed",
      top: 0,
      zIndex: 100,
    },
    headerImage: {
      width: "100vw",
      height: "80px",
      [theme.breakpoints.down(600)]: {
        height: "60px",
      },
    },
    profileCardContainer: {
      width: "30%",
      maxWidth: "300px",
      display: "flex",
      justifyContent: "center",
      alignItems: "flex-start",
      [theme.breakpoints.down(700)]: {
        display: "none",
      },
    },
    innerContainer: {
      display: "flex",
      marginTop: "115px",
      marginLeft: "20px",
      gap: "40px",
      [theme.breakpoints.down(700)]: {
        alignItems: "center",
        marginTop: "100px",
      },
      [theme.breakpoints.down(600)]: {
        marginLeft: "2%",
        marginTop: "80px",
      },
    },
    postContainer: {
      width: "60%",
      [theme.breakpoints.down(900)]: {
        width: "70%",
      },
      [theme.breakpoints.down(700)]: {
        width: "100%",
      },
    },
  });
