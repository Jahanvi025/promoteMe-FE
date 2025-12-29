import { memo, useEffect, useRef, useState } from "react";
import { chunkVideos } from "../utils/helper";
import { Box, CircularProgress, Typography } from "@mui/material";
import CustomModal from "./CustomModal";
import { createStyles } from "@mui/styles";
import ReactPlayer from "react-player";
import ProfileVideoCard from "./ProfileVideoCard";
import theme from "../themes";
import { useGetPostsQuery } from "../services/api";
import { useParams } from "react-router-dom";
import { RootState, useAppSelector } from "../store/store";

const ProfileVideoTab = memo(() => {
  const [chunkedArray, setChunkedArray] = useState<
    {
      videoUrl: string;
      accessIdentifier: string;
      isPurchased: boolean;
      isSubscribed: boolean;
      price: string;
      postId: string;
      user_id: {
        _id: string;
        displayName: string;
        profile_picture: string;
      };
    }[][]
  >([]);
  const [selectedVideo, setSelectedVideo] = useState("");
  const [isVideoPlayer, setIsVideoPlayer] = useState(false);
  const [selectedPage, setSelectedPage] = useState(1);
  const [initialLoad, setInitialLoad] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const { userId } = useParams<{ userId: string }>();
  const styles = useStyles();
  const role = useAppSelector(
    (state: RootState) => state?.auth?.user?.lastActiveRole
  );

  const {
    data: postsData,
    isLoading,
    refetch,
    isFetching,
  } = useGetPostsQuery({
    page: selectedPage,
    limit: 9,
    type: "VIDEO",
    creatorId: userId,
    role: role,
  });

  useEffect(() => {
    const resetAndRefetch = async () => {
      setSelectedPage(1);
      await refetch();
    };
    resetAndRefetch();
  }, [refetch]);

  const observer = useRef<IntersectionObserver | null>(null);
  const lastPostRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (postsData && postsData.data.posts.length > 0) {
      const postDetails = postsData.data.posts.map((post) => ({
        videoUrl: post.video_url,
        accessIdentifier: post.access_identifier ?? "",
        isPurchased: post.isPurchased || false,
        isSubscribed: post.isSubscribed || false,
        price: post.price ?? "",
        postId: post._id ?? "",
        user_id: post.user_id,
      }));

      const newArr = chunkVideos(postDetails, 3);

      setChunkedArray((prevChunkedArray) => {
        let combinedArray = selectedPage === 1 ? [] : [...prevChunkedArray];
        newArr.forEach((chunk) => {
          if (
            !combinedArray.some((existingChunk) =>
              existingChunk.some((item) =>
                chunk.some((chunkItem) => chunkItem.videoUrl === item.videoUrl)
              )
            )
          ) {
            combinedArray.push(chunk);
            setInitialLoad(false);
          }
        });
        return combinedArray;
      });
      setHasMore(true);
    } else if (postsData && postsData.data.posts.length === 0) {
      setHasMore(false);
      setInitialLoad(false);
    }
  }, [postsData, selectedPage]);

  useEffect(() => {
    if (isLoading || !hasMore) return;

    if (observer.current) observer.current.disconnect();

    observer.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        setSelectedPage((prevPage) => prevPage + 1);
      }
    });

    if (lastPostRef.current) observer.current.observe(lastPostRef.current);

    return () => {
      if (observer.current) observer.current.disconnect();
    };
  }, [isLoading, hasMore]);

  useEffect(() => {
    return () => {
      setSelectedPage(1);
      setChunkedArray([]);
      setHasMore(true);
    };
  }, []);

  return (
    <>
      {chunkedArray.map((row, index) => (
        <Box
          key={index}
          sx={{ display: "flex", flexDirection: "row", gap: 1.5 }}
          mt={index !== 0 ? 1.5 : 0}
        >
          {row.map((item, index) => (
            <ProfileVideoCard
              key={index}
              item={item.videoUrl}
              setIsVideoPlayer={setIsVideoPlayer}
              setSelectedVideo={setSelectedVideo}
              access_identifier={item.accessIdentifier}
              isPurchased={item.isPurchased}
              isSubscribed={item.isSubscribed}
              price={item.price}
              postId={item.postId}
              user_id={item.user_id}
              refetch={refetch}
              setSelectedPage={setSelectedPage}
            />
          ))}
        </Box>
      ))}
      {initialLoad || isFetching ? (
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
      ) : (
        !hasMore && (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
            <Typography sx={{ color: "gray" }}>
              {chunkedArray.length === 0 ? "No Posts" : ""}
            </Typography>
          </Box>
        )
      )}
      <div ref={lastPostRef} style={{ height: 1 }}></div>
      <CustomModal open={isVideoPlayer} setOpen={setIsVideoPlayer} width="70%">
        <ReactPlayer
          controls
          style={{ borderRadius: 4, overflow: "hidden" }}
          url={selectedVideo}
          wrapper={({ children }) => <Box sx={styles.player}>{children}</Box>}
        />
      </CustomModal>
    </>
  );
});

export default ProfileVideoTab;

const useStyles = () =>
  createStyles({
    uploadedVideo: {
      height: 186,
      width: 186,
      maxWidth: 186,
      borderRadius: 3,
      cursor: "pointer",
      position: "relative",
      backgroundColor: "#cccccc",
      overflow: "hidden",
      [theme.breakpoints.down(1000)]: {
        height: 160,
      },
      [theme.breakpoints.down(700)]: {
        height: 130,
      },
    },
    player: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      height: "auto",
      backgroundColor: "#fff",
      borderRadius: 4,
      overflow: "hidden",
    },
    loader: {
      display: "block",
      margin: "20px auto",
    },
  });
