import { Box } from "@mui/material";
import CustomVideo from "./CustomVideo";
import CustomModal from "./CustomModal";
import { createStyles } from "@mui/styles";
import { memo, useState } from "react";
import ReactPlayer from "react-player";
import { resolveContentLink } from "../utils/helper";
import theme from "../themes";

interface Props {
  video: File | string;
  videos: (File | string)[];
  thumbnail?: (File | string)[];
  isMainMedia?: boolean;
  setVideos: (value: (File | string)[]) => void;
  resetThumbnailAndTeaser?: () => void;
}

const VideoPreview = memo((props: Props) => {
  const { video, videos, thumbnail, setVideos, resetThumbnailAndTeaser } =
    props;
  const [isVideoModal, setIsVideoModal] = useState(false);
  const styles = useStyles();

  return (
    <>
      <CustomVideo
        video={video}
        videos={videos}
        thumbnail={thumbnail}
        setVideos={setVideos}
        setIsVideoModal={setIsVideoModal}
        resetThumbnailAndTeaser={resetThumbnailAndTeaser}
      />
      <CustomModal open={isVideoModal} setOpen={setIsVideoModal} width="70%">
        <ReactPlayer
          controls
          style={{ borderRadius: 4, overflow: "hidden" }}
          url={resolveContentLink(video)}
          wrapper={({ children }) => <Box sx={styles.player}>{children}</Box>}
        />
      </CustomModal>
    </>
  );
});

export default VideoPreview;

const useStyles = () =>
  createStyles({
    image: {
      height: "80vh",
      backgroundColor: "#cccccc",
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat",
      backgroundSize: "cover",
      borderRadius: 4,
      [theme.breakpoints.down(600)]: {
        height: "50vh",
      },
    },
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
  });
