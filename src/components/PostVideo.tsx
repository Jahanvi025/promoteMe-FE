import { Box, Typography } from "@mui/material";
import MediaContainer from "./MediaContainer";
import MediaPicker from "./MediaPicker";
import { createStyles } from "@mui/styles";
import theme from "../themes";
import { toast } from "react-toastify";
import ImagePreview from "./ImagePreview";
import VideoPreview from "./VideoPreview";

const imageAcceptedFormats = ["jpg", "png", "jpeg"];
const videoAcceptedFormats = ["mov", "mp4"];

interface Props {
  media: (File | string)[];
  setMedia: (value: (File | string)[]) => void;
  setThumbnail: React.Dispatch<React.SetStateAction<(string | File)[]>>;
  setTeaser: React.Dispatch<React.SetStateAction<(string | File)[]>>;
  thumbnail: (File | string)[];
  teaser: (File | string)[];
}

export default function PostVideo(props: Props) {
  const { media, setMedia, thumbnail, teaser, setThumbnail, setTeaser } = props;
  const styles = useStyles(media.length > 0);

  const handleThumbnailChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = event.target.files;
    if (files?.length) {
      for (let file of files) {
        const extension = file.name.split(".").pop();
        if (!imageAcceptedFormats.includes(extension ?? "")) {
          toast(
            "File format not supported, Please use jpg, png or jpeg formats",
            { type: "error" }
          );
          return;
        }
      }
      setThumbnail([...files]);
    }
  };

  const handleTeaserChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files?.length) {
      for (let file of files) {
        const extension = file.name.split(".").pop();
        if (!videoAcceptedFormats.includes(extension ?? "")) {
          toast("File format not supported, Please use mp4 or mov formats", {
            type: "error",
          });
          return;
        }
      }
      setTeaser([...files]);
    }
  };

  const resetThumbnail = () => {
    setThumbnail([]);
  };

  const resetTeaser = () => {
    setTeaser([]);
  };

  const isThumbnailValid = thumbnail.length > 0 && thumbnail[0] !== undefined;
  const isTeaserValid = teaser.length > 0 && teaser[0] !== undefined;

  return (
    <Box sx={{ display: "flex", flexDirection: "column" }}>
      <Box
        sx={{ display: "flex", flexDirection: "row", alignItems: "center" }}
        mt={4}
      >
        {media.length > 0 && (
          <MediaContainer
            media={media}
            type="VIDEO"
            thumbnail={thumbnail}
            setMedia={setMedia}
            resetThumbnailAndTeaser={resetThumbnail}
            isMainMedia
          />
        )}
        {media.length < 1 && (
          <MediaPicker media={media} type="VIDEO" setMedia={setMedia} />
        )}
      </Box>
      <Box mt={2} sx={{ display: "-webkit-box" }}>
        <Box
          sx={{
            ...styles.button,
            marginRight: 3,
            visibility: "visible",
            textAlign: "center",
          }}
        >
          <Box
            component="input"
            accept="image/*"
            type="file"
            sx={styles.input}
            onChange={handleThumbnailChange}
          />
          Add Thumbnail
        </Box>
        {teaser && (
          <Box sx={{ ...styles.button, paddingX: 7, textAlign: "center" }}>
            <Box
              component="input"
              accept="video/*"
              type="file"
              sx={styles.input}
              onChange={handleTeaserChange}
            />
            Add Teaser
          </Box>
        )}
      </Box>
      {media.length > 0 && (
        <Box
          mt={2}
          sx={{
            display: "flex",
            flexDirection: "row",
            [theme.breakpoints.down(600)]: {
              flexDirection: "column",
            },
          }}
        >
          {isThumbnailValid && (
            <Box
              mr={1.5}
              sx={{ visibility: isThumbnailValid ? "visible" : "hidden" }}
            >
              <Typography mb={1} fontWeight={500}>
                Thumbnail
              </Typography>
              <ImagePreview
                image={thumbnail[0]}
                images={thumbnail}
                setImages={setThumbnail}
              />
            </Box>
          )}
          {isTeaserValid && (
            <Box>
              <Typography mb={1} fontWeight={500}>
                Teaser
              </Typography>
              <VideoPreview
                video={teaser[0]}
                videos={teaser}
                setVideos={setTeaser}
                resetThumbnailAndTeaser={resetTeaser}
              />
            </Box>
          )}
        </Box>
      )}
    </Box>
  );
}

const useStyles = (isMedia: boolean) =>
  createStyles({
    button: {
      textTransform: "initial",
      borderRadius: 6,
      paddingX: 5,
      fontWeight: 400,
      height: 40,
      backgroundColor: isMedia
        ? theme.palette.primary.main
        : theme.palette.primary.light,
      color: "white",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: "Inter",
      position: "relative",
      cursor: "pointer",
      [theme.breakpoints.down(600)]: {
        paddingX: 3,
      },
    },
    input: {
      display: "block",
      height: "100%",
      width: "100%",
      position: "absolute",
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
      opacity: 0,
      cursor: "pointer",
    },
  });
