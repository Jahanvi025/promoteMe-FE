import { Avatar, Box, Skeleton, Typography } from "@mui/material";
import { createStyles } from "@mui/styles";
import { useAppSelector } from "../store/store";
import { getRelativeTime, wrapEmojisInSpan } from "../utils/helper";
import theme from "../themes";

interface Props {
  from: string | undefined;
  message: string;
  img: string;
  time: Date;
  images: string[];
  isLoading: boolean;
}

export default function Message(props: Props) {
  const { from, message, img, time, isLoading } = props;
  const userId = useAppSelector((state) => state.auth.user?.id);
  const isUser: boolean = from !== userId;
  const styles = useStyles(isUser);
  const formattedTime = getRelativeTime(time);

  const formattedMessage = wrapEmojisInSpan(message);
  if (isLoading) {
    return (
      <>
        {[...Array(3)].map((_, index) => (
          <Box
            key={index}
            sx={{
              ...styles.outerContainer,
              justifyContent: index % 2 === 0 ? "flex-start" : "flex-end",
            }}
          >
            <Box sx={styles.container} my={1}>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "flex-start",
                }}
              >
                <Skeleton
                  variant="rectangular"
                  width={100}
                  height={20}
                  sx={{ bgcolor: "rgba(0, 0, 0, 0.11)", borderRadius: "10px" }}
                />
              </Box>
            </Box>
          </Box>
        ))}
      </>
    );
  }

  return (
    <Box sx={styles.outerContainer}>
      <Box sx={styles.container} my={1}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            alignItems: "flex-start",
          }}
        >
          {isUser && (
            <Avatar sx={{ borderRadius: "50%", marginRight: 1 }} src={img} />
          )}
          <Box sx={styles.chatItem}>
            <Typography
              color={!isUser ? "white" : "black"}
              fontSize={15}
              sx={styles.message}
              dangerouslySetInnerHTML={{ __html: formattedMessage }}
            ></Typography>
          </Box>
        </Box>
        <Typography ml="50px" color="rgba(174, 174, 174, 1)" fontSize={13}>
          {formattedTime}
        </Typography>
      </Box>
    </Box>
  );
}

const useStyles = (isUser: boolean) =>
  createStyles({
    container: {
      display: "flex",
      flexDirection: "column",
      alignItems: !isUser ? "flex-end" : "flex-start",
      maxWidth: "70%",
    },
    outerContainer: {
      width: "100%",
      display: "flex",
      justifyContent: !isUser ? "flex-end" : "flex-start",
    },
    chatItem: {
      backgroundColor: !isUser ? "rgba(12, 143, 252, 1)" : "rgb(245 245 245)",
      padding: 1.2,
      borderRadius: 4,
      wordWrap: "break-word",
      overflowWrap: "break-word",
      maxWidth: "100%",
      height: "15px",
      display: "flex",
      alignItems: "center",
    },
    message: {
      maxWidth: "30vw",
      display: "flex",
      alignItems: "center",
      [theme.breakpoints.down(900)]: {
        maxWidth: "50vw",
      },
      [theme.breakpoints.down(600)]: {
        maxWidth: "60vw",
      },
      "& .emoji": {
        fontSize: "22px",
      },
    },
  });
