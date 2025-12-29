import { Avatar, Box, Typography } from "@mui/material";
import { createStyles } from "@mui/styles";
import DefaultCoverImage from "../assets/png/defaultCoverImage.png";
import theme from "../themes";
import { useNavigate } from "react-router-dom";

interface Props {
  name: string;
  username: string;
  cover_picture?: string;
  profile_image: string;
  userId: string;
}

export default function ProfileCard(props: Props) {
  const { name, username, profile_image, cover_picture, userId } = props;
  const styles = useStyles(cover_picture ? cover_picture : DefaultCoverImage);

  const navigate = useNavigate();

  const handleClick = (userId: string) => {
    navigate(`/profile/${userId}`);
  };

  return (
    <>
      <Box sx={styles.container} onClick={() => handleClick(userId)}>
        <Box sx={styles.coverSection}>
          <Avatar src={profile_image} sx={styles.profilePicture}></Avatar>
        </Box>
        <Box sx={styles.userInfo}>
          <Typography fontWeight={500} fontSize={14}>
            {name}
          </Typography>
          <Typography fontSize={12} fontWeight={400} color={"#00000080"}>
            {username}
          </Typography>
        </Box>
      </Box>
    </>
  );
}

const useStyles = (cover_picture: string | undefined) =>
  createStyles({
    container: {
      backgroundColor: "#FFFFFF",
      display: "flex",
      flexDirection: "column",
      width: "220px",
      height: "200px",
      alignItems: "center",
      borderRadius: 4,
      justifyContent: "flexStart",
      cursor: "pointer",
      boxShadow: "0px 1px 50px rgba(0, 0, 0, 0.05)",
      [theme.breakpoints.down(1366)]: {
        width: "195px",
      },
      [theme.breakpoints.down(1080)]: {
        width: "220px",
      },
      [theme.breakpoints.down(950)]: {
        width: "200px",
      },
      [theme.breakpoints.down(900)]: {
        width: "220px",
      },
      [theme.breakpoints.down(750)]: {
        width: "190px",
      },
      [theme.breakpoints.down(650)]: {
        width: "220px",
      },
      [theme.breakpoints.down(500)]: {
        width: "180px",
      },
      [theme.breakpoints.down(400)]: {
        width: "160px",
      },
    },
    coverSection: {
      height: "45%",
      width: "100%",
      backgroundImage: `url(${cover_picture})`,
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      borderRadius: "20px 20px 0px 0px",
      position: "relative",
    },
    userInfo: {
      marginTop: "20%",
      width: "100%",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      gap: "0px",
    },
    profilePicture: {
      width: "77px",
      height: "77px",
      borderRadius: "50%",
      border: "3px solid #FFFFFF",
      position: "absolute",
      top: "50%",
    },
  });
