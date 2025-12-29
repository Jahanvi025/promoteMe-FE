import {
  Avatar,
  Box,
  Button,
  CustomTheme,
  IconButton,
  Popover,
  Typography,
} from "@mui/material";
import { ReactComponent as DefaultUser } from "../../assets/svg/defaultUser.svg";
import { ReactComponent as OptionsIcon } from "../../assets/svg/option.svg";
import { ReactComponent as BookmarkIcon } from "../../assets/svg/bookmark.svg";
import { createStyles } from "@mui/styles";
import theme from "../../themes";
import { getRelativeTime } from "../../utils/helper";
import { useEffect, useRef, useState } from "react";
import { useAppSelector } from "../../store/store";
import {
  useBookmarkPostMutation,
  useMarkNotInterestedMutation,
} from "../../services/api";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

interface Props {
  _id: string;
  username: string;
  createdAt: string;
  profilePicture?: string;
  isPreview?: boolean;
  isBookmarked?: boolean;
  onDelete?: (postId: string) => void;
  onEdit?: (postId: string) => void;
  onNotInterested?: (postId: string) => void;
  onReport?: (userId: string) => void;
  isProduct?: boolean;
  userId?: string;
}

export default function PostHeader(props: Props) {
  const {
    username,
    createdAt,
    profilePicture,
    _id,
    onDelete,
    isPreview,
    onEdit,
    isBookmarked,
    isProduct,
    userId,
    onReport,
    onNotInterested,
  } = props;

  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const anchorEl = useRef<HTMLButtonElement | null>(null);

  const role = useAppSelector((state) => state.auth?.user?.lastActiveRole);
  const [isBookMarked, setIsBookmarked] = useState(isBookmarked);

  const styles = useStyles(theme, isBookMarked);
  const navigate = useNavigate();

  const [bookmarkPost, { isSuccess, isError, error }] =
    useBookmarkPostMutation();

  const [
    markNorInterested,
    {
      isSuccess: isInterestedSuccess,
      isError: isInterestedError,
      error: interestedError,
    },
  ] = useMarkNotInterestedMutation();

  useEffect(() => {
    if (isSuccess) {
      setIsBookmarked(!isBookMarked);
    }
    if (isError) {
      const Error = error as ApiError;
      toast.error(Error?.data?.message);
    }
  }, [isSuccess, isError]);

  const handleClose = () => {
    setIsPopoverOpen(false);
  };

  const handleIconButtonClick = () => {
    setIsPopoverOpen(true);
  };

  const handleDelete = () => {
    if (onDelete) {
      onDelete(_id);
    }
    handleClose();
  };

  const handleEdit = () => {
    if (onEdit) {
      onEdit(_id);
    }
    handleClose();
  };

  const handleNotInterested = async () => {
    await markNorInterested({ id: _id });
  };

  const handleReport = () => {
    if (onReport) {
      onReport(userId || "");
    }
    handleClose();
  };

  const handleBookmark = async () => {
    await bookmarkPost({ type: isProduct ? "product" : "post", _id });
  };

  const handleClick = (userId: string | undefined) => {
    if (role === "FAN") {
      navigate(`/profile/${userId}`);
    }
  };

  useEffect(() => {
    if (isInterestedSuccess && onNotInterested) {
      onNotInterested(_id);
    }
    if (isInterestedError) {
      const Error = interestedError as ApiError;
      toast.error(Error?.data?.message);
    }
  }, [isInterestedSuccess, isInterestedError]);

  return (
    <Box sx={styles.container}>
      <Box sx={styles.headerInnerContainer}>
        <Box onClick={() => handleClick(userId)}>
          {profilePicture && (
            <Avatar
              sx={styles.profileImage}
              alt="user-profile-image"
              src={profilePicture}
            />
          )}
          {!profilePicture && (
            <DefaultUser
              style={{
                height: 45,
                width: 45,
                marginRight: 10,
                borderRadius: "50%",
              }}
            />
          )}
        </Box>
        <Box>
          <Typography sx={styles.name} onClick={() => handleClick(userId)}>
            {username}
          </Typography>
          <Typography sx={styles.time}>{getRelativeTime(createdAt)}</Typography>
        </Box>
      </Box>
      <Box>
        {role === "FAN" && (
          <IconButton
            disabled={isPreview}
            sx={styles.bookmarkButton}
            onClick={handleBookmark}
          >
            <BookmarkIcon height={30} width={30} />
          </IconButton>
        )}
        <IconButton
          ref={anchorEl}
          disabled={isPreview}
          onClick={handleIconButtonClick}
          sx={{ ...styles.iconButton }}
        >
          <OptionsIcon
            height={20}
            width={20}
            style={{
              rotate: "90deg",
            }}
          />
        </IconButton>
        <Popover
          open={isPopoverOpen}
          anchorEl={anchorEl.current}
          onClose={handleClose}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "right",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          sx={styles.popover}
        >
          <Box sx={styles.popoverContent}>
            {role === "CREATOR" ? (
              <>
                <Button onClick={handleEdit} sx={styles.popoverButton}>
                  Edit Post
                </Button>
                <Button onClick={handleDelete} sx={styles.popoverButton}>
                  Delete
                </Button>
              </>
            ) : (
              <>
                <Button onClick={handleNotInterested} sx={styles.popoverButton}>
                  Not Interested
                </Button>
                <Button onClick={handleReport} sx={styles.popoverButton}>
                  Report
                </Button>
              </>
            )}
          </Box>
        </Popover>
      </Box>
    </Box>
  );
}

const useStyles = (theme: CustomTheme, isBookMarked: boolean | undefined) =>
  createStyles({
    container: {
      display: "flex",
      flexDirection: "row",
      width: "100%",
      justifyContent: "space-between",
      alignItems: "center",
    },
    headerInnerContainer: {
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
    },
    name: {
      fontWeight: 500,
      fontSize: "16px",
      color: theme.palette.primary.dark,
      cursor: "pointer",
    },
    time: {
      fontSize: 12,
      color: theme.palette.primary.light,
    },
    iconButton: {
      height: 40,
      width: 40,
      marginRight: "10px",
      border: "1px solid rgba(119, 118, 122, 1)",
      "& svg": {
        "& path": {
          stroke: "rgb(168, 168, 168)",
        },
      },
    },
    bookmarkButton: {
      height: 40,
      width: 40,
      marginRight: "10px",
      border: isBookMarked
        ? "1px solid rgba(12, 143, 252, 1) "
        : "1px solid rgba(119, 118, 122, 1)",
      "& svg ": {
        fill: isBookMarked ? "rgba(12, 143, 252, 1)" : "transparent",
      },
      "& path": {
        stroke: isBookMarked ? "rgba(12, 143, 252, 1)" : "",
      },
    },
    profileImage: {
      height: 45,
      width: 45,
      marginRight: 1.5,
      borderRadius: "50%",
      cursor: "pointer",
    },
    popoverContent: {
      width: "150px",
      display: "flex",
      flexDirection: "column",
      padding: theme.spacing(1),
      borderRadius: "50%",
    },
    popoverButton: {
      color: "#333333",
      fontWeight: "400",
      textTransform: "none",
      justifyContent: "flex-start",
    },
    popover: {
      marginTop: theme.spacing(2),

      "& .MuiPaper-root": {
        borderRadius: "12px",
        marginLeft: "100px",
        [theme.breakpoints.down(600)]: {
          width: "120px",
          marginLeft: "10px",
        },
      },
    },
  });
