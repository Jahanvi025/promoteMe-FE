import { Box, IconButton } from "@mui/material";
import { createStyles } from "@mui/styles";
import { ReactComponent as CancelIcon } from "../assets/svg/cancel.svg";
import { memo } from "react";
import ReactPlayer from "react-player";
import { ReactComponent as PlayIcon } from "../assets/svg/play.svg";
import { resolveContentLink, resolveThumbnail } from "../utils/helper";
import theme from "../themes";

interface Props {
  video: File | string;
  videos: (File | string)[];
  thumbnail?: (File | string)[];
  isMainMedia?: boolean;
  setVideos: (value: (File | string)[]) => void;
  setIsVideoModal: (value: boolean) => void;
  resetThumbnailAndTeaser?: () => void;
}

const CustomVideo = memo((props: Props) => {
  const {
    video,
    videos,
    thumbnail,
    setVideos,
    setIsVideoModal,
    resetThumbnailAndTeaser,
  } = props;
  const styles = useStyles(resolveThumbnail(thumbnail));

  const removeVideoFromStack = () => {
    const filteredVideos = videos.filter((item) => {
      if (typeof video === "string") {
        if (typeof item !== "string" || item !== video) return item;
      } else {
        if (typeof item === "string" || item.name !== video.name) return item;
      }
    });
    setVideos(filteredVideos);
    resetThumbnailAndTeaser && resetThumbnailAndTeaser();
  };

  return (
    <>
      {thumbnail && thumbnail[0] ? (
        <Box
          component="div"
          onClick={() => setIsVideoModal(true)}
          mr={1.5}
          sx={styles.thumbnail}
        >
          <IconButton onClick={removeVideoFromStack} sx={styles.cancel}>
            <CancelIcon />
          </IconButton>
          <PlayIcon
            style={{
              position: "absolute",
              height: 30,
              width: 30,
              left: "45%",
              top: "45%",
              [theme.breakpoints.down(1200)]: {
                left: "35%",
              },
            }}
          />
        </Box>
      ) : (
        <ReactPlayer
          url={resolveContentLink(video)}
          wrapper={({ children }) => (
            <Box
              component="div"
              onClick={() => setIsVideoModal(true)}
              mr={1.5}
              sx={styles.player}
            >
              {children}
              <IconButton onClick={removeVideoFromStack} sx={styles.cancel}>
                <CancelIcon />
              </IconButton>
              <PlayIcon
                style={{
                  position: "absolute",
                  height: 30,
                  width: 30,
                  left: "45%",
                  top: "45%",
                  [theme.breakpoints.down(1200)]: {
                    left: "35% !important",
                  },
                }}
              />
            </Box>
          )}
        />
      )}
    </>
  );
});

export default CustomVideo;

const useStyles = (thumbnail: string) => {
  return createStyles({
    container: {
      height: 200,
      width: 200,
      minWidth: 200,
      position: "relative",
      backgroundColor: "#cccccc",
      borderRadius: 4,
      cursor: "pointer",
    },
    cancel: {
      position: "absolute",
      top: 10,
      right: 10,
      height: 30,
      width: 30,
      backgroundColor: "rgba(255, 255, 255, 0.5)",
      borderRadius: 2,
    },
    player: {
      height: 200,
      width: "35%",
      minWidth: 200,
      backgroundColor: "#cccccc",
      backgroundImage: thumbnail,
      overflow: "hidden",
      borderRadius: 4,
      cursor: "pointer",
      position: "relative",

      "& video": {
        objectFit: "cover",
      },
    },
    thumbnail: {
      height: 200,
      width: 200,
      minWidth: 200,
      backgroundColor: "#cccccc",
      backgroundImage: `url(${thumbnail})`,
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat",
      backgroundSize: "cover",
      overflow: "hidden",
      borderRadius: 4,
      cursor: "pointer",
      position: "relative",
    },
  });
};
