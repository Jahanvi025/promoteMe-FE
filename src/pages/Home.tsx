import { Box, Typography, useMediaQuery } from "@mui/material";
import { createStyles } from "@mui/styles";
import PageHeader from "../components/PageHeader";
import Post from "../components/Post";
import Trending from "../components/Trending";
import { useEffect, useState } from "react";
import CustomModal from "../components/CustomModal";
import ShareModal from "../components/ShareModal";
import {
  useAddConnectAccountMutation,
  useDeletePostMutation,
  useGetPostsQuery,
} from "../services/api";
import CommentsModal from "../components/Comment/commentModel";
import { toast } from "react-toastify";
import { RootState, useAppSelector } from "../store/store";
import theme from "../themes";
import InfiniteScroll from "react-infinite-scroll-component";
import TipModal from "../components/TipModal";
import ThankYouModal from "../components/ThankYouModal";
import Suggestions from "../components/Suggestions";
import { useLocation } from "react-router-dom";
import ReportModel from "../components/ReportModel";
import PostSkeleton from "../components/Post/PostSkeleton";
import PostSkeletonList from "../components/Post/PostSkeleton";

const Home = () => {
  const [isShareModal, setIsShareModal] = useState(false);
  const [isCommentModal, setIsCommentModal] = useState(false);
  const [isTipModal, setIsTipModal] = useState(false);
  const [isThankModal, setIsThankModal] = useState(false);
  const [selectedPage, setSelectedPage] = useState(1);
  const [selectedTrendingPage, setSelectedTrendingPage] = useState(0);
  const [posts, setPosts] = useState<Post[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [isEditingPost, setIsEditingPost] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState("");
  const [trendingUserCount, setTrendingUserCount] = useState(0);
  const [isReportModal, setIsReportModal] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState("");

  const isTab = useMediaQuery(theme.breakpoints.down(900));
  const isMobile = useMediaQuery(theme.breakpoints.down(600));
  const selectedPost = useAppSelector((state: RootState) => state.auth.postId);
  const [selectedFilter, setSelectedFilter] = useState<string>("Recents");
  const role = useAppSelector((state) => state.auth.user?.lastActiveRole);
  const location = useLocation();
  const styles = useStyles();

  const handleFilterClick = (filter: string) => {
    setSelectedPage(1);
    setSelectedFilter(filter);
    setHasMore(true);
    setPosts([]);
  };

  const getButtonStyles = (filter: string) => ({
    fontWeight: selectedFilter === filter ? "bold" : "normal",
    color: selectedFilter === filter ? "black" : "gray",
    cursor: "pointer",
    transition: "font-weight 0.3s ease",
    "&:hover": {
      fontWeight: "bold",
    },
  });

  const {
    data: postsData,
    isLoading: queryLoading,
    refetch,
    isFetching,
  } = useGetPostsQuery({
    page: selectedPage,
    limit: 10,
    filter: selectedFilter,
    role: role,
  });

  const [
    completeOnboarding,
    {
      isSuccess: isOnboardingComplete,
      isError: isOnboardingError,
      error: onboardingError,
    },
  ] = useAddConnectAccountMutation();

  const [
    deletePost,
    { isSuccess: deletePostSuccess, isError: deletePostError, error },
  ] = useDeletePostMutation();

  useEffect(() => {
    if (postsData && postsData.data?.posts?.length > 0 && !isFetching) {
      if (selectedPage === 1) {
        setPosts(postsData.data.posts);
      } else {
        const newPosts = postsData.data?.posts;
        setPosts((prevPosts) => [...prevPosts, ...newPosts]);
      }
      setHasMore(true);
    } else if (postsData && postsData.data?.posts?.length === 0) {
      setHasMore(false);
      if (selectedPage === 1) {
        setPosts([]);
      }
    }
  }, [postsData, refetch]);

  useEffect(() => {
    refetch();
  }, [selectedFilter, selectedPage, refetch]);

  const handleDeletePost = async (postId: string) => {
    await deletePost(postId);
    const updatedPosts = posts.filter((post) => post._id !== postId);
    setPosts(updatedPosts);
  };

  const handleNotInterested = async (postId: string) => {
    const updatedPosts = posts.filter((post) => post._id !== postId);
    setPosts(updatedPosts);
  };

  const handleEditPost = async (postId: string) => {
    setIsEditingPost(true);
    setSelectedPostId(postId);
  };

  const handleReportUser = async (userId: string) => {
    setIsReportModal(true);
    setSelectedUserId(userId);
    console.log(selectedUserId);
  };

  const handleShare = async (postId: string) => {
    setIsShareModal(true);
    setSelectedPostId(postId);
  };

  useEffect(() => {
    if (deletePostSuccess) {
      toast.success("Post deleted successfully!");
    }

    if (deletePostError) {
      const Error = error as ApiError;
      toast.error("Error deleting post: " + Error?.data?.message);
    }
  }, [deletePostSuccess, deletePostError]);

  const fetchMorePosts = () => {
    if (!queryLoading && hasMore) {
      setSelectedPage((prevPage) => prevPage + 1);
    }
  };

  const handlePostUpdate = (updatedPost: Post) => {
    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post._id === updatedPost._id ? updatedPost : post
      )
    );
    setIsEditingPost(false);
    setSelectedPostId("");
  };

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const accountId = params.get("account");
    const status = params.get("status");

    if (accountId && status === "complete") {
      completeOnboarding({ stripeAccountId: accountId });
    }
  }, [location, completeOnboarding]);

  useEffect(() => {
    if (isOnboardingComplete) {
      toast.success("Stripe Onboarding Completed");
    }
    if (isOnboardingError) {
      const Error = onboardingError as ApiError;
      toast.error(Error.data.message);
    }
  }, [isOnboardingComplete, isOnboardingError]);

  return (
    <>
      <Box sx={styles.container} p={1}>
        <Box width="70%" sx={styles.postContainer}>
          <Box sx={styles.header}>
            <PageHeader title="Feeds" />
            {role === "FAN" && (
              <Box sx={styles.filterSection}>
                <Typography
                  sx={getButtonStyles("Recents")}
                  onClick={() => handleFilterClick("Recents")}
                >
                  Recents
                </Typography>
                <Typography
                  sx={getButtonStyles("Following")}
                  onClick={() => handleFilterClick("Following")}
                >
                  Following
                </Typography>
                <Typography
                  sx={getButtonStyles("Popular")}
                  onClick={() => handleFilterClick("Popular")}
                >
                  Popular
                </Typography>
              </Box>
            )}
          </Box>
          <InfiniteScroll
            dataLength={posts.length}
            next={fetchMorePosts}
            hasMore={hasMore}
            loader={
              selectedPage === 1 ? (
                <PostSkeletonList count={3} />
              ) : (
                <PostSkeleton count={1} />
              )
            }
            scrollableTarget="scrollableDiv"
          >
            {posts.map((post) => (
              <Post
                key={post._id}
                {...post}
                onShare={handleShare}
                setCommentModal={setIsCommentModal}
                setTipModal={setIsTipModal}
                onDelete={handleDeletePost}
                setIsEditingPost={setIsEditingPost}
                onEdit={handleEditPost}
                isEditingPost={isEditingPost}
                selectedPostId={selectedPostId}
                setSelectedPostId={setSelectedPostId}
                onPostUpdate={handlePostUpdate}
                onReport={handleReportUser}
                onNotInterested={handleNotInterested}
                setSelectedUserId={setSelectedUserId}
              />
            ))}
          </InfiniteScroll>
          {!hasMore && !queryLoading && (
            <Box sx={{ display: "flex", justifyContent: "center", my: 2 }}>
              <Typography>
                {postsData?.data.count === 0 ? "No Posts" : "No more posts"}
              </Typography>
            </Box>
          )}
        </Box>
        <Box sx={styles.trending}>
          <PageHeader
            title="Trending"
            selectedPage={selectedTrendingPage}
            setSelectedPage={setSelectedTrendingPage}
            isTrendingCard
            trendingUserCount={trendingUserCount}
          />
          <Trending
            selectedPage={selectedTrendingPage}
            setTrendingUserCount={setTrendingUserCount}
          />
          {role === "FAN" && (
            <Box width={"100%"} mt={2}>
              <Suggestions />
            </Box>
          )}
        </Box>

        <CustomModal
          open={isShareModal}
          setOpen={setIsShareModal}
          width="auto"
          padding={3}
          isShare
        >
          <ShareModal
            setShareModal={setIsShareModal}
            postId={selectedPostId}
            refetch={refetch}
          />
        </CustomModal>
        <CustomModal
          open={isCommentModal}
          setOpen={setIsCommentModal}
          width={isMobile ? "70vw" : isTab ? "50vw" : "30vw"}
          padding={3}
          isShare
        >
          <CommentsModal
            setCommentsModal={setIsCommentModal}
            postId={selectedPost || ""}
          />
        </CustomModal>
        <CustomModal
          open={isTipModal}
          setOpen={setIsTipModal}
          width={isMobile ? "70vw" : isTab ? "50vw" : "30vw"}
          padding={3}
        >
          <TipModal
            setTipModal={setIsTipModal}
            postId={selectedPost || ""}
            setThankModal={setIsThankModal}
            creatorId={selectedUserId}
          />
        </CustomModal>
        <CustomModal
          open={isThankModal}
          setOpen={setIsThankModal}
          width={isMobile ? "70vw" : isTab ? "50vw" : "30vw"}
          padding={3}
        >
          <ThankYouModal
            closeModal={setIsThankModal}
            heading="Thank you for your Tip!"
            subHeading="Your tip will be sent to the creator."
          />
        </CustomModal>
        <CustomModal
          open={isReportModal}
          setOpen={setIsReportModal}
          width={isMobile ? "70vw" : isTab ? "50vw" : "30vw"}
          // noPadding
        >
          <ReportModel closeModal={setIsReportModal} userId={selectedUserId} />
        </CustomModal>
      </Box>
    </>
  );
};

export default Home;

const useStyles = () =>
  createStyles({
    container: {
      marginLeft: "24%",
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-between",
      overflow: "hidden",
      [theme.breakpoints.down(900)]: {
        marginLeft: "4%",
        display: "flex",
        flexDirections: "center",
        justifycontent: "center",
        alignItems: "center",
      },
      [theme.breakpoints.down(800)]: {
        marginLeft: "5%",
      },
      [theme.breakpoints.down(600)]: {
        marginLeft: "1%",
      },
    },
    postContainer: {
      position: "sticky",
      overflow: "scroll",
      top: "109px",
      marginTop: "105px",
      [theme.breakpoints.down(900)]: {
        marginTop: "95px",
      },
      "-ms-overflow-style": "none",
      "&::-webkit-scrollbar": {
        display: "none",
      },

      [theme.breakpoints.down(600)]: {
        width: "100%",
        marginTop: "50px",
        overflow: "visible",
      },
    },
    trending: {
      width: "20%",
      position: "fixed",
      top: "109px",
      right: "20px",
      height: "fit-content",
      overflowY: "hidden",
      [theme.breakpoints.down(900)]: {
        width: "25%",
        top: "102px",
      },
      [theme.breakpoints.down(600)]: {
        display: "none",
      },
    },
    header: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginRight: "50px",
      [theme.breakpoints.down(600)]: {
        marginRight: "10px",
      },
    },
    filterSection: {
      display: "flex",
      gap: "40px",
      marginBottom: 0,
      [theme.breakpoints.down(600)]: {
        gap: "20px",
        marginBottom: 0,
      },
    },
  });
