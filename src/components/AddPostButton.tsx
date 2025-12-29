import { Button, Typography, useMediaQuery } from "@mui/material";
import theme from "../themes";

interface Props {
  title: string;
  Icon: React.FC<React.SVGProps<SVGSVGElement>>;
  type: PostContentType;
  postType?: PostContentType;
  isEditPost?: boolean;
  setPostType: (value: PostContentType) => void;
  setMedia: (value: File[]) => void;
  setIsEmojiOpen: (value: boolean) => void;
}

export default function AddPostButton(props: Props) {
  const {
    title,
    Icon,
    type,
    postType,
    isEditPost,
    setPostType,
    setMedia,
    setIsEmojiOpen,
  } = props;
  const handlePostChange = () => {
    setMedia([]);
    setIsEmojiOpen(false);
    setPostType(type);
  };
  const isMobile = useMediaQuery(theme.breakpoints.down(900));

  return (
    <Button
      disabled={isEditPost}
      onClick={handlePostChange}
      sx={{ marginRight: "2vw" }}
    >
      <Icon
        style={{ marginRight: 10 }}
        color={postType === type ? theme.palette.primary.main : "black"}
      />
      {!isMobile && (
        <Typography
          sx={{
            color: postType === type ? theme.palette.primary.main : "black",
            fontSize: "12px",
          }}
        >
          {title}
        </Typography>
      )}
    </Button>
  );
}
