import { Box, Button, CircularProgress, Typography } from "@mui/material";
import { createStyles } from "@mui/styles";
import { useEffect, useRef, useState } from "react";
import { ReactComponent as ImageStackIcon } from "../assets/svg/stack.svg";
import { ReactComponent as LockIcon } from "../assets/svg/lockIcon.svg";
import CustomModal from "./CustomModal";
import ImageSlider from "./ImageSlider";
import { useGetPostsQuery } from "../services/api";
import { chunkImages } from "../utils/helper";
import { useParams } from "react-router-dom";
import { RootState, useAppSelector } from "../store/store";
import theme from "../themes";
import ExclusivePurchaseModal from "./ExclusivePurchaseModal";
import { toast } from "react-toastify";

const ProfileImageTab = () => {
  const [chunkedArray, setChunkedArray] = useState<
    {
      images: string[];
      access_identifier: string;
      isPurchased: boolean;
      isSubscribed: boolean;
      price: string;
      user_id: {
        _id: string;
        displayName: string;
        profile_picture: string;
      };
      postId: string;
    }[][]
  >([]);
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [fullViewImageModal, setFullViewImageModal] = useState(false);
  const [selectedPage, setSelectedPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [initialLoad, setInitialLoad] = useState(true);
  const styles = useStyles();
  const { userId } = useParams<{ userId: string }>();
  const role = useAppSelector(
    (state: RootState) => state?.auth?.user?.lastActiveRole
  );
  const [selectedPostId, setSelectedPostId] = useState("");
  const [price, setPrice] = useState("");
  const [user, setUser] = useState<{
    _id: string;
    displayName: string;
    profile_picture: string;
  }>();
  const [isPurchaseModal, setIsPurchaseModal] = useState(false);

  const {
    data: postsData,
    isLoading: queryLoading,
    refetch,
  } = useGetPostsQuery({
    page: selectedPage,
    limit: 9,
    type: "IMAGE",
    creatorId: userId,
    role: role,
  });

  useEffect(() => {
    setSelectedPage(0);
    setInitialLoad(true);
  }, [isPurchaseModal]);

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
      const mappedPosts = postsData.data.posts.map((post: Post) => ({
        images: post.images,
        access_identifier: post.access_identifier || "",
        isPurchased: post.isPurchased ?? false,
        isSubscribed: post.isSubscribed ?? false,
        price: post.price ?? "",
        user_id: post.user_id ?? {
          _id: "",
          displayName: "",
          profile_picture: "",
        },
        postId: post._id || "",
      }));

      const newArr = chunkImages(mappedPosts, 3);

      setChunkedArray((prevChunkedArray) => {
        let combinedArray = selectedPage === 1 ? [] : [...prevChunkedArray];
        newArr.forEach((chunk) => {
          if (
            !combinedArray.some((existingChunk) =>
              existingChunk.some((post) =>
                chunk.some((newPost) => newPost.images.includes(post.images[0]))
              )
            )
          ) {
            combinedArray.push(chunk);
          }
        });
        return combinedArray;
      });

      setInitialLoad(false);
      setHasMore(true);
    } else if (postsData && postsData.data.posts.length === 0) {
      setHasMore(false);
    }
  }, [postsData, selectedPage]);

  useEffect(() => {
    if (queryLoading || !hasMore || initialLoad) return;

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
  }, [queryLoading, hasMore, initialLoad]);

  useEffect(() => {
    return () => {
      setSelectedPage(1);
      setChunkedArray([]);
      setHasMore(true);
      setInitialLoad(true);
    };
  }, []);

  const handleImageClick = (images: string[]) => {
    setSelectedImages(images);
    setFullViewImageModal(true);
  };

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

  const handlePurchase = (
    postId: string,
    user_id: { _id: string; displayName: string; profile_picture: string },
    price: string,
    access_identifier: string
  ) => {
    setUser(user_id);
    setPrice(price);
    setSelectedPostId(postId);

    if (access_identifier === "PAID") {
      setIsPurchaseModal(true);
    } else if (access_identifier === "SUBSCRIPTION") {
      toast.info(
        "You can subscribe to this creator by selecting plan from profile section"
      );
    }
  };

  return (
    <>
      {chunkedArray.map((row, index) => {
        return (
          <Box
            key={index}
            sx={{ display: "flex", flexDirection: "row", gap: 1.5 }}
            mt={index !== 0 ? 1.5 : 0}
          >
            {row.map((item, idx) => {
              const overlayVisible = shouldShowOverlay(
                item.access_identifier,
                item.isPurchased,
                item.isSubscribed
              );

              return (
                <Box
                  key={idx}
                  component="div"
                  onClick={
                    role === "FAN" && overlayVisible
                      ? () => {}
                      : () => handleImageClick(item.images)
                  }
                  sx={{
                    ...styles.uploadedImage,
                    backgroundImage: `url('${item.images[0]}')`,
                  }}
                >
                  {item.images.length > 1 && (
                    <ImageStackIcon
                      style={{
                        position: "absolute",
                        height: 25,
                        width: 25,
                        right: 10,
                      }}
                    />
                  )}

                  {overlayVisible && role === "FAN" && (
                    <Box sx={styles.overlayContainer}>
                      <Box sx={styles.lockOverlay}>
                        <LockIcon height={30} width={30} />
                        <Button
                          variant="contained"
                          sx={styles.overlayButton}
                          onClick={() =>
                            handlePurchase(
                              item.postId,
                              item.user_id,
                              item.price,
                              item.access_identifier
                            )
                          }
                        >
                          {item.access_identifier === "PAID"
                            ? `Buy for $${item.price || 0}`
                            : "Subscribe"}
                        </Button>
                      </Box>
                    </Box>
                  )}
                </Box>
              );
            })}
          </Box>
        );
      })}
      <div ref={lastPostRef} style={{ height: 1 }}></div>
      {queryLoading && (
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
      )}
      {!hasMore && !queryLoading && (
        <Box sx={{ display: "flex", justifyContent: "center", mt: "6px" }}>
          <Typography sx={styles.noMorePosts}>
            {chunkedArray.length === 0 ? "No Posts" : ""}
          </Typography>
        </Box>
      )}
      <CustomModal
        open={fullViewImageModal}
        setOpen={setFullViewImageModal}
        width="70%"
      >
        <ImageSlider images={selectedImages} setOpen={setFullViewImageModal} />
      </CustomModal>

      <CustomModal
        open={isPurchaseModal}
        setOpen={setIsPurchaseModal}
        width="450px"
        padding={2}
      >
        <ExclusivePurchaseModal
          closeModal={setIsPurchaseModal}
          user={user || { _id: "", displayName: "", profile_picture: "" }}
          postId={selectedPostId}
          price={price}
          refetch={refetch}
        />
      </CustomModal>
    </>
  );
};

export default ProfileImageTab;

const useStyles = () =>
  createStyles({
    uploadedImage: {
      height: 186,
      width: "32%",
      maxWidth: 186,
      borderRadius: 3,
      cursor: "pointer",
      backgroundColor: "#cccccc",
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat",
      backgroundSize: "cover",
      position: "relative",
      [theme.breakpoints.down(1000)]: {
        height: 160,
      },
      [theme.breakpoints.down(700)]: {
        height: 130,
      },
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
      background: "rgba(0, 0, 0, 0.5)",
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
      marginTop: 1,
    },
    noMorePosts: {
      textAlign: "center",
      width: "100%",
      marginTop: 2,
      color: "gray",
    },
  });
