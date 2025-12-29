import { Box, IconButton } from "@mui/material";
import { ReactComponent as CancelIcon } from "../assets/svg/cancel.svg";
import { memo } from "react";
import { createStyles } from "@mui/styles";
import { resolveContentLink } from "../utils/helper";

interface Props {
  image: File | string;
  images: (File | string)[];
  setImages: (value: (File | string)[]) => void;
  setIsImageModal: (value: boolean) => void;
}

const CustomImage = memo((props: Props) => {
  const { image, images, setImages, setIsImageModal } = props;
  const styles = useStyles(resolveContentLink(image));
  const removeImageFromStack = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    event.stopPropagation();
    const filteredImages = images.filter((item) => {
      if (typeof image === "string") {
        if (typeof item !== "string" || item !== image) return item;
      } else {
        if (typeof item === "string" || item.name !== image.name) return item;
      }
    });
    setImages(filteredImages);
  };

  return (
    <Box
      component="div"
      onClick={() => setIsImageModal(true)}
      sx={styles.container}
      mx={0.75}
    >
      <IconButton onClick={removeImageFromStack} sx={styles.cancel}>
        <CancelIcon />
      </IconButton>
    </Box>
  );
});

export default CustomImage;

const useStyles = (url: string) =>
  createStyles({
    container: {
      height: 200,
      width: 200,
      minWidth: 200,
      position: "relative",
      backgroundColor: "#cccccc",
      backgroundImage: `url('${url}')`,
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat",
      backgroundSize: "cover",
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
  });
