import { Box, Button } from "@mui/material";
import { createStyles } from "@mui/styles";
import { memo, useEffect, useState } from "react";
import ReactPlayer from "react-player";
import { ReactComponent as PlayIcon } from "../assets/svg/play.svg";
import theme from "../themes";
import CustomModal from "./CustomModal";
import ExclusivePurchaseModal from "./ExclusivePurchaseModal";
import { toast } from "react-toastify";
import { RootState, useAppSelector } from "../store/store";

interface Props {
  item: string;
  setSelectedVideo: (value: string) => void;
  setIsVideoPlayer: (value: boolean) => void;
  access_identifier: string;
  isPurchased: boolean;
  isSubscribed: boolean;
  postId: string;
  price: string;
  user_id: {
    _id: string;
    displayName: string;
    profile_picture: string;
  };
  refetch?: () => void;
  setSelectedPage?: (value: number) => void;
}

const ProfileVideoCard = memo((props: Props) => {
  const {
    item,
    setSelectedVideo,
    setIsVideoPlayer,
    access_identifier,
    isPurchased,
    isSubscribed,
    price,
    postId,
    user_id,
    refetch,
    setSelectedPage,
  } = props;

  const [isOverlayVisible, setIsOverlayVisible] = useState<boolean>(false);
  const [isPurchaseModal, setIsPurchaseModal] = useState<boolean>(false);
  const styles = useStyles();
  const role = useAppSelector(
    (state: RootState) => state?.auth?.user?.lastActiveRole
  );

  const handlePurchase = () => {
    if (access_identifier === "PAID") {
      setIsPurchaseModal(true);
    } else {
      toast.info(
        "You can subscribe to this creator by selecting plan from profile section"
      );
    }
  };

  useEffect(() => {
    setSelectedPage && setSelectedPage(1);
  }, [isPurchaseModal]);

  useEffect(() => {
    const shouldShowOverlay =
      (access_identifier === "PAID" && !isPurchased) ||
      (access_identifier === "SUBSCRIPTION" && !isSubscribed);

    setIsOverlayVisible(shouldShowOverlay);
  }, [access_identifier, isPurchased, isSubscribed]);

  return (
    <Box sx={styles.container}>
      <ReactPlayer
        sx={styles.player}
        url={item}
        wrapper={({ children }) => (
          <Box
            component="div"
            onClick={() => {
              setSelectedVideo(item);
              isOverlayVisible && role === "FAN"
                ? () => {}
                : setIsVideoPlayer(true);
            }}
            sx={styles.uploadedVideo}
          >
            {children}
            <Box sx={styles.playIconContainer}>
              <PlayIcon height={30} width={30} />
            </Box>

            {isOverlayVisible && role === "FAN" && (
              <Box sx={styles.overlayContainer}>
                <Box sx={styles.lockOverlay}>
                  <Button
                    variant="contained"
                    sx={styles.overlayButton}
                    onClick={handlePurchase}
                  >
                    {access_identifier === "PAID"
                      ? `Buy for $${price || 0}`
                      : "Subscribe"}
                  </Button>
                </Box>
              </Box>
            )}
          </Box>
        )}
      />
      <CustomModal
        open={isPurchaseModal}
        setOpen={setIsPurchaseModal}
        width="450px"
        padding={2}
      >
        <ExclusivePurchaseModal
          closeModal={setIsPurchaseModal}
          user={user_id}
          postId={postId}
          price={price}
          refetch={refetch}
        />
      </CustomModal>
    </Box>
  );
});

export default ProfileVideoCard;

const useStyles = () =>
  createStyles({
    container: {
      position: "relative",
      width: "32%",
      height: "100%",
      maxWidth: 186,
    },
    uploadedVideo: {
      height: 186,
      width: "100%",
      borderRadius: 3,
      cursor: "pointer",
      position: "relative",
      backgroundColor: "#cccccc",
      overflow: "hidden",
      objectFit: "cover",
      [theme.breakpoints.down(1000)]: {
        height: 160,
      },
      [theme.breakpoints.down(700)]: {
        height: 130,
        "& svg": {
          left: "35% !important",
          top: "40% !important",
        },
      },
      "& video": {
        objectFit: "cover",
      },
    },
    player: {
      borderRadius: 4,
      overflow: "hidden",
      width: "100%",
      height: "100%",
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
      marginTop: 1,
    },
    playIconContainer: {
      position: "absolute",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      zIndex: 10,
    },
  });
