import { useEffect, useState } from "react";
import {
  useAddConnectAccountMutation,
  useConnectAccountMutation,
} from "../services/api";
import {
  Box,
  Button,
  Typography,
  CircularProgress,
  Alert,
  Paper,
} from "@mui/material";
import { createStyles } from "@mui/styles";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import theme from "../themes";

const ConnectStripe = () => {
  const [loading, setLoading] = useState(false);

  const [connectAccount, { isSuccess, isError, error, data }] =
    useConnectAccountMutation();
  const location = useLocation();
  const navigate = useNavigate();

  const [
    completeOnboarding,
    {
      isSuccess: isOnboardingComplete,
      isError: isOnboardingError,
      error: onboardingError,
    },
  ] = useAddConnectAccountMutation();

  const handleConnectStripe = async () => {
    setLoading(true);

    await connectAccount();
  };

  const handleSkip = async () => {
    navigate(`/feed`);
  };
  useEffect(() => {
    if (isSuccess && data) {
      setLoading(false);
      window.location.href = data?.data?.url;
    }
    if (isError) {
      setLoading(false);
    }
  }, [isSuccess, isError, error, data]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const accountId = params.get("account");
    const status = params.get("status");

    if (accountId && status === "complete") {
      completeOnboarding({ stripeAccountId: accountId });
    }
  }, [location, completeOnboarding]);

  useEffect(() => {
    if (isOnboardingComplete) {
      toast.success("Stripe Onboarding Completed");
    }
    if (isOnboardingError) {
      const Error = onboardingError as ApiError;
      toast.error(Error.data.message);
    }
  }, [isOnboardingComplete, isOnboardingError]);

  const styles = useStyles();

  return (
    <Box sx={styles.root}>
      <Paper sx={styles.container}>
        <Typography variant="h4" sx={styles.title}>
          Connect with Stripe
        </Typography>
        <Typography sx={styles.message}>
          To continue using ValueGivr, you need to connect with Stripe Connect.
          This is required to sell products, post exclusive content, and manage
          subscriptions.
        </Typography>
        {loading && (
          <>
            <CircularProgress size={24} sx={styles.loader} />
            <Typography sx={styles.infoText}>
              Setting up your Stripe Connect account. You will be redirected to
              the Stripe onboarding dashboard soon. Please wait...
            </Typography>
          </>
        )}
        <Button
          variant="contained"
          color="primary"
          onClick={handleConnectStripe}
          disabled={loading}
          sx={styles.button}
        >
          {loading ? "Connecting..." : "Connect Stripe"}
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={handleSkip}
          disabled={loading}
          sx={styles.button}
        >
          Skip to Home
        </Button>
        {isError && (
          <Alert severity="error" sx={styles.alert}>
            Failed to connect with Stripe. Please try again.
          </Alert>
        )}
      </Paper>
    </Box>
  );
};

export default ConnectStripe;

const useStyles = () =>
  createStyles({
    root: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      height: "100vh",
      backgroundColor: "#f0f0f0",
    },
    container: {
      marginLeft: "20%",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: "40px",
      maxWidth: "600px",
      backgroundColor: "#f9f9f9",
      borderRadius: "10px",
      boxShadow: "0 8px 16px rgba(0, 0, 0, 0.15)",
      fontFamily: "Inter, sans-serif",
      [theme.breakpoints.down(900)]: {
        marginLeft: 0,
        maxWidth: "80%",
      },
      [theme.breakpoints.down(600)]: {
        maxWidth: "70%",
      },
    },
    title: {
      marginBottom: "16px",
      fontSize: "26px",
      fontWeight: "bold",
      color: "#333",
      textAlign: "center",
    },
    message: {
      marginBottom: "24px",
      fontSize: "16px",
      textAlign: "center",
      color: "#555",
      lineHeight: "1.6",
    },
    button: {
      marginTop: "20px",
      width: "100%",
      maxWidth: "300px",
      boxShadow: "unset",
    },
    loader: {
      marginTop: "20px",
    },
    infoText: {
      marginTop: "10px",
      fontSize: "16px",
      color: "#555",
      textAlign: "center",
    },
    alert: {
      marginTop: "20px",
      width: "100%",
    },
  });
