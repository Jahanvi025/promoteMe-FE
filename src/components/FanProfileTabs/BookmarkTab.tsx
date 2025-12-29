import { useEffect, useState } from "react";
import { useGetBookmarksQuery } from "../../services/api";
import { Box, CircularProgress, Typography } from "@mui/material";
import Post from "../Post";
import InfiniteScroll from "react-infinite-scroll-component";

const BookmarkTab = () => {
  const [selectedPage, setSelectedPage] = useState(1);
  const [posts, setPosts] = useState<Post[]>([]);
  const [hasMore, setHasMore] = useState(true);

  const {
    data: postsData,
    isLoading: queryLoading,
    refetch,
    isFetching,
  } = useGetBookmarksQuery({
    page: selectedPage,
    limit: 10,
  });

  useEffect(() => {
    if (postsData && !isFetching) {
      const newPosts = postsData.data?.posts;
      if (newPosts?.length === 0) {
        setHasMore(false);
      } else {
        setPosts((prevPosts) =>
          selectedPage === 1 ? newPosts : [...prevPosts, ...newPosts]
        );
        setHasMore(true);
      }
    }
  }, [postsData, selectedPage]);

  useEffect(() => {
    refetch();
  }, [selectedPage, refetch]);

  useEffect(() => {
    setSelectedPage(1);
  }, []);

  const fetchMorePosts = () => {
    if (!queryLoading && hasMore) {
      setSelectedPage((prevPage) => prevPage + 1);
    }
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Typography fontSize={18} fontWeight={500}>
        Bookmarks
      </Typography>
      <Box
        mt={2}
        sx={{
          width: "100%",
        }}
      >
        <InfiniteScroll
          dataLength={posts.length}
          next={fetchMorePosts}
          hasMore={hasMore}
          height={posts.length > 0 ? "53vh" : 0}
          style={{ scrollbarWidth: "none", width: "100%" }}
          loader={
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100px",
              }}
            >
              <CircularProgress />
            </Box>
          }
          scrollableTarget="scrollableDiv"
        >
          {posts.map((post) => (
            <Post key={post._id} {...post} isBookmark={true} />
          ))}
        </InfiniteScroll>
        {posts.length === 0 && !isFetching && !queryLoading && (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
            <Typography>No Saved Posts</Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default BookmarkTab;
