import { Box, Button, Typography } from "@mui/material";
import { createStyles } from "@mui/styles";
import { ReactComponent as PublishSuccessIcon } from "../assets/svg/publishSuccess.svg";

interface Props {
  heading: string;
  subHeading: string;
  closeModal: (value: boolean) => void;
}

const ThankYouModal = (props: Props) => {
  const { heading, subHeading, closeModal } = props;
  const styles = useStyles();
  return (
    <Box sx={styles.publishModal}>
      <PublishSuccessIcon />
      <Typography variant="h5" mt={4} sx={{ textWrap: "nowrap" }}>
        {heading}
      </Typography>
      <Typography
        textAlign="center"
        mt={1}
        color="rgba(0, 0, 0, 0.7)"
        fontSize={13}
      >
        {subHeading}
      </Typography>
      <Button
        onClick={() => closeModal(false)}
        variant="contained"
        sx={styles.confirm}
      >
        Got it!
      </Button>
    </Box>
  );
};

export default ThankYouModal;

const useStyles = () =>
  createStyles({
    confirm: {
      marginTop: 4,
      borderRadius: 10,
      width: "50%",
      height: 40,
      boxShadow: "unset",
    },
    publishModal: {
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
    },
  });
