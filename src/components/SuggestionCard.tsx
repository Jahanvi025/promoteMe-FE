import { Avatar, Box, Button, Typography, useMediaQuery } from "@mui/material";
import { createStyles } from "@mui/styles";
import { useNavigate } from "react-router-dom";
import theme from "../themes";
import { SlUserFollow } from "react-icons/sl";

interface Props {
  profilePicture: string;
  name: string;
  username: string;
  userId: string;
}

const SuggestionCard = (props: Props) => {
  const { profilePicture, name, username, userId } = props;
  const styles = useStyles();
  const isTablet = useMediaQuery(theme.breakpoints.down(1100));
  const isMobile = useMediaQuery(theme.breakpoints.down(800));

  const navigate = useNavigate();

  const handleSubscribe = () => {
    navigate(`/profile/${userId}`);
  };

  return (
    <Box sx={styles.container}>
      <Box sx={styles.leftContainer}>
        <Avatar
          src={profilePicture}
          sx={styles.profilePicture}
          onClick={handleSubscribe}
        ></Avatar>
        <Box>
          <Typography fontSize={15} fontWeight={500}>
            {name}
          </Typography>
          <Typography
            fontSize={12}
            color={"rgba(172, 184, 205, 1)"}
            maxWidth={"60px"}
            overflow={"hidden"}
          >
            @{username}
          </Typography>
        </Box>
      </Box>
      {!isMobile && (
        <Button
          variant="contained"
          sx={styles.button}
          onClick={handleSubscribe}
        >
          {isTablet ? <SlUserFollow /> : "Subscribe"}
        </Button>
      )}
    </Box>
  );
};

export default SuggestionCard;

const useStyles = () =>
  createStyles({
    container: {
      width: "100%",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      borderRadius: "10px",
      marginBottom: "10px",
    },
    profilePicture: {
      width: 50,
      height: 50,
      objectFit: "cover",
      borderRadius: "50%",
      cursor: "pointer",
    },
    button: {
      width: "35%",
      height: 30,
      borderRadius: "16px",
      boxShadow: "unset",
    },
    leftContainer: {
      display: "flex",
      alignItems: "center",
      gap: "10px",
    },
  });
