import {
  Box,
  IconButton,
  Typography,
  Avatar,
  Button,
  TextField,
  InputAdornment,
  Popover,
  Snackbar,
} from "@mui/material";
import { ReactComponent as CancelIcon } from "../../assets/svg/cancel.svg";
import { createStyles } from "@mui/styles";
import { useEffect, useRef, useState } from "react";
import { ReactComponent as DotIcon } from "../../assets/svg/timeDot.svg";
import { ReactComponent as OptionIcon } from "../../assets/svg/option.svg";
import theme from "../../themes";
import {
  useAddReplyMutation,
  useDeleteCommentMutation,
  useGetCommentsQuery,
  useGetRepliesQuery,
} from "../../services/api";
import { formatDate } from "../../utils/helper";
import { useAppSelector } from "../../store/store";
import InfiniteScroll from "react-infinite-scroll-component";
import CommentInput from "./commentInput";

interface Props {
  setCommentsModal: (value: boolean) => void;
  postId: string;
}

export default function CommentsModal(props: Props) {
  const { setCommentsModal, postId } = props;
  const [comments, setComments] = useState<Comment[]>([]);
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [replyContent, setReplyContent] = useState<{ [key: string]: string }>(
    {}
  );
  const [showReplies, setShowReplies] = useState<{ [key: string]: boolean }>(
    {}
  );
  const [page, setPage] = useState(1);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [selectedCommentId, setSelectedCommentId] = useState("");
  const [repliesPage, setRepliesPage] = useState(1);
  const [hasMoreReplies, setHasMoreReplies] = useState(false);
  const [isEmojiOpen, setIsEmojiOpen] = useState(false);
  const user = useAppSelector((state) => state.auth.user);
  const role = useAppSelector((state) => state.auth.user?.lastActiveRole);
  const modalRef = useRef<HTMLDivElement>(null);

  const {
    data: commentsData,
    isFetching: commentsFetching,
    refetch,
  } = useGetCommentsQuery({
    postId,
    page,
    limit: 10,
  });

  const { data: repliesData, isFetching: repliesFetching } = useGetRepliesQuery(
    {
      commentId: selectedCommentId,
      page: repliesPage,
      limit: 10,
    },
    { skip: !selectedCommentId }
  );

  const [
    deleteComment,
    {
      isSuccess: isCommentDeleted,
      isError: isCommentNotDeleted,
      error: deleteCommentError,
    },
  ] = useDeleteCommentMutation();

  const [addReply, { isSuccess, isError, error }] = useAddReplyMutation();

  useEffect(() => {
    if (commentsData && commentsData.data && commentsData.data.comments) {
      console.log(commentsData.data.comments);
      const newComments = (commentsData.data.comments as Comment[]).map(
        (comment) => ({
          ...comment,
          replies: comment.replies || [],
        })
      );
      if (page === 1) {
        setComments(newComments);
      } else {
        setComments((prevComments) => [...prevComments, ...newComments]);
      }
    }
  }, [commentsData]);

  useEffect(() => {
    if (
      repliesData &&
      repliesData.data &&
      repliesData.data.replies &&
      repliesData.data.replies.length > 0
    ) {
      setHasMoreReplies(true);
      const updatedComments = comments.map((comment) => {
        if (comment._id === selectedCommentId) {
          return {
            ...comment,
            replies: [...comment.replies, ...repliesData.data.replies],
          };
        }
        return comment;
      });
      setComments(updatedComments);
    } else {
      setHasMoreReplies(false);
    }
  }, [repliesData]);

  const handleReplyClick = (commentId: string) => {
    setSelectedCommentId(commentId);
    setShowReplies((prev) => ({
      ...prev,
      [commentId]: !prev[commentId],
    }));

    if (!repliesPage) {
      setRepliesPage(repliesPage + 1);
    }
  };

  const handleAddReply = (commentId: string) => {
    if (replyContent[commentId]) {
      addReply({ id: commentId, comment: replyContent[commentId] });
    }
  };

  useEffect(() => {
    if (isSuccess) {
      const updatedComments = comments.map((comment) => {
        if (comment._id === selectedCommentId) {
          return {
            ...comment,
            replies: [
              ...(comment.replies || []),
              {
                _id: "tempId",
                user_id: {
                  _id: user?.id || "",
                  profile_picture: user?.profile_picture || "",
                  username: user?.displayName || "",
                },
                comment: replyContent[selectedCommentId],
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                parent_id: selectedCommentId,
                post_id: postId,
                likedBy: [],
              },
            ],
          } as Comment;
        }
        return comment;
      });
      setComments(updatedComments);
      setSnackbarMessage("Reply added successfully");
      setSnackbarOpen(true);
      setReplyContent((prev) => ({ ...prev, [selectedCommentId]: "" }));
    }
  }, [isSuccess, selectedCommentId]);

  useEffect(() => {
    if (isError) {
      const Error = error as ApiError;
      setSnackbarMessage(Error.data.message || "failed to add reply");
      setSnackbarOpen(true);
    }
  }, [isError]);

  const handleClick = (
    event: React.MouseEvent<HTMLButtonElement>,
    commentId: string
  ) => {
    setAnchorEl(event.currentTarget);
    setSelectedCommentId(commentId);
  };

  const handleDeleteComment = async () => {
    if (selectedCommentId) {
      await deleteComment(selectedCommentId);
      refetch();
    }
  };

  useEffect(() => {
    if (isCommentDeleted) {
      const newComments = comments.filter(
        (comment) => comment._id !== selectedCommentId
      );
      setComments(newComments);
      setSnackbarMessage("Comment deleted successfully");
      setSnackbarOpen(true);
      handleClose();
    }
    if (isCommentNotDeleted) {
      const error = deleteCommentError as ApiError;
      setSnackbarMessage(error.data.message || "Failed to delete Comment");
      setSnackbarOpen(true);
    }
  }, [isCommentDeleted, isCommentNotDeleted]);

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLoadMoreReplies = () => {
    if (selectedCommentId) {
      setRepliesPage((prevPage) => prevPage + 1);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const handleDialogClose = () => {
    setCommentsModal(false);
    setComments([]);
    setPage(1);
  };

  const handleContainerClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
      setIsEmojiOpen(false);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        setIsEmojiOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const styles = useStyles();

  return (
    <>
      <Box sx={styles.container} ref={modalRef} onClick={handleContainerClick}>
        <Typography fontSize={20}>Comments</Typography>
        <IconButton onClick={handleDialogClose} size="large">
          <CancelIcon color="black" />
        </IconButton>
      </Box>
      {role === "FAN" && (
        <Box>
          <CommentInput
            isEmojiOpen={isEmojiOpen}
            setIsEmojiOpen={setIsEmojiOpen}
            postId={postId}
            refetch={refetch}
            setPage={setPage}
            setSnackbarMessage={setSnackbarMessage}
            setSnackbarOpen={setSnackbarOpen}
          />
        </Box>
      )}
      <Box mt={3} sx={styles.content} id="scrollableDiv">
        <InfiniteScroll
          dataLength={comments.length}
          next={() => setPage((prevPage) => prevPage + 1)}
          hasMore={!commentsFetching}
          loader={""}
          scrollableTarget="scrollableDiv"
        >
          {comments.length > 0 ? (
            comments.map((comment, index) => (
              <Box key={index} sx={styles.commentContainer}>
                <Box sx={styles.commentHeader}>
                  <Box sx={styles.commentInformation}>
                    <Avatar
                      src={comment.user_id?.profile_picture}
                      sx={styles.avatar}
                    />
                    <Typography sx={styles.commentAuthor}>
                      {comment.user_id?.username}
                    </Typography>
                    <DotIcon />
                    <Typography sx={styles.commentTime}>
                      {formatDate(comment?.createdAt)}
                    </Typography>
                  </Box>
                  {comment?.user_id?._id === user?.id && (
                    <IconButton
                      sx={styles.optionsButton}
                      onClick={(event) => handleClick(event, comment?._id)}
                    >
                      <OptionIcon />
                    </IconButton>
                  )}
                </Box>
                <Typography sx={styles.commentContent}>
                  {comment.comment}
                </Typography>
                <Button
                  onClick={() => handleReplyClick(comment._id)}
                  sx={{ marginLeft: "42px" }}
                >
                  {showReplies[comment._id] ? "Hide Replies" : "Reply"}
                </Button>
                {showReplies[comment._id] && (
                  <>
                    <Box sx={styles.repliesContainer}>
                      {comment.replies &&
                        comment.replies.map((reply) => (
                          <Box key={reply._id} sx={styles.replyContainer}>
                            <Avatar
                              src={reply.user_id.profile_picture}
                              sx={styles.avatar}
                            />
                            <Box>
                              <Typography sx={styles.replyAuthor}>
                                {reply.user_id.username}
                              </Typography>
                              <Typography>{reply.comment}</Typography>
                            </Box>
                          </Box>
                        ))}
                      {repliesFetching && (
                        <Typography>Loading more replies...</Typography>
                      )}
                      {!repliesFetching && hasMoreReplies && (
                        <Button
                          onClick={handleLoadMoreReplies}
                          sx={{ marginLeft: "35px" }}
                        >
                          Load More
                        </Button>
                      )}
                    </Box>

                    <TextField
                      value={replyContent[comment._id] || ""}
                      onChange={(e) =>
                        setReplyContent((prev) => ({
                          ...prev,
                          [comment._id]: e.target.value,
                        }))
                      }
                      placeholder="Add a reply..."
                      fullWidth
                      margin="dense"
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <Button onClick={() => handleAddReply(comment._id)}>
                              Add Reply
                            </Button>
                          </InputAdornment>
                        ),
                      }}
                    />
                  </>
                )}
              </Box>
            ))
          ) : (
            <Typography sx={styles.noComments}>No comment found</Typography>
          )}
          <Popover
            open={Boolean(anchorEl)}
            anchorEl={anchorEl}
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
              <Button sx={styles.popoverButton} onClick={handleDeleteComment}>
                Delete
              </Button>
            </Box>
          </Popover>
        </InfiniteScroll>
      </Box>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        message={snackbarMessage}
      />
    </>
  );
}

const useStyles = () =>
  createStyles({
    container: {
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      width: "100%",
      minWidth: "250px",
    },
    content: {
      maxHeight: "45vh",
      width: "100%",
      overflowY: "auto",
      scrollbarWidth: "thin",
      scrollbarColor: "#BDCEDB transparent",
      "&::-webkit-scrollbar": {
        width: "2px",
      },
      "&::-webkit-scrollbar-thumb": {
        backgroundColor: "#BDCEDB",
        borderRadius: "10px",
      },
      "&::-webkit-scrollbar-track": {
        backgroundColor: "transparent",
        borderRadius: "10px",
      },
    },
    commentContainer: {
      marginBottom: 2,
      borderBottom: "1px solid rgba(211, 216, 223, 1)",
      padding: "0 8px",
    },
    commentInformation: {
      display: "flex",
      alignItems: "center",
      gap: 2,
    },
    commentHeader: {
      width: "100%",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
    },
    avatar: {
      width: 40,
      height: 40,
      borderRadius: "50%",
    },
    commentAuthor: {
      fontWeight: "bold",
      maxWidth: "20vw",
      textOverflow: "ellipsis",
      overflow: "hidden",
      whiteSpace: "nowrap",
    },
    commentTime: {
      color: "gray",
      fontSize: "0.875rem",
    },
    optionsButton: {
      marginLeft: "auto",
    },
    commentContent: {
      marginTop: 1,
      marginLeft: 7,
    },
    repliesContainer: {
      marginTop: 1,
      marginLeft: 6,
      paddingLeft: 2,
      borderLeft: "2px solid rgba(211, 216, 223, 1)",
      maxHeight: "100px",
      overflowY: "auto",
      scrollbarWidth: "none",
    },
    replyContainer: {
      display: "flex",
      alignItems: "center",
      gap: 2,
      marginBottom: 1,
    },
    replyAuthor: {
      fontWeight: "bold",
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
      "& .MuiPaper-root": {
        borderRadius: "12px",
        marginLeft: "100px",
      },
    },
    noComments: {
      textAlign: "center",
      color: "gray",
      marginTop: "20px",
    },
  });
