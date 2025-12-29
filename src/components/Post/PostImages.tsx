import { Avatar, Box, Typography, useMediaQuery } from "@mui/material";
import { createStyles } from "@mui/styles";
import { memo } from "react";
import theme from "../../themes";

interface Props {
  media: string[];
  setSelectedImage: (value: SelectedImage) => void;
  isPreview?: boolean;
}

const PostImages = memo((props: Props) => {
  const { media, isPreview, setSelectedImage } = props;

  const isMobile = useMediaQuery(theme.breakpoints.down(600));
  const styles = useStyles(media.length, isPreview);
  const handleOpenImageModal = (value: SelectedImage) => {
    if (isPreview) return;
    setSelectedImage(value);
  };

  return (
    <>
      <Avatar
        component="div"
        onClick={() => handleOpenImageModal(0)}
        sx={styles.mainImage}
        alt="main-image"
        src={media[0] ?? ""}
      />
      {media.length > 1 && (
        <Box sx={styles.secondImage} onClick={() => handleOpenImageModal(1)}>
          <Avatar
            component="div"
            sx={{
              width: "100%",
              height: "100%",
              borderRadius: 4,
              ...styles.blurredImage,
            }}
            alt="small-image"
            src={media[1] ?? ""}
          />
          {media.length > 2 && isMobile && (
            <Typography
              sx={styles.extraImageCounter}
              onClick={() => handleOpenImageModal(1)}
            >
              +{media.length - 1}
            </Typography>
          )}
        </Box>
      )}
      {!isMobile && media.length > 2 && (
        <Box sx={styles.extraContainer}>
          <Avatar
            component="div"
            onClick={() => handleOpenImageModal(2)}
            sx={styles.thirdImage}
            alt="small-image"
            src={media[2] ?? ""}
          />
          {media.length > 3 && (
            <Typography
              sx={styles.extraImageCounter}
              onClick={() => handleOpenImageModal(2)}
            >
              +{media.length - 2}
            </Typography>
          )}
        </Box>
      )}
    </>
  );
});

export default PostImages;

const useStyles = (imageCount: number, isPreview: boolean | undefined) => {
  return createStyles({
    mainImage: {
      width: imageCount > 1 ? "49%" : "100%",
      height: "100%",
      borderRadius: 4,
      cursor: isPreview ? "default" : "pointer",

      [theme.breakpoints.down(1000)]: {
        width: imageCount > 1 ? "49%" : imageCount > 2 ? "40%" : "100%",
      },
      [theme.breakpoints.down(600)]: {
        width: imageCount > 1 ? "49%" : "100%",
      },
    },
    secondImage: {
      width: imageCount === 1 ? 0 : imageCount === 2 ? "50%" : "25%",
      height: "100%",
      borderRadius: 4,
      cursor: isPreview ? "default" : "pointer",
      position: "relative",

      [theme.breakpoints.down(600)]: {
        width: "100%",
      },
    },
    extraImageCounter: {
      position: "absolute",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      fontSize: 20,
      color: "white",
      fontWeight: 500,
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      borderRadius: "50%",
      padding: "5px 10px",
      cursor: "pointer",
    },
    extraContainer: {
      width: imageCount > 2 ? "25%" : 0,
      height: "100%",
      borderRadius: 4,
      position: "relative",
      [theme.breakpoints.down(1000)]: {
        width: imageCount > 2 ? "30%" : 0,
      },
    },
    thirdImage: {
      height: "100%",
      width: "100%",
      filter: imageCount > 3 ? "brightness(50%)" : "none",
      borderRadius: 4,
      cursor: isPreview ? "default" : "pointer",
    },
    blurredImage: {
      width: "100%",
      height: "100%",
      [theme.breakpoints.down(600)]: {
        filter: imageCount > 2 ? "brightness(50%)" : "none",
      },
    },
    // extraImageCounter: {
    //   position: "absolute",
    //   top: "48%",
    //   left: "45%",
    //   fontSize: 20,
    //   color: "white",
    //   fontWeight: 500,
    // },
  });
};
