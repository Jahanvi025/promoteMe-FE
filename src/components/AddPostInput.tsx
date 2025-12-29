import { Avatar, Box, IconButton } from "@mui/material";
import EmojiPicker from "emoji-picker-react";
import { useRef } from "react";
import EmojiEmotionsIcon from "@mui/icons-material/EmojiEmotions";
import { createStyles } from "@mui/styles";
// import useAutosizeTextArea from "../hooks/useAutosizeTextArea";

interface Props {
  postText: string;
  isEmojiOpen: boolean;
  postType: PostContentType;
  setIsEmojiOpen: (value: boolean) => void;
  setPostText: (value: string) => void;
  emojiPickerRef?: React.RefObject<HTMLDivElement>;
}

export default function AddPostInput(props: Props) {
  const {
    postText,
    isEmojiOpen,
    postType,
    setIsEmojiOpen,
    setPostText,
    emojiPickerRef,
  } = props;
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const styles = useStyles();
  // useAutosizeTextArea(textAreaRef.current, postText);

  const handleEmojiContainer = (
    event:
      | React.MouseEvent<HTMLTextAreaElement, MouseEvent>
      | React.MouseEvent<HTMLButtonElement, MouseEvent>,
    value: boolean
  ) => {
    event.stopPropagation();
    setIsEmojiOpen(value);
  };

  return (
    <Box sx={styles.textBox} padding={0.5}>
      {postType === "TEXT" && <Avatar sx={{ borderRadius: "50%" }} />}
      <Box
        component="textarea"
        ref={textAreaRef}
        value={postText}
        rows={postType === "TEXT" ? 1 : 3}
        onChange={(e) => setPostText(e.target.value)}
        onClick={(e) => handleEmojiContainer(e, false)}
        sx={styles.textArea}
        placeholder={
          postType === "TEXT" ? "Share something" : "Compose new post"
        }
      />
      <Box sx={{ display: "flex", alignItems: "flex-end" }}>
        <IconButton
          onClick={(e) => {
            handleEmojiContainer(e, !isEmojiOpen);
          }}
        >
          <EmojiEmotionsIcon
            sx={{
              color: isEmojiOpen
                ? "rgba(12, 143, 252, 1)"
                : "rgba(184, 180, 180, 1)",
            }}
          />
        </IconButton>
      </Box>
      <Box ref={emojiPickerRef}>
        <EmojiPicker
          searchDisabled
          onEmojiClick={(e) => setPostText(postText + e.emoji)}
          open={isEmojiOpen}
          lazyLoadEmojis
          style={{
            position: "absolute",
            top: "110%",
            right: 0,
            zIndex: 999999,
            maxWidth: "350px",
            width: "45vw",
            maxHeight: "350px",
          }}
        />
      </Box>
    </Box>
  );
}

const useStyles = () =>
  createStyles({
    textBox: {
      display: "flex",
      flexDirection: "row",
      backgroundColor: "rgba(255, 255, 255, 1)",
      borderRadius: 6,
      position: "relative",
    },
    textArea: {
      border: "none",
      width: "95%",
      marginLeft: 1,
      marginRight: 1,
      fontSize: 16,
      paddingX: 1,
      paddingTop: "10px",
      minHeight: 24,
      fontWeight: 400,
      // overflowY: "auto",
      scrollbarWidth: "none",
      resize: "none",
      color: "rgba(171, 168, 168, 1)",
    },
  });
