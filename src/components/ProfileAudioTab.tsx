import { memo, useEffect, useRef, useState } from "react";
import { chunkAudios } from "../utils/helper";
import { Box, CircularProgress, Typography } from "@mui/material";
import ProfileAudioCard from "./ProfileAudioCard";
// import CustomModal from "./CustomModal";
import theme from "../themes";
import { useGetPostsQuery } from "../services/api";
import { useParams } from "react-router-dom";
import { createStyles } from "@mui/styles";
import { RootState, useAppSelector } from "../store/store";

const ProfileAudioTab = memo(() => {
  const [chunkedArray, setChunkedArray] = useState<
    {
      audio_url: string;
      accessIdentifier: string;
      isPurchased: boolean;
      isSubscribed: boolean;
      postId: string;
      user_id: {
        _id: string;
        displayName: string;
        profile_picture: string;
      };
      price: string;
    }[][]
  >([]);
  // const [isAudioPlayer, setIsAudioPlayer] = useState(false);
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
    type: "AUDIO",
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
      const audioPosts = postsData.data.posts
        .map((post: Post) => ({
          audio_url: post.audio_url ?? "",
          accessIdentifier: post.access_identifier ?? "",
          isPurchased: post.isPurchased ?? false,
          isSubscribed: post.isSubscribed ?? false,
          postId: post._id,
          user_id: {
            _id: post.user_id._id,
            displayName: post.user_id.displayName,
            profile_picture: post.user_id.profile_picture,
          },
          price: post.price ?? "",
        }))
        .filter((post) => post.audio_url);

      const newArr = chunkAudios(audioPosts, 2);

      setChunkedArray((prevChunkedArray) => {
        let combinedArray =
          selectedPage === 1 ? newArr : [...prevChunkedArray, ...newArr];
        setInitialLoad(false);
        return combinedArray;
      });
      setHasMore(true);
    } else if (postsData && postsData.data.posts.length === 0) {
      setHasMore(false);
      setInitialLoad(false);
    }
  }, [postsData, selectedPage]);

  useEffect(() => {
    if (isLoading || !hasMore || initialLoad) return;

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
      setInitialLoad(true);
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
          {row.map((audioPost, index) => (
            <ProfileAudioCard
              key={index}
              audio={audioPost.audio_url}
              access_identifier={audioPost.accessIdentifier}
              isPurchased={audioPost.isPurchased}
              isSubscribed={audioPost.isSubscribed}
              price={audioPost.price}
              user_id={audioPost.user_id}
              postId={audioPost.postId}
              setSelectedPage={setSelectedPage}
              refetch={refetch}
            />
          ))}
        </Box>
      ))}
      {initialLoad || isFetching ? (
        <Box sx={styles.Loader}>
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
      {/* <CustomModal open={isAudioPlayer} setOpen={setIsAudioPlayer} width="70%">
        <audio controls style={{ width: "100%" }} src={""} />
      </CustomModal> */}
    </>
  );
});

export default ProfileAudioTab;

const useStyles = () =>
  createStyles({
    player: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      height: "80vh",
      backgroundColor: "#fff",
      borderRadius: 4,
      overflow: "hidden",
      [theme.breakpoints.down(600)]: {
        height: "50vh",
      },
    },
    loader: {
      display: "block",
      margin: "20px auto",
    },
    Loader: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "100px",
    },
  });
