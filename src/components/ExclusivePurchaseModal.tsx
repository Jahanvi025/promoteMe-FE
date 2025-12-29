import {
  Avatar,
  Box,
  Button,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";
import { ReactComponent as CloseIcon } from "../assets/svg/cancel.svg";
import { createStyles } from "@mui/styles";
import { useEffect, useState } from "react";
import theme from "../themes";
import {
  useMakePaymentMutation,
  usePayFromWalletMutation,
  usePurchasePostMutation,
} from "../services/api";
import { toast } from "react-toastify";
import { loadStripe } from "@stripe/stripe-js";

interface Props {
  postId: string;
  closeModal: (value: boolean) => void;
  user: { _id: string; displayName: string; profile_picture: string };
  price: string;
  setIsPaid?: (value: boolean) => void;
  refetch?: () => void;
}

const ExclusivePurchaseModal = (props: Props) => {
  const { user, closeModal, postId, price, setIsPaid, refetch } = props;
  const styles = useStyles();
  const [paymentOption, setPaymentOption] = useState("");
  const stripePromise = loadStripe(
    import.meta.env.VITE_APP_STRIPE_PUBLISHABLE_KEY
  );

  const [purchasePost, { isSuccess, isError, error }] =
    usePurchasePostMutation();

  const [
    payFromWallet,
    { isSuccess: isPaid, isError: isWalletError, error: WalletError },
  ] = usePayFromWalletMutation();

  const [makePayment] = useMakePaymentMutation();

  const handleSubmit = async () => {
    if (!paymentOption) {
      toast.error("Please select a paymentMethod");
      return;
    }

    if (paymentOption === "Wallet") {
      await payFromWallet({
        amount: parseInt(price),
        creatorId: user._id || "",
        description: "Payment for post purchase",
      });
    }

    if (paymentOption === "Stripe") {
      const { data } = await makePayment({
        amount: parseInt(price),
        currency: "usd",
        paymentType: "postPurchase",
        ownerId: user?._id || "",
        redirectEndPoint: `feed`,
        quantity: 1,
        postId
      });

      if (data?.data?.id) {
        const stripe = await stripePromise;
        const error = await stripe?.redirectToCheckout({
          sessionId: data.data.id,
        });
        if (error) {
          toast.error("Failed to redirect to payment page.");
        }
      }
    }
  };

  const walletAmount = sessionStorage.getItem("walletBalance");

  useEffect(() => {
    if (isPaid) {
      const walletAmountValue = walletAmount ? parseInt(walletAmount, 10) : 0;
      const priceValue = price ? parseInt(price, 10) : 0;
      const remainingAmount = walletAmountValue - priceValue;
      sessionStorage.setItem("walletBalance", remainingAmount.toString());
      handlePurchase();
    }
    if (isWalletError) {
      const Error = WalletError as ApiError;
      toast.error(Error.data?.message);
    }
  }, [isPaid, isWalletError]);

  const handlePurchase = async () => {
    await purchasePost({ id: postId, paymentMethod: "Wallet" });
  };

  useEffect(() => {
    if (isSuccess) {
      refetch && refetch();
      toast.success("Purchase successful");
      setIsPaid && setIsPaid(true);
      closeModal(false);
    }
    if (isError) {
      const Error = error as ApiError;
      toast.error(Error.data.message);
    }
  }, [isSuccess, isError]);

  return (
    <Box sx={styles.container}>
      <Box sx={styles.header}>
        <Typography>Exclusive</Typography>
        <CloseIcon
          onClick={() => closeModal(false)}
          style={{ cursor: "pointer" }}
        />
      </Box>
      <Box sx={styles.contentSection}>
        <Box sx={styles.leftContainer}>
          <Avatar
            src={user?.profile_picture}
            sx={styles.profilePicture}
          ></Avatar>
          <Typography fontSize={16} fontWeight={500}>
            {user?.displayName}
          </Typography>
        </Box>
        <Box sx={styles.rightContainer}>
          <Box sx={{ display: "flex", gap: "10px", flexDirection: "column" }}>
            <Typography>Total Amount:</Typography>
            <Typography>{price}</Typography>
            <Typography
              fontSize={14}
              color={"rgba(119, 118, 122, 1)"}
              mt={"5px"}
            >
              Select Payment Option
            </Typography>
            <Select
              value={paymentOption}
              onChange={(e) => setPaymentOption(e.target.value)}
              displayEmpty
              inputProps={{ "aria-label": "Without label" }}
              sx={styles.select}
            >
              <MenuItem value="">Select</MenuItem>
              <MenuItem value="Wallet">Wallet</MenuItem>
              <MenuItem value="Stripe">Stripe</MenuItem>
            </Select>

            <Button
              variant="contained"
              sx={styles.button}
              onClick={handleSubmit}
            >
              Make Payment
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default ExclusivePurchaseModal;

const useStyles = () =>
  createStyles({
    container: {
      width: "100%",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
    },
    header: {
      display: "flex",
      width: `95%`,
      justifyContent: "space-between",
      alignItems: "center",
    },
    contentSection: {
      width: "95%",
      display: "flex",
      justifyContent: "space-between",
      marginTop: 3,
    },
    leftContainer: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
    },
    rightContainer: {
      width: "70%",
    },
    profilePicture: {
      height: 100,
      width: 100,
      borderRadius: "50%",
      objectFit: "cover",
    },
    select: {
      height: 40,
      borderRadius: 2,
      [theme.breakpoints.down(900)]: {
        width: 150,
      },
      [theme.breakpoints.down(900)]: {
        width: 160,
      },
    },
    button: {
      boxShadow: "unset",
      borderRadius: "10px",
    },
  });
