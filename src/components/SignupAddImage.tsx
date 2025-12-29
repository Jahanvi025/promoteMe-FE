import { Box, IconButton, Typography } from "@mui/material";
import DefaultUserImage from "../assets/png/defaultUserImage.png";
import { ReactComponent as CameraIcon } from "../assets/svg/camera.svg";
import { createStyles } from "@mui/styles";

interface Props {
  title: string;
}

export default function SignupAddImage(props: Props) {
  const { title } = props;
  const styles = useStyles();

  return (
    <Box mr={"3vw"} mt={5}>
      <Typography>{title} Image</Typography>
      <Box sx={styles.container}>
        <IconButton sx={styles.imagePicker}>
          <CameraIcon />
        </IconButton>
      </Box>
    </Box>
  );
}

const useStyles = () =>
  createStyles({
    container: {
      height: 130,
      width: 130,
      backgroundImage: `url(${DefaultUserImage})`,
      backgroundRepeat: "no-repeat",
      backgroundSize: "contain",
      position: "relative",
      borderRadius: 4,
    },
    imagePicker: {
      backgroundColor: "rgba(12, 143, 252, 1)",
      position: "absolute",
      bottom: 0,
      right: 0,
    },
  });
