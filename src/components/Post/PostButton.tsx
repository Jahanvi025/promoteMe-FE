import { Button, Typography, useTheme, Theme } from "@mui/material";
import { createStyles } from "@mui/styles";
import { useAppDispatch, useAppSelector } from "../../store/store";
import { setSelectedPost } from "../../store/reducers/authReducer";
import { useLikePostMutation } from "../../services/api";
import { useEffect, useState } from "react";

interface Props {
  Icon: React.FC<React.SVGProps<SVGSVGElement>>;
  title: string;
  isLiked?: boolean;
  isComment?: boolean;
  isShare?: boolean;
  isPreview?: boolean;
  isTip?: boolean;
  count?: number;
  tip?: number;
  setCommentsModal?: (value: boolean) => void;
  setTipModal?: (value: boolean) => void;
  setSelectedUserId?: (userId: string) => void;
  onShare?: (postId: string) => void;
  userId?: string;
  _id: string;
}

export default function PostButton(props: Props) {
  const {
    Icon,
    title,
    isPreview,
    isShare,
    isTip,
    isComment,
    setCommentsModal,
    setTipModal,
    count,
    tip,
    _id,
    isLiked,
    userId,
    setSelectedUserId,
    onShare,
  } = props;
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const role = useAppSelector((state) => state.auth.user?.lastActiveRole);
  const [isliked, setIsLiked] = useState(isLiked);
  const [likeCount, setLikeCount] = useState(count || 0);
  const styles = useStyles(theme, isliked, title);

  const [likePost, { isSuccess }] = useLikePostMutation();

  const handlePostAction = async () => {
    if (isShare) {
      onShare && onShare(_id);
    }

    if (isComment) {
      setCommentsModal && setCommentsModal(true);
      dispatch(setSelectedPost({ postId: _id || "" }));
    }

    if (title === "Like" && role === "FAN") {
      await likePost({ _id });
    }

    if (title === "Send tip") {
      setSelectedUserId && setSelectedUserId(userId || "");
      setTipModal && setTipModal(true);
      dispatch(setSelectedPost({ postId: _id || "" }));
    }
  };

  useEffect(() => {
    if (isSuccess) {
      setIsLiked(!isliked);
      if (isliked) {
        setLikeCount(likeCount - 1);
      }
      if (!isliked) {
        setLikeCount(likeCount + 1);
      }
    }
  }, [isSuccess]);

  return (
    <Button
      onClick={handlePostAction}
      disabled={isPreview}
      sx={{
        ...styles.container,
        "&:hover": {
          backgroundColor: "transparent",
        },
      }}
    >
      <Icon
        style={{
          marginRight: 5,
        }}
        color="rgba(166, 178, 200, 1)"
      />
      {((!isShare && role !== "FAN") || title === "Like") && (
        <Typography
          color={isliked ? "red" : "rgba(166, 178, 200, 1)"}
          fontWeight={600}
          mr={0.4}
        >
          {isTip && tip != undefined ? `$${tip}` : isliked ? likeCount : count}
        </Typography>
      )}
      <Typography sx={styles.title}>{title}</Typography>
    </Button>
  );
}

const useStyles = (theme: Theme, isliked: boolean | undefined, title: string) =>
  createStyles({
    container: {
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      height: 50,
      paddingLeft: 1,
      paddingRight: 2,
      "& svg": {
        fill: isliked ? "red" : "transparent",

        "& path": {
          stroke: isliked ? "red" : theme.palette.primary.light,
        },
      },
    },
    title: {
      color: isliked ? "red" : theme.palette.primary.light,
      textTransform: "initial",
      [theme.breakpoints.down(700)]: {
        display: title === "Share" ? "block" : "none",
      },
      [theme.breakpoints.down(400)]: {
        display: "none",
      },
    },
  });
