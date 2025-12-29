import { Box } from "@mui/material";
import MediaPicker from "./MediaPicker";
import MediaContainer from "./MediaContainer";

interface Props {
  media: (File | string)[];
  setMedia: (value: (File | string)[]) => void;
}

export default function PostImage(props: Props) {
  const { media, setMedia } = props;

  return (
    <Box
      sx={{ display: "flex", flexDirection: "row", alignItems: "center" }}
      mt={4}
    >
      {media.length > 0 && (
        <MediaContainer media={media} setMedia={setMedia} type="IMAGE" />
      )}
      <MediaPicker setMedia={setMedia} media={media} type="IMAGE" />
    </Box>
  );
}
