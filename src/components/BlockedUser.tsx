import { Avatar, Box, Button, Typography } from "@mui/material";
import { createStyles } from "@mui/styles";
import theme from "../themes";

interface Props {
  id: string;
  name: string;
  userName: string;
  profilePicture?: string;
  setSelectedUser: (value: string) => void;
  setSelectedUserId: (value: string) => void;
}

export default function BlockedUser(props: Props) {
  const {
    name,
    userName,
    profilePicture,
    setSelectedUser,
    id,
    setSelectedUserId,
  } = props;
  const styles = useStyles();

  const handleUnblock = () => {
    setSelectedUser(name);
    setSelectedUserId(id);
  };

  return (
    <Box sx={styles.container}>
      <Box sx={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
        <Avatar
          alt="user-picture"
          src={profilePicture}
          sx={{ height: 50, width: 50, borderRadius: 3, marginRight: 2 }}
        />
        <Box>
          <Typography fontSize={16} fontWeight={500}>
            {name}
          </Typography>
          <Typography fontSize={14} color="rgba(126, 126, 126, 1)">
            {userName}
          </Typography>
        </Box>
      </Box>
      <Button
        onClick={handleUnblock}
        variant="contained"
        sx={{
          borderRadius: 5,
          height: 40,
          fontWeight: 400,
          boxShadow: "unset",
        }}
      >
        Unblock
      </Button>
    </Box>
  );
}

const useStyles = () =>
  createStyles({
    container: {
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      width: "35%",
      justifyContent: "space-between",
      height: 70,

      [theme.breakpoints.down(1200)]: {
        width: "40%",
      },
      [theme.breakpoints.down(1000)]: {
        width: "47%",
      },
      [theme.breakpoints.down(600)]: {
        width: "100%",
      },
    },
  });
