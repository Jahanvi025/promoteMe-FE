import { Box } from "@mui/material";
import { createStyles } from "@mui/styles";
import CustomModal from "./CustomModal";
import { memo, useState } from "react";
import CustomImage from "./CustomImage";
import { resolveContentLink } from "../utils/helper";

interface Props {
  image: File | string;
  images: (File | string)[];
  setImages: (value: (File | string)[]) => void;
}

const ImagePreview = memo((props: Props) => {
  const { image, images, setImages } = props;
  const [isImageModal, setIsImageModal] = useState(false);
  const styles = useStyles(resolveContentLink(image));

  return (
    <>
      <CustomImage
        image={image}
        images={images}
        setImages={setImages}
        setIsImageModal={setIsImageModal}
      />
      <CustomModal open={isImageModal} setOpen={setIsImageModal} width="50%">
        <Box sx={styles.image}></Box>
      </CustomModal>
    </>
  );
});

export default ImagePreview;

const useStyles = (url: string) =>
  createStyles({
    image: {
      height: "80vh",
      backgroundColor: "#cccccc",
      backgroundImage: `url('${url}')`,
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat",
      backgroundSize: "cover",
      borderRadius: 4,
    },
  });
