import { Box, useMediaQuery } from "@mui/material";
import { createStyles } from "@mui/styles";
import CustomModal from "../CustomModal";
import { useEffect, useState } from "react";
import PostImages from "./PostImages";
import ImageSlider from "../ImageSlider";
import theme from "../../themes";

interface Props {
  media: string[];
  isPreview?: boolean;
}

export default function ImageStack(props: Props) {
  const { media, isPreview } = props;
  const [selectedImage, setSelectedImage] = useState<SelectedImage>(-1);
  const [isImageModal, setIsImageModal] = useState(false);
  const styles = useStyles(media[selectedImage], media);
  const isMobile = useMediaQuery(theme.breakpoints.down(600));

  useEffect(() => {
    if (selectedImage !== -1) setIsImageModal(true);
    else setIsImageModal(false);
  }, [selectedImage]);

  useEffect(() => {
    if (!isImageModal) setSelectedImage(-1);
  }, [isImageModal]);

  return (
    <Box sx={styles.container}>
      <PostImages
        media={media}
        setSelectedImage={setSelectedImage}
        isPreview={isPreview}
      />
      <CustomModal
        open={isImageModal}
        setOpen={setIsImageModal}
        width={isMobile ? "90%" : "70%"}
      >
        <ImageSlider images={media} setOpen={setIsImageModal} />
      </CustomModal>
    </Box>
  );
}

const useStyles = (url: string, media: string[]) => {
  return createStyles({
    container: {
      height: 400,
      width: media.length === 1 ? "80%" : "100%",
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      overflow: "hidden",
      gap: 1,
    },
    image: {
      height: "80vh",
      backgroundColor: "#cccccc",
      backgroundImage: `url(${url})`,
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat",
      backgroundSize: "cover",
      borderRadius: 4,
    },
  });
};
