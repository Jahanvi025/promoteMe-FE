import { Box } from "@mui/material";
import PageHeader from "../components/PageHeader";
import { createStyles } from "@mui/styles";
import { useEffect, useRef, useState } from "react";
import AddPostCard from "../components/AddPostCard";
import theme from "../themes";

export default function AddPost() {
  const [postType, setPostType] = useState<PostContentType>("TEXT");
  const [isEmojiOpen, setIsEmojiOpen] = useState(false);
  const styles = useStyles();
  const emojiPickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        emojiPickerRef.current &&
        !emojiPickerRef.current.contains(event.target as Node)
      ) {
        setIsEmojiOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <Box sx={styles.container}>
      <PageHeader title="Add Post" />
      <AddPostCard
        postType={postType}
        isEmojiOpen={isEmojiOpen}
        setPostType={setPostType}
        setIsEmojiOpen={setIsEmojiOpen}
        emojiPickerRef={emojiPickerRef}
      />
    </Box>
  );
}

const useStyles = () =>
  createStyles({
    container: {
      marginLeft: "24%",
      display: "flex",
      flexDirection: "column",
      paddingRight: "2%",
      height: "80vh",
      overflow: "scroll",
      scrollbarWidth: "none",
      position: "sticky",
      top: "109px",
      marginTop: "105px",
      [theme.breakpoints.down(900)]: {
        marginLeft: "5%",
        marginTop: "102px",
      },
      [theme.breakpoints.down(600)]: {
        marginLeft: "2%",
        marginTop: "57px",
        height: "91vh",
      },
    },
  });
