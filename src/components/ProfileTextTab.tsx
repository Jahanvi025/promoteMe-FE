import { useEffect, useRef, useState } from "react";
import { Box, Typography, CircularProgress, Button } from "@mui/material";
import { createStyles } from "@mui/styles";
import { useGetPostsQuery } from "../services/api";
import { useParams } from "react-router-dom";
import { ReactComponent as LockIcon } from "../assets/svg/lockIcon.svg";
import { RootState, useAppSelector } from "../store/store";

export default function ProfileTextTab() {
  const [texts, setTexts] = useState<Post[]>([]);
  const [selectedPage, setSelectedPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const styles = useStyles();
  const { userId } = useParams<{ userId: string }>();
  const role = useAppSelector(
    (state: RootState) => state?.auth?.user?.lastActiveRole
  );

  const {
    data: postsData,
    isLoading,
    refetch,
  } = useGetPostsQuery({
    page: selectedPage,
    limit: 9,
    type: "TEXT",
    creatorId: userId,
    role: role,
  });

  useEffect(() => {
    setSelectedPage(1);
    refetch();
  }, [refetch]);

  const observer = useRef<IntersectionObserver | null>(null);
  const lastPostRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (postsData && postsData.data.posts.length > 0) {
      setTexts((prevTexts) => [...prevTexts, ...postsData.data.posts]);
    } else if (postsData && postsData.data.posts.length === 0) {
      setHasMore(false);
    }
  }, [postsData]);

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
      setTexts([]);
      setHasMore(true);
    };
  }, []);

  const shouldShowOverlay = (
    access_identifier: string,
    isPurchased: boolean,
    isSubscribed: boolean
  ) => {
    return (
      (access_identifier === "PAID" && !isPurchased) ||
      (access_identifier === "SUBSCRIPTION" && !isSubscribed)
    );
  };

  return (
    <Box mr={3.5}>
      {texts.map((post, index) => {
        const overlayVisible = shouldShowOverlay(
          post.access_identifier || "",
          post.isPurchased || false,
          post.isSubscribed || false
        );

        return (
          <Box key={index} sx={styles.card} p={3} px={5} mb={2}>
            {overlayVisible && role === "FAN" && (
              <Box sx={styles.overlayContainer}>
                <Box sx={styles.lockOverlay}>
                  <LockIcon height={20} width={20} />
                  <Button
                    variant="contained"
                    sx={styles.overlayButton}
                    onClick={() =>
                      alert("Purchase or Subscribe to view this content")
                    }
                  >
                    {post.access_identifier === "PAID"
                      ? `Buy for $${post.price || 0}`
                      : "Subscribe"}
                  </Button>
                </Box>
              </Box>
            )}
            <Typography sx={styles.text}>{post.description}</Typography>
          </Box>
        );
      })}
      {hasMore ? (
        <div ref={lastPostRef} style={{ height: 1 }}></div>
      ) : (
        <Typography sx={styles.noMorePosts}>
          {texts.length === 0 ? "No Posts" : ""}
        </Typography>
      )}
      {isLoading && <CircularProgress sx={styles.loader} />}
    </Box>
  );
}

const useStyles = () =>
  createStyles({
    card: {
      position: "relative",
      border: "1px solid rgba(172, 184, 205, 1)",
      borderRadius: 4,
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "flex-start",
      backgroundColor: "rgba(172, 184, 205, 0.1)",
      // minHeight: "30px",
    },
    text: {
      wordBreak: "break-word",
      overflowWrap: "break-word",
      whiteSpace: "pre-wrap",
    },
    noMorePosts: {
      textAlign: "center",
      width: "100%",
      marginTop: 2,
      color: "gray",
    },
    loader: {
      display: "block",
      margin: "20px auto",
    },
    overlayContainer: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      backdropFilter: "blur(8px)",
      background: "rgba(0, 0, 0, 0.2)",
      zIndex: 20,
      borderRadius: 3,
      pointerEvents: "auto",
    },
    lockOverlay: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      color: "white",
      textAlign: "center",
    },
    overlayButton: {
      boxShadow: "unset",
      marginTop: "5px",
    },
  });
