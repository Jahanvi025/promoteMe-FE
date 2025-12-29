import { Box, Typography } from "@mui/material";
import { ReactComponent as UploadIcon } from "../assets/svg/upload.svg";
import { createStyles } from "@mui/styles";
import { toast } from "react-toastify";

interface Props {
  media: (File | string)[];
  type: UploaderType;
  setMedia: (value: (File | string)[]) => void;
}

const imageAcceptedFormats = ["jpg", "png", "jpeg"];
const videoAcceptedFormats = ["mov", "mp4"];

export default function MediaPicker(props: Props) {
  const { media, type, setMedia } = props;
  const styles = useStyles();

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    const compareTo =
      type === "IMAGE" ? imageAcceptedFormats : videoAcceptedFormats;
    const errorMessage =
      type === "IMAGE"
        ? "File format not supported, Please use jpg, png or jpeg formats"
        : "File format not supported, Please use mp4 or mov formats";
    if (files?.length) {
      for (let file of files) {
        const extension = file.name.split(".").pop();
        if (!compareTo.includes(extension ?? "")) {
          toast(errorMessage, { type: "error" });
          return;
        }
      }
      setMedia([...media, ...files]);
    }
  };

  return (
    <Box component="div" className="dotted_border" sx={styles.container} ml={1}>
      <Box
        component="input"
        type="file"
        accept={type === "IMAGE" ? "image/*" : "video/*"}
        multiple={type === "IMAGE"}
        sx={styles.input}
        onChange={(e) => handleImageChange(e)}
      />
      <UploadIcon style={{ marginRight: 5, height: 20, width: 20 }} />
      <Typography>Upload {type}</Typography>
    </Box>
  );
}

const useStyles = () =>
  createStyles({
    container: {
      height: 200,
      width: 200,
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "rgba(255, 255, 255, 1)",
      borderRadius: 1,
      cursor: "pointer",
      position: "relative",
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
