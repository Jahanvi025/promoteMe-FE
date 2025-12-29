import { Box } from "@mui/material";
import ImagePreview from "./ImagePreview";
import { createStyles } from "@mui/styles";
import VideoPreview from "./VideoPreview";

interface Props {
  media: (File | string)[];
  type: UploaderType;
  thumbnail?: (File | string)[];
  isMainMedia?: boolean;
  setMedia: (value: (File | string)[]) => void;
  resetThumbnailAndTeaser?: () => void;
}

export default function MediaContainer(props: Props) {
  const {
    media,
    type,
    thumbnail,
    isMainMedia,
    setMedia,
    resetThumbnailAndTeaser,
  } = props;
  const styles = useStyles();

  return (
    <Box component="div" sx={styles.container}>
      {media.map((item) =>
        type === "IMAGE" ? (
          <ImagePreview
            key={typeof item === "string" ? item : item.name}
            image={item}
            images={media}
            setImages={setMedia}
          />
        ) : (
          <VideoPreview
            key={typeof item === "string" ? item : item.name}
            video={item}
            videos={media}
            thumbnail={thumbnail}
            setVideos={setMedia}
            resetThumbnailAndTeaser={resetThumbnailAndTeaser}
            isMainMedia={isMainMedia}
          />
        )
      )}
    </Box>
  );
}

const useStyles = () =>
  createStyles({
    container: {
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      maxWidth: "80%",
      overflowX: "auto",
      overflowY: "hidden",
      flexWrap: "nowrap",
    },
  });
