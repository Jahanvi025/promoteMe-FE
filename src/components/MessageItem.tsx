import { Avatar, Box, Button, Typography } from "@mui/material";
import { createStyles } from "@mui/styles";
import theme from "../themes";
interface Props extends MessageItem {
  selectedChat: number;
  setSelectedChat: (value: number) => void;
  setSelectedChatId: (value: string) => void;
  setSelectedUserId: (value: string) => void;
  setShowChats: (value: boolean) => void;
  profilePicture: string;
  conversationId: string;
  selectedUserImage: (value: string) => void;
  setSelectedUserName: (value: string) => void;
  setRemainingUnseen: (value: number) => void;
  userId: string;
}

export default function MessageItem(props: Props) {
  const {
    index,
    name,
    lastMessage,
    unseen,
    selectedChat,
    setSelectedChat,
    setShowChats,
    profilePicture,
    setSelectedChatId,
    conversationId,
    selectedUserImage,
    setSelectedUserId,
    userId,
    setSelectedUserName,
    setRemainingUnseen,
  } = props;
  const styles = useStyles(selectedChat, index);

  const handleClick = () => {
    setShowChats(false);
    setSelectedChat(index);
    setSelectedChatId(conversationId);
    selectedUserImage(profilePicture);
    setSelectedUserId(userId);
    setSelectedUserName(name);
    setRemainingUnseen(unseen);
  };

  return (
    <Button onClick={handleClick} sx={styles.container}>
      <Box sx={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
        <Avatar sx={styles.profilePicture} src={profilePicture} />
        <Box>
          <Typography sx={styles.name}>{name}</Typography>
          <Typography noWrap sx={styles.lastMessage}>
            {lastMessage}
          </Typography>
        </Box>
      </Box>
      <Box>
        {unseen > 0 && (
          <Box sx={styles.counter}>
            <Typography color="white">{unseen}</Typography>
          </Box>
        )}
      </Box>
    </Button>
  );
}

const useStyles = (selectedChat: number, index: number) =>
  createStyles({
    container: {
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      backgroundColor:
        selectedChat === index ? "rgba(12, 143, 252, 0.1)" : "white",
      borderRadius: 4,
      paddingTop: 1,
      paddingBottom: 1,
      marginBottom: "5px",
      paddingRight: 2,
      textTransform: "initial",
      width: "95%",
      [theme.breakpoints.down(600)]: {
        width: "99%",
      },
    },
    name: {
      textAlign: "left",
      fontSize: 15,
      fontWeight: 500,
      color: "black",
      maxWidth: "100px",
      overflow: "hidden",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap",
    },
    counter: {
      height: 25,
      width: 25,
      backgroundColor: "rgba(12, 143, 252, 1)",
      borderRadius: "50%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    lastMessage: {
      maxWidth: "10vw",
      color: "rgba(136, 151, 173, 1)",
      textAlign: "left",
      [theme.breakpoints.down(700)]: {
        maxWidth: "13vw",
      },
    },
    profilePicture: {
      borderRadius: "50%",
      marginRight: 1.5,
      height: 40,
      width: 40,
    },
  });
