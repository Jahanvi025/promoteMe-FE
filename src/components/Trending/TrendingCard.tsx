import { Avatar, Box, Typography } from "@mui/material";
import { createStyles } from "@mui/styles";
import theme from "../../themes";
import DefaultUserImage from "../../assets/png/defaultUserImage.png";
import { useNavigate } from "react-router-dom";
import DefaultCoverImage from "../../assets/png/defaultCoverImage.png";

export default function TrendingCard(props: TrendingUser) {
  const { cover_image, profile_picture, displayName, _id } = props;
  const styles = useStyles();
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/profile/${_id}`);
  };

  return (
    <Box sx={styles.container} mb={2}>
      <Avatar
        sx={styles.coverImage}
        alt="cover-image"
        src={cover_image ?? DefaultCoverImage}
      />
      <Box sx={styles.userCard} onClick={handleClick}>
        <Avatar
          sx={{
            height: 25,
            width: 25,
            borderRadius: "50%",
            marginRight: 1,
            cursor: "pointer",
          }}
          src={profile_picture ?? DefaultUserImage}
        />
        <Typography
          sx={{
            fontSize: 12,
            color: theme.palette.primary.dark,
            maxHeight: 25,
            fontWeight: 500,
            textOverflow: "ellipsis",
            overflow: "hidden",
            whiteSpace: "nowrap",
            cursor: "pointer",
          }}
        >
          {displayName}
        </Typography>
      </Box>
    </Box>
  );
}

const useStyles = () =>
  createStyles({
    container: {
      height: 100,
      width: "100%",
      borderRadius: 4,
      position: "relative",
    },
    coverImage: {
      height: "100%",
      width: "100%",
      borderRadius: 4,
    },
    userCard: {
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      position: "absolute",
      bottom: 5,
      left: 5,
      backgroundColor: "rgba(255, 255, 255, 1)",
      borderRadius: 10,
      width: "40%",
      padding: "2px 5px",
    },
  });
