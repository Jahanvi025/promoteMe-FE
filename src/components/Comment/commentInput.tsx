import { Box, Button, IconButton, TextField } from "@mui/material";
import { ChangeEvent, useEffect, useState } from "react";
import InsertEmoticonIcon from "@mui/icons-material/InsertEmoticon";
import { createStyles } from "@mui/styles";
import EmojiPicker from "emoji-picker-react";
import { useAddCommentMutation } from "../../services/api";

interface Props {
  isEmojiOpen: boolean;
  setIsEmojiOpen: (value: boolean) => void;
  postId: string;
  refetch: () => void;
  setPage: (page: number) => void;
  setSnackbarMessage: (value: string) => void;
  setSnackbarOpen: (value: boolean) => void;
}

const CommentInput = (props: Props) => {
  const {
    isEmojiOpen,
    setIsEmojiOpen,
    postId,
    refetch,
    setPage,
    setSnackbarMessage,
    setSnackbarOpen,
  } = props;
  const [comment, setComment] = useState<string>("");

  const styles = useStyles();

  const [addComment, { isSuccess, isError, error }] = useAddCommentMutation();

  const handleCommentChange = (event: ChangeEvent<HTMLInputElement>) => {
    console.log(event.target.value, "comment");
    setComment(event.target.value);
  };

  const handleCommentSubmit = async () => {
    await addComment({ postId: postId, comment: comment });
  };

  useEffect(() => {
    if (isSuccess) {
      setSnackbarMessage("Comment added successfully");
      setSnackbarOpen(true);
      setComment("");
      setPage(1);
      refetch();
    } else if (isError) {
      const Error = error as ApiError;
      setSnackbarMessage(Error.data.message || "Failed to add comment");
      setSnackbarOpen(true);
    }
  }, [isSuccess, isError]);

  const handleEmojiContainer = (
    event:
      | React.MouseEvent<HTMLInputElement, MouseEvent>
      | React.MouseEvent<HTMLButtonElement, MouseEvent>,
    value: boolean
  ) => {
    event.stopPropagation();
    setIsEmojiOpen(value);
  };

  return (
    <Box sx={styles.container} onClick={() => setIsEmojiOpen(false)}>
      <TextField
        variant="outlined"
        placeholder="Add a comment"
        fullWidth
        size="small"
        multiline
        value={comment}
        maxRows={2}
        onChange={handleCommentChange}
        InputProps={{
          style: {
            backgroundColor: "#f5f5f5",
            borderRadius: "10px",
            border: "none",
            fontSize: "14px",
            overflow: "hidden",
          },
          disableUnderline: true,
        }}
        sx={styles.inputField}
      />
      <Box sx={styles.buttonContainer}>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <IconButton
            onClick={(e) => {
              handleEmojiContainer(e, !isEmojiOpen);
            }}
          >
            <InsertEmoticonIcon
              sx={{
                color: isEmojiOpen ? "rgba(12, 143, 252, 1)" : "black",
              }}
            />
          </IconButton>
          <EmojiPicker
            searchDisabled
            onEmojiClick={(e) => {
              setComment(comment + e.emoji), console.log(e.emoji);
            }}
            open={isEmojiOpen}
            lazyLoadEmojis
            style={{
              position: "absolute",
              bottom: "55px",
              right: "30px",
              zIndex: 999999,
              width: "300px",
            }}
            height={305}
            // previewConfig={{ showPreview: false }}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleCommentSubmit}
            sx={styles.button}
            disabled={!comment}
          >
            Submit
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default CommentInput;

const useStyles = () =>
  createStyles({
    container: {
      display: "flex",
      bgcolor: "#f5f5f5",
      borderRadius: "10px",
      height: 70,
      marginTop: "10px",
    },
    inputField: {
      "& .MuiOutlinedInput-root": {
        "& fieldset": {
          border: "none",
        },
      },
      "& textarea": {
        scrollbarWidth: "none",
        "&::-webkit-scrollbar": {
          display: "none",
        },
      },
    },
    buttonContainer: {
      display: "flex",
      alignItems: "flex-end",
      marginBottom: "5px",
    },
    button: {
      marginRight: "8px",
      height: "30px",
      boxShadow: "unset",
      borderRadius: "6px",
      fontSize: 12,
    },
  });
