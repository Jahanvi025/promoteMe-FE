import { Box, Button, Typography } from "@mui/material";
import { ReactComponent as BackIcon } from "../assets/svg/backArrow.svg";
import AddPostCard from "./AddPostCard";
import { useState } from "react";
import { createStyles } from "@mui/styles";

interface Props {
  postType: PostContentType;
  description?: string;
  selectedMedia?: (string | File)[];
  selectedAudio?: string | Blob;
  setPostType: (value: PostContentType) => void;
  setIsEditingPost: (value: boolean) => void;
  thumbnail?: (string | File)[] | undefined;
  teaser?: (string | File)[];
  selectedPostId?: string;
  setSelectedPostId?: (value: string) => void;
  onPostUpdate?: (updatedPost: Post) => void;
  access_identifier: string;
}

export default function EditPost(props: Props) {
  const {
    postType,
    description,
    selectedAudio,
    selectedMedia,
    setPostType,
    setIsEditingPost,
    thumbnail,
    teaser,
    selectedPostId,
    setSelectedPostId,
    onPostUpdate,
    access_identifier,
  } = props;
  const [isEmojiOpen, setIsEmojiOpen] = useState(false);
  const styles = useStyles();

  const handleBackClick = () => {
    setIsEditingPost(false);
    setSelectedPostId ? setSelectedPostId("") : () => {};
  };

  return (
    <Box sx={styles.container}>
      <Box sx={styles.subContainer}>
        <Button onClick={handleBackClick} sx={{ textTransform: "initial" }}>
          <BackIcon style={{ marginRight: 10 }} color="rgba(12, 143, 252, 1)" />
          <Typography color="rgba(12, 143, 252, 1)">Back</Typography>
        </Button>
      </Box>
      <Box mt={4} sx={styles.postCardContainer}>
        <AddPostCard
          postType={postType}
          isEmojiOpen={isEmojiOpen}
          description={description}
          selectedAudio={selectedAudio}
          selectedMedia={selectedMedia}
          setPostType={setPostType}
          setIsEmojiOpen={setIsEmojiOpen}
          selectedThumbnail={thumbnail}
          selectedTeaser={teaser}
          isEditPost
          selectedPostId={selectedPostId}
          setSelectedPostId={setSelectedPostId}
          onPostUpdate={onPostUpdate}
          access_identifier={access_identifier}
        />
      </Box>
    </Box>
  );
}

const useStyles = () =>
  createStyles({
    container: {
      display: "flex",
      flexDirection: "column",
      width: "100%",
    },
    subContainer: {
      width: "91%",
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    postCardContainer: {
      width: "100%",
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
  });
