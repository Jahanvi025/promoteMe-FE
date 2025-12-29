import { Box, Button, IconButton, Typography } from "@mui/material";
import { ReactComponent as PlayIcon } from "../assets/svg/audioPlay.svg";
import { ReactComponent as DarkPlayIcon } from "../assets/svg/darkPlayButton.svg";
import { ReactComponent as PauseIcon } from "../assets/svg/pause.svg";
import WaveSurfer from "wavesurfer.js";
import { memo, useEffect, useRef, useState } from "react";
import theme from "../themes";
import { createStyles } from "@mui/styles";
import { formatTime } from "../utils/helper";
import CustomModal from "./CustomModal";
import ExclusivePurchaseModal from "./ExclusivePurchaseModal";
import { toast } from "react-toastify";
import { RootState, useAppSelector } from "../store/store";

interface Props {
  audio: string;
  isPost?: boolean;
  isGlobalAudioPlaying?: boolean;
  setIsGlobalAudioPlaying?: (value: boolean) => void;
  access_identifier?: string;
  isPurchased?: boolean;
  isSubscribed?: boolean;
  price?: string;
  user_id?: {
    _id: string;
    displayName: string;
    profile_picture: string;
  };
  postId?: string;
  refetch?: () => void;
  setSelectedPage?: (value: number) => void;
}

const ProfileAudioCard = memo((props: Props) => {
  const {
    audio,
    isPost,
    setIsGlobalAudioPlaying,
    access_identifier,
    isPurchased,
    isSubscribed,
    price,
    user_id,
    postId,
    setSelectedPage,
    refetch,
  } = props;

  const waveformRef = useRef<HTMLDivElement | null>(null);
  const [waveSurfer, setWaveSurfer] = useState<WaveSurfer | null>(null);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [audioDuration, setAudioDuration] = useState<number>(0);
  const [isOverlayVisible, setIsOverlayVisible] = useState<boolean>(false);
  const [isPurchaseModal, setIsPurchaseModal] = useState(false);
  const styles = useStyles(isPost);
  const role = useAppSelector(
    (state: RootState) => state?.auth?.user?.lastActiveRole
  );
  const [currentTime, setCurrentTime] = useState<number>(0);

  useEffect(() => {
    if (!waveformRef.current?.childElementCount) {
      const ws = WaveSurfer.create({
        container: waveformRef.current as HTMLElement,
        waveColor: "rgba(0, 0, 0, 1)",
        progressColor: theme.palette.primary.main,
        barGap: 3,
        barWidth: 3,
        barRadius: 10,
        cursorColor: "transparent",
        height: 60,
      });
      ws.load(audio);
      setWaveSurfer(ws);

      ws.on("ready", () => {
        setAudioDuration(Math.floor(ws.getDuration()));
      });

      ws.on("finish", () => {
        setIsPlayingAudio(false);
        setCurrentTime(audioDuration);
        ws.seekTo(0);
      });
    }
  }, [audio]);

  const handlePlayPause = () => {
    if (setIsGlobalAudioPlaying) {
      setIsGlobalAudioPlaying(false);
    }
    setIsPlayingAudio(!isPlayingAudio);
    waveSurfer?.playPause();
  };

  const handlePurchase = () => {
    if (access_identifier === "PAID") {
      setIsPurchaseModal(true);
    } else {
      toast.info(
        "You can subscribe to this creator by selecting a plan from the profile section."
      );
    }
  };

  useEffect(() => {
    const shouldShowOverlay =
      (access_identifier === "PAID" && !isPurchased) ||
      (access_identifier === "SUBSCRIPTION" && !isSubscribed);

    setIsOverlayVisible(shouldShowOverlay);
  }, [access_identifier, isPurchased, isSubscribed]);

  useEffect(() => {
    const handleAudioProcess = () => {
      if (waveSurfer) {
        setCurrentTime(Math.floor(waveSurfer.getCurrentTime()));
      }
    };

    if (waveSurfer) {
      waveSurfer.on("audioprocess", handleAudioProcess);
    }

    return () => {
      if (waveSurfer) {
        waveSurfer.un("audioprocess", handleAudioProcess);
      }
    };
  }, [waveSurfer]);

  useEffect(() => {
    setSelectedPage && setSelectedPage(1);
  }, [isPurchaseModal]);

  return (
    <Box sx={styles.card} mb={1.5}>
      <IconButton size="small" onClick={handlePlayPause}>
        {isPlayingAudio ? (
          <PauseIcon height={15} width={15} />
        ) : isPost ? (
          <DarkPlayIcon height={25} width={25} />
        ) : (
          <PlayIcon height={15} width={15} />
        )}
      </IconButton>
      {!isPost && (
        <Typography variant="body2" mr={1}>
          {formatTime(audioDuration)}
        </Typography>
      )}
      <div
        ref={waveformRef}
        style={{
          width: "70%",
        }}
      />
      {isPost && (
        <Typography ml={1} mr={3}>
          {formatTime(audioDuration - currentTime)}
        </Typography>
      )}
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

      <CustomModal
        open={isPurchaseModal}
        setOpen={setIsPurchaseModal}
        width="450px"
        padding={2}
      >
        <ExclusivePurchaseModal
          closeModal={setIsPurchaseModal}
          user={user_id || { _id: "", displayName: "", profile_picture: "" }}
          postId={postId || ""}
          price={price || ""}
          refetch={refetch}
        />
      </CustomModal>
    </Box>
  );
});

export default ProfileAudioCard;

const useStyles = (isPost?: boolean) =>
  createStyles({
    card: {
      height: 70,
      width: "100%",
      border: isPost ? "none" : "1px solid rgba(172, 184, 205, 1)",
      borderRadius: 4,
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: isPost ? "none" : "rgba(172, 184, 205, 0.1)",
      position: "relative",
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
      borderRadius: 4,
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
  });
