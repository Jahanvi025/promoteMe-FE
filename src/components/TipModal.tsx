import {
  Box,
  Button,
  Chip,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import { ReactComponent as CancelIcon } from "../assets/svg/cancel.svg";
import { createStyles } from "@mui/styles";
import { useEffect, useState } from "react";
import { usePayFromWalletMutation, useSendTipMutation } from "../services/api";
import { toast } from "react-toastify";
interface Props {
  setTipModal: (value: boolean) => void;
  setThankModal: (value: boolean) => void;
  postId: string;
  creatorId: string;
}

export default function TipModal(props: Props) {
  const { setTipModal, postId, setThankModal, creatorId } = props;
  const [selectedChip, setSelectedChip] = useState<number | null>(null);
  const [customTip, setCustomTip] = useState<string>();
  const [isError, setIsError] = useState<boolean>(false);
  const styles = useStyles(isError);

  const [sendTip] = useSendTipMutation();

  const [
    payFromWallet,
    {
      isSuccess: isPaid,
      isError: isWalletError,
      error: WalletError,
      isLoading,
    },
  ] = usePayFromWalletMutation();

  const handleDialogClose = () => {
    setTipModal(false);
  };

  const handleChipClick = (value: number) => {
    setSelectedChip(value);
    setIsError(false);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedChip(parseInt(event.target.value));
    setCustomTip(event.target.value);
    setIsError(false);
  };

  const handlePay = async () => {
    if (!selectedChip) {
      setIsError(true);
      return;
    }
    await payFromWallet({
      amount: selectedChip || 0,
      creatorId: creatorId || "",
      description: `tip send for postId ${postId}`,
    });
  };

  const walletAmount = sessionStorage.getItem("walletBalance");

  useEffect(() => {
    if (isPaid) {
      const walletAmountValue = walletAmount ? parseInt(walletAmount, 10) : 0;
      const priceValue = selectedChip || 0;
      const remainingAmount = walletAmountValue - priceValue;
      sessionStorage.setItem("walletBalance", remainingAmount.toString());
      handleSendTip();
    }
    if (isWalletError) {
      const Error = WalletError as ApiError;
      toast.error(Error.data?.message);
    }
  }, [isPaid, isWalletError, isLoading]);

  const handleSendTip = async () => {
    await sendTip({ id: postId, tipAmount: selectedChip || 0 });
    setThankModal(true);
    setTipModal(false);
  };

  return (
    <>
      <Box sx={styles.container}>
        <Box sx={styles.header}>
          <Typography fontSize={20}>Send Tip</Typography>
          <IconButton onClick={handleDialogClose} size="large">
            <CancelIcon color="black" />
          </IconButton>
        </Box>
        <Box sx={styles.chipContainer}>
          {[10, 20, 30, 40].map((label) => (
            <Chip
              key={label}
              label={`$${label}`}
              sx={{
                ...styles.chip,
                backgroundColor:
                  selectedChip === label
                    ? "rgba(12, 143, 252, 1)"
                    : "rgba(12, 143, 252, 0.08)",
                color: selectedChip === label ? "white" : "black",
              }}
              onClick={() => handleChipClick(label)}
            />
          ))}
        </Box>
        <TextField
          sx={styles.inputField}
          fullWidth
          placeholder="Enter Custom Amout"
          onChange={handleInputChange}
          type="number"
          value={customTip}
          error={isError}
        />
        {isError && (
          <Typography sx={styles.errorText}>
            Please select or enter a valid tip amount
          </Typography>
        )}
        <Button
          variant="contained"
          fullWidth
          sx={styles.button}
          onClick={handlePay}
        >
          Send Tip
        </Button>
      </Box>
    </>
  );
}

const useStyles = (isError: boolean) =>
  createStyles({
    container: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      width: "100%",
      minWidth: "250px",
    },
    header: {
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      gap: 4,
      width: "100%",
      justifyContent: "space-between",
    },
    chipContainer: {
      width: "100%",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      gap: 2,
      marginTop: 2,
      marginBottom: 1,
    },
    chip: {
      backgroundColor: "rgba(12, 143, 252, 0.08)",
      width: "25%",
      height: "40px",
      borderRadius: "10px",
    },
    button: {
      boxShadow: "unset",
      borderRadius: 2,
    },
    inputField: {
      marginTop: 2,
      marginBottom: isError ? 0 : 3,
      "& .MuiInputBase-input": {
        height: "10px",
      },
      '& input[type="number"]::-webkit-outer-spin-button, & input[type="number"]::-webkit-inner-spin-button':
        {
          "-webkit-appearance": "none",
          margin: 0,
        },
      '& input[type="number"]': {
        "-moz-appearance": "textfield",
      },
    },
    errorText: {
      color: "red",
      fontSize: "12px",
      alignSelf: "start",
      marginBottom: "10px",
    },
  });
