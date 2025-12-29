import {
  Box,
  Button,
  CircularProgress,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import theme from "../themes";
import PageHeader from "../components/PageHeader";
import { createStyles } from "@mui/styles";
import { ReactComponent as BackIcon } from "../assets/svg/backArrow.svg";
import { useNavigate } from "react-router-dom";
import { CustomCard } from "../components/Account/CustomCard";
import { ReactComponent as WalletIcon } from "../../src/assets/svg/walletIconWhite.svg";
import { ChangeEvent, useEffect, useState } from "react";
import {
  useDepositBalanceMutation,
  useGetWalletBalanceQuery,
} from "../services/api";
import { loadStripe } from "@stripe/stripe-js";

const Wallet = () => {
  const styles = useStyles();
  const navigate = useNavigate();
  const [depositAmount, setDepositAmount] = useState(0);
  const [balance, setBalance] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const stripePromise = loadStripe(
    import.meta.env.VITE_APP_STRIPE_PUBLISHABLE_KEY
  );

  const handleClick = () => {
    navigate("/feed");
  };

  const [deposit, { data, isSuccess }] = useDepositBalanceMutation();
  const {
    data: walletBalance,
    refetch,
    isLoading,
    isFetching,
  } = useGetWalletBalanceQuery();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);

    if (isNaN(value)) {
      setDepositAmount(0);
      setError("");
    } else if (value < 5) {
      setError("Amount must be at least $5");
      setDepositAmount(parseInt(e.target.value));
    } else if (value > 10000) {
      setError("Amount cannot exceed $10,000");
      setDepositAmount(parseInt(e.target.value));
    } else {
      setError("");
      setDepositAmount(parseInt(e.target.value));
    }
  };

  useEffect(() => {
    if (walletBalance && walletBalance.data) {
      setBalance(walletBalance.data?.balance);
    }
  });
  useEffect(() => {
    if (walletBalance && walletBalance.data) {
      setBalance(walletBalance.data?.balance);
    }
  }, [refetch]);

  const handleDeposit = async () => {
    try {
      await deposit({ amount: depositAmount });
    } catch (err) {
      console.error("Failed to create deposit session:", err);
    }
  };

  useEffect(() => {
    const redirectToStripeCheckout = async () => {
      if (isSuccess) {
        const stripe = await stripePromise;
        const sessionId = data?.data?.id || "";

        if (stripe && sessionId) {
          const { error } = await stripe.redirectToCheckout({ sessionId });
          if (error) {
            setError(error.message || "");
          }
        }
      }
    };

    redirectToStripeCheckout();
  }, [isSuccess, data, stripePromise]);

  return (
    <Box sx={styles.container}>
      <PageHeader title="Wallet" width="100%" />
      <Box sx={styles.contentSection}>
        <Box sx={styles.header}>
          <Button onClick={handleClick} sx={{ textTransform: "initial" }}>
            <BackIcon
              style={{ marginRight: 10 }}
              color="rgba(12, 143, 252, 1)"
            />
            <Typography color="rgba(12, 143, 252, 1)">Back</Typography>
          </Button>
        </Box>
        <Typography fontWeight={500} fontSize={18} mt={2}>
          Add money to your wallet
        </Typography>
        <Box sx={styles.innerContainer}>
          <Box>
            {isLoading || isFetching ? (
              <CircularProgress size={40} />
            ) : (
              <CustomCard
                heading="Wallet Balance"
                subheading={`$${balance}`}
                width="200px"
                icon={WalletIcon}
                align="left"
                isborder
              />
            )}
          </Box>
          <Box
            sx={{
              width: "50%",
              [theme.breakpoints.down(600)]: {
                width: "100%",
              },
            }}
          >
            <Typography
              fontSize={14}
              color={"rgba(119, 118, 122, 1)"}
              mb={"3px"}
            >
              Enter Amount*
            </Typography>
            <TextField
              fullWidth
              sx={styles.inputField}
              placeholder="Enter Amount"
              type="number"
              value={depositAmount === 0 ? "" : depositAmount}
              helperText={error || "Max: $10000, Min: $5"}
              error={!!error}
              FormHelperTextProps={{ sx: styles.helperText }}
              onChange={handleChange}
            />

            <Typography
              fontSize={14}
              color={"rgba(119, 118, 122, 1)"}
              mt={2}
              mb={"3px"}
            >
              Coupon Code (If any)
            </Typography>
            <TextField
              sx={styles.inputField}
              fullWidth
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <Button
                      variant="contained"
                      sx={{ height: "41px", width: "100px", fontWeight: "400" }}
                    >
                      Apply
                    </Button>
                  </InputAdornment>
                ),
              }}
            />
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                marginY: 2,
              }}
            >
              <Typography fontSize={20} fontWeight={500}>
                Total
              </Typography>
              <Typography
                fontSize={20}
                fontWeight={500}
                sx={{
                  "& span": {
                    color: "rgba(119, 118, 122, 1)",
                    fontSize: "18px",
                    fontWeight: "400",
                  },
                }}
              >
                ${depositAmount} <span>USD</span>
              </Typography>
            </Box>
            <Button
              fullWidth
              variant="contained"
              sx={styles.button}
              onClick={handleDeposit}
              disabled={
                !depositAmount || depositAmount < 5 || depositAmount > 10000
              }
            >
              Add To Wallet
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Wallet;

const useStyles = () =>
  createStyles({
    container: {
      marginLeft: "24%",
      display: "flex",
      flexDirection: "column",
      paddingRight: "2%",
      position: "sticky",
      top: "109px",
      marginTop: "105px",
      [theme.breakpoints.down(900)]: {
        marginLeft: "5%",
        marginTop: "102px",
        justifyContent: "center",
        alignItems: "center",
      },
      [theme.breakpoints.down(600)]: {
        marginLeft: "2%",
        marginTop: "60px",
      },
    },
    contentSection: {
      width: "70%",
      display: "flex",
      flexDirection: "column",
      marginLeft: "2px",
      marginRight: "20px",
      [theme.breakpoints.down(1150)]: {
        width: "95%",
      },
      [theme.breakpoints.down(600)]: {
        width: "92%",
        flexDirection: "column",
      },
    },
    header: {
      width: "100%",
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    innerContainer: {
      marginY: 2,
      display: "flex",
      flexDirection: "row",
      width: "100%",
      justifyContent: "space-between",
      gap: "20px",
      [theme.breakpoints.down(600)]: {
        flexDirection: "column",
      },
    },
    inputField: {
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
      "& .MuiOutlinedInput-root": {
        paddingRight: "0",
      },
    },
    helperText: {
      position: "absolute",
      right: "5px",
      bottom: "2px",
      marginLeft: "auto",
    },
    button: {
      boxShadow: "unset",
      borderRadius: "8px",
    },
  });
