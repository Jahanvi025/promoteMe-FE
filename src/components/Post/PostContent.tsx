import { Box, Typography, Button } from "@mui/material";
import ImageStack from "./ImageStack";
import ReactPlayer from "react-player";
import { createStyles } from "@mui/styles";
import ProfileAudioCard from "../ProfileAudioCard";
import { useEffect, useState } from "react";
import { FaRegCirclePlay } from "react-icons/fa6";
import { ReactComponent as LockIcon } from "../../assets/svg/lockIcon.svg";
import { RootState, useAppSelector } from "../../store/store";
import CustomModal from "../CustomModal";
import ExclusivePurchaseModal from "../ExclusivePurchaseModal";
import { useNavigate } from "react-router-dom";
import { wrapEmojisInSpan } from "../../utils/helper";

interface Props {
  text: string;
  media: string[];
  video?: string;
  audio?: string;
  isPreview?: boolean;
  type: PostContentType;
  thumbnail_url?: string;
  teaser_url?: string;
  isPurchased?: boolean;
  isSubscribed?: boolean;
  access_identifier?: string;
  user: { _id: string; displayName: string; profile_picture: string };
  postId: string;
  username: string;
  price: string;
}

export default function PostContent(props: Props) {
  const {
    text,
    media,
    isPreview,
    video,
    audio,
    type,
    thumbnail_url,
    teaser_url,
    isPurchased,
    access_identifier,
    user,
    postId,
    price,
    isSubscribed,
  } = props;

  const [isPlaying, setIsPlaying] = useState(false);
  const [isTeaser, setIsTeaser] = useState(false);
  const [isPurchaseModal, setIsPurchaseModal] = useState(false);
  const [isPaid, setIsPaid] = useState(isPurchased);
  const [showSubscribeButton, setShowSubscribeButton] = useState(false);
  const role = useAppSelector(
    (state: RootState) => state?.auth?.user?.lastActiveRole
  );
  const [isOverlayVisible, setIsOverlayVisible] = useState(false);
  const styles = useStyles(media, isPreview, type, isOverlayVisible);

  const formattedDescription = wrapEmojisInSpan(text);

  const navigate = useNavigate();

  const handlePlayVideo = () => {
    setIsPlaying(true);
  };

  const toggleVideo = () => {
    setIsTeaser(!isTeaser);
  };

  useEffect(() => {
    setIsOverlayVisible(
      (access_identifier === "PAID" && !isPaid && role === "FAN") ||
        showSubscribeButton
    );
  }, [access_identifier, isPaid, role, showSubscribeButton]);

  useEffect(() => {
    if (
      role === "FAN" &&
      access_identifier === "SUBSCRIPTION" &&
      !isSubscribed
    ) {
      setShowSubscribeButton(true);
    } else {
      setShowSubscribeButton(false);
    }
  }, [access_identifier, isSubscribed]);

  useEffect(() => {
    if (teaser_url) {
      setIsTeaser(!isTeaser);
    }
    if (!thumbnail_url) {
      setIsPlaying(true);
    }
  }, []);

  const handleSubscribe = () => {
    navigate(`/profile/${user._id}`);
  };

  return (
    <Box mt={1} sx={styles.mediaContainer}>
      <Typography
        sx={styles.postDescription}
        dangerouslySetInnerHTML={{ __html: formattedDescription }}
      ></Typography>
      {media.length > 0 && <ImageStack media={media} isPreview={isPreview} />}

      {type === "VIDEO" && !isPlaying && (
        <>
          {thumbnail_url && (
            <Box
              sx={{
                backgroundImage: `url(${thumbnail_url})`,
                paddingTop: "56.25%",
                width: "100%",
                backgroundSize: "cover",
                backgroundPosition: "center",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                position: "relative",
                borderRadius: 4,
                cursor: "pointer",
                mb: 2,
              }}
              onClick={handlePlayVideo}
            >
              <Button
                sx={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  zIndex: 1,
                }}
              >
                <FaRegCirclePlay fontSize={50} color="white" />
              </Button>
            </Box>
          )}
          {teaser_url && !thumbnail_url && (
            <Box
              sx={{
                height: "300px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 4,
                cursor: "pointer",
                mb: 2,
              }}
              onClick={handlePlayVideo}
            >
              <FaRegCirclePlay fontSize={50} color="white" />
            </Box>
          )}
        </>
      )}

      {type === "VIDEO" && (isPlaying || (!teaser_url && !thumbnail_url)) && (
        <>
          <ReactPlayer
            controls
            style={{ borderRadius: 4, overflow: "hidden" }}
            url={isTeaser && teaser_url ? teaser_url : video}
            wrapper={({ children }) => <Box sx={styles.player}>{children}</Box>}
            onEnded={() => setIsPlaying(false)}
          />
          {teaser_url && !isTeaser && (
            <Button
              variant="contained"
              sx={{ marginTop: 1 }}
              onClick={toggleVideo}
            >
              Watch Teaser
            </Button>
          )}
          {teaser_url && isTeaser && (
            <Button
              variant="contained"
              onClick={toggleVideo}
              sx={{ marginTop: 1 }}
            >
              Watch Full Video
            </Button>
          )}
        </>
      )}

      {type === "AUDIO" && audio && <ProfileAudioCard audio={audio} isPost />}

      {(access_identifier === "PAID" && !isPaid && role === "FAN") ||
      (showSubscribeButton && role === "FAN")
        ? !isTeaser && (
            <Box sx={styles.overlayContainer}>
              <Box sx={styles.lockOverlay}>
                <LockIcon style={{ marginBottom: "10px" }} />
                <Button
                  variant="contained"
                  sx={{ boxShadow: "unset" }}
                  onClick={() => {
                    if (access_identifier === "PAID") {
                      setIsPurchaseModal(true);
                    } else {
                      handleSubscribe();
                    }
                  }}
                >
                  {access_identifier === "PAID"
                    ? "Purchase to Unlock"
                    : "Subscribe"}
                </Button>
              </Box>
            </Box>
          )
        : null}

      <CustomModal
        open={isPurchaseModal}
        setOpen={setIsPurchaseModal}
        width="450px"
        padding={2}
      >
        <ExclusivePurchaseModal
          closeModal={setIsPurchaseModal}
          user={user}
          postId={postId}
          price={price}
          setIsPaid={setIsPaid}
        />
      </CustomModal>
    </Box>
  );
}

const useStyles = (
  media: string[],
  isPreview: boolean | undefined,
  type: string | undefined,
  isOverlayVisible: boolean
) =>
  createStyles({
    player: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      height: "60vh",
      backgroundColor: "#fff",
      borderRadius: 4,
      overflow: "hidden",
    },
    postDescription: {
      fontSize: 14.5,
      marginBottom: 2,
      maxWidth: "100%",
      wordWrap: "break-word",
      overflowWrap: "break-word",
      display: "flex",
      alignItems: "center",
      width: "95%",
      "& .emoji": {
        fontSize: "22px",
      },
    },
    mediaContainer: {
      position: "relative",
      minHeight: isOverlayVisible ? "200px" : "unset",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: isPreview ? "left" : "center",
      marginBottom: "10px",
      width: "100%",
      height:
        type === "VIDEO"
          ? "auto"
          : type === "AUDIO"
          ? "15vh"
          : type === "TEXT"
          ? "fit-content"
          : media.length === 1
          ? "50vh"
          : "35vh",
      "& .MuiBox-root": {
        width: "100%",
        height: "100%",
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
      zIndex: 10,
      borderRadius: 4,
    },
    lockOverlay: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      color: "white",
      textAlign: "center",
    },
  });
