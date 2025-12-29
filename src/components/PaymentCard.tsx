import { Box, IconButton, Typography } from "@mui/material";
import { createStyles } from "@mui/styles";
import masterCardLogo from "../assets/png/masterCardLogo.png";
import chipIcon from "../assets/png/cardChip.png";
import { ReactComponent as DeleteIcon } from "../assets/svg/deleteIcon.svg";
import visaCardLogo from "../assets/png/visaLogo.png";
import { useDeleteCardMutation } from "../services/api";
import { useEffect } from "react";
import { toast } from "react-toastify";

interface Props {
  name: string;
  type: string;
  expiry: string;
  cardNumber: string;
  id: string;
  refetch: () => void;
}

const PaymentCard = (props: Props) => {
  const { name, type, expiry, cardNumber, id, refetch } = props;

  const [deleteCard, { isSuccess, isError, error }] = useDeleteCardMutation();

  const handleDelete = async () => {
    if(id === "dummy"){
        toast.error("You cannot delete this card");
        return;
    }
    await deleteCard(id);
    refetch();
  };

  useEffect(() => {
    if (isSuccess) {
      toast.success("Card deleted successfully");
    }

    if (isError) {
      const Error = error as ApiError;
      toast.error(Error?.data?.message);
    }
  }, [isError, isSuccess]);
  const resolveBackground = (type: string) => {
    switch (type) {
      case "visa":
        return "linear-gradient(83.88deg, #3B3B3C 4.2%, #626366 97.58%)";
      case "mastercard":
        return "linear-gradient(91.04deg, #5126BA 1.37%, #3E278D 99.17%)";
      default:
        return "linear-gradient(91.04deg, #5126BA 1.37%, #3E278D 99.17%)";
    }
  };
  const styles = useStyles();
  return (
    <Box sx={{ background: resolveBackground(type), ...styles.container }}>
      <Box sx={styles.cardInfo}>
        <Box component="img" src={chipIcon}></Box>
        {type === "mastercard" || type === "visa" ? (
          <Box
            component="img"
            src={type === "mastercard" ? masterCardLogo : visaCardLogo}
          ></Box>
        ) : (
          <Typography fontSize={18} fontWeight={500} color={"white"}>
            {""}
          </Typography>
        )}
      </Box>
      <Typography fontSize={20} fontWeight={500} color={"white"} mt={2}>
        {cardNumber}
      </Typography>
      <Box sx={styles.userInfo}>
        <Box>
          <Typography color={"white"} fontSize={10} fontWeight={400}>
            Card Holder Name
          </Typography>
          <Typography color={"white"} fontSize={16} fontWeight={500}>
            {name}
          </Typography>
        </Box>
        <Box>
          <Typography color={"white"} fontSize={10} fontWeight={400}>
            Expiry Date
          </Typography>
          <Typography color={"white"} fontSize={16} fontWeight={500}>
            {expiry}
          </Typography>
        </Box>
        <IconButton onClick={handleDelete}>
          <DeleteIcon />
        </IconButton>
      </Box>
    </Box>
  );
};

export default PaymentCard;

const useStyles = () =>
  createStyles({
    container: {
      width: "100%",
      maxWidth: "280px",
      padding: "40px 20px 20px 20px",
      borderRadius: "24px",
      marginBottom: "20px",
    },
    cardInfo: {
      display: "flex",
      alignItems: "center",
      gap: "10px",
      width: "100%",
      justifyContent: "space-between",
    },
    userInfo: {
      marginTop: "10px",
      display: "flex",
      alignItems: "center",
      gap: "5px",
      width: "100%",
      justifyContent: "space-between",
    },
  });
