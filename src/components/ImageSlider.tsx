import { Box, Button, Typography, useMediaQuery } from "@mui/material";
import { ReactComponent as BackIcon } from "../assets/svg/backArrow.svg";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { createStyles } from "@mui/styles";
import SliderButtonLeft from "./SliderButtonLeft";
import SliderButtonRight from "./SliderButtonRight";
import theme from "../themes";

interface Props {
  images: File[] | string[];
  setOpen: (value: boolean) => void;
}

export default function ImageSlider(props: Props) {
  const { images, setOpen } = props;
  const styles = useStyles();
  const isMobile = useMediaQuery(theme.breakpoints.down(900));

  const settings = {
    dots: true,
    infinite: false,
    speed: 300,
    slidesToShow: 1,
    slidesToScroll: 1,
    nextArrow: isMobile ? <></> : <SliderButtonRight />,
    prevArrow: isMobile ? <></> : <SliderButtonLeft />,
  };

  const resolveBackgroundImage = (image: File | string) => {
    if (typeof image === "string") return `url(${image})`;
    else return `url(${URL.createObjectURL(image)})`;
  };

  return (
    <Box sx={styles.container}>
      <Button onClick={() => setOpen(false)} sx={styles.back}>
        <BackIcon style={{ marginRight: 10 }} color="black" />
        <Typography sx={{ color: "black" }}>Back</Typography>
      </Button>
      <Slider {...settings}>
        {images.map((image) => {
          return (
            <Box
              sx={{
                ...styles.image,
                backgroundImage: resolveBackgroundImage(image),
              }}
            ></Box>
          );
        })}
      </Slider>
    </Box>
  );
}

const useStyles = () => {
  return createStyles({
    image: {
      height: "70vh",
      backgroundColor: "#cccccc",
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat",
      backgroundSize: "contain",
      borderRadius: 4,
      [theme.breakpoints.down(600)]: {
        height: "30vh",
      },
    },
    back: {
      textTransform: "initial",
      position: "absolute",
      top: "3%",
      left: "2%",
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
    },
    container: {
      position: "relative",
      paddingX: 15,
      paddingY: 5,
      height: "80vh",
      alignContent: "center",
      alignItems: "center",
      [theme.breakpoints.down(900)]: {
        paddingX: 0,
      },
      [theme.breakpoints.down(600)]: {
        height: "40vh",
        paddingX: 0,
      },
    },
  });
};
