import { Box, Button, Typography } from "@mui/material";
import { ReactComponent as CompanyLogo } from "../assets/svg/companyLogo.svg";
import { createStyles } from "@mui/styles";
import { useLocation, useNavigate } from "react-router-dom";
import { MuiOtpInput } from "mui-one-time-password-input";
import { useEffect, useState } from "react";
import { ReactComponent as BackIcon } from "../assets/svg/backArrow.svg";
import { toast } from "react-toastify";
import { mungeEmailAddress, timer } from "../utils/helper";
import { useVerifyOtpMutation } from "../services/api";
import backgroundImage from "./../assets/png/authenticationBackground.png";
import theme from "../themes";
import logo from "../assets/png/logo.png";

export default function OtpVerification() {
  const styles = useStyles(backgroundImage);
  const navigate = useNavigate();
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const { state } = useLocation();

  const [veifyOtp, { data, error: errorResponse, isSuccess, isError }] =
    useVerifyOtpMutation();

  const handleChange = (newValue: string) => {
    setOtp(newValue);
  };

  function isDigit(char: string) {
    return /^\d$/.test(char);
  }

  const validateChar = (value: string) => {
    return isDigit(value);
  };

  const handleOtpVerification = () => {
    if (otp.length < 6) {
      setError("Please enter valid OTP");
      return;
    }

    const data = {
      otp: otp,
      email: state?.email,
    };
    const result = veifyOtp(data);
    console.log(result);
  };

  useEffect(() => {
    if (isSuccess) {
      const responseData = data as VerifyOtpResponse;
      toast("Otp verified successfully", { type: "success" });
      navigate("/reset-password", {
        state: { resetToken: responseData?.data?.passwordResetToken },
      });
    }
    const apiError = errorResponse as ApiError;
    if (apiError) {
      toast(apiError?.data?.message, { type: "error" });
    }
  }, [isSuccess, isError]);

  useEffect(() => {
    if (otp.length > 5) setError("");
  }, [otp]);

  return (
    <Box sx={styles.container}>
      <Box sx={styles.cover}>
        <CompanyLogo style={{ marginTop: "2%", marginLeft: "2%" }} />
      </Box>
      <Box sx={styles.sideForm} pl={5}>
        <Box component="img" src={logo} sx={styles.logo}></Box>
        <Button
          onClick={() => navigate("/forgot-password")}
          sx={styles.backButton}
        >
          <BackIcon style={{ marginRight: 10 }} />
          Back
        </Button>
        <Box sx={styles.sideFormInner}>
          <Typography sx={styles.heading}>OTP Verification</Typography>
          <Typography
            sx={{
              fontSize: 15,
              textWrap: "nowrap",
              display: "flex",
              flexDirection: "column",
            }}
            mt={3}
          >
            Enter the OTP sent on{" "}
            <strong>{mungeEmailAddress(state?.email)}</strong>
          </Typography>
          <Box mt={4} sx={{ minWidth: "100%" }}>
            <MuiOtpInput
              length={6}
              autoFocus
              value={otp}
              validateChar={validateChar}
              onChange={handleChange}
              TextFieldsProps={{ size: "small" }}
              sx={{
                gap: "10px",
                "& .MuiInputBase-input": {
                  padding: "8px 0",
                },
              }}
            />
            {error && (
              <Typography sx={{ color: "red", minHeight: 24 }}>
                {error}
              </Typography>
            )}
          </Box>
          <Button
            onClick={handleOtpVerification}
            variant="contained"
            sx={styles.submitButton}
            fullWidth
          >
            Verify Now
          </Button>
          <Typography
            component="span"
            onClick={() =>
              toast.promise(timer(3000), {
                pending: "Sending new OTP",
                success: "OTP sent successfully!",
                error: "Something went wrong!",
              })
            }
            mt={5}
            textAlign="center"
            sx={{
              cursor: "pointer",
              width: "100%",
              fontSize: "0.875rem",
            }}
          >
            Didn’t receive the OTP? <strong>Resend OTP</strong>
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}

const useStyles = (backgroundImage: string) =>
  createStyles({
    container: {
      height: "100vh",
      width: "100vw",
      display: "flex",
      overflow: "hidden",
    },
    cover: {
      backgroundImage: `url(${backgroundImage})`,
      backgroundRepeat: "no-repeat",
      backgroundSize: "cover",
      width: "63%",
      [theme.breakpoints.down(600)]: {
        display: "none",
      },
    },
    sideForm: {
      width: "36%",
      backgroundColor: "white",
      borderTopLeftRadius: 30,
      borderBottomLeftRadius: 30,
      position: "absolute",
      height: "100%",
      right: 0,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      [theme.breakpoints.down(1000)]: {
        width: "42%",
      },
      [theme.breakpoints.down(600)]: {
        width: "100%",
        height: "unset",
      },
    },
    sideFormInner: {
      display: "flex",
      flexDirection: "column",
      alignItems: "flex-start",
      justifyContent: "center",
      width: "65%",
      [theme.breakpoints.down(800)]: {
        width: "85%",
        alignItems: "center",
      },
    },
    submitButton: {
      marginTop: 3,
      width: "100%",
      borderRadius: 2.5,
      textTransform: "initial",
      fontWeight: 300,
      fontSize: 15,
    },
    backButton: {
      position: "absolute",
      top: "5%",
      left: "10%",
      textTransform: "initial",
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      fontSize: 15,
      color: "rgba(69, 69, 69, 1)",
      fontWeight: 400,
    },
    heading: {
      fontSize: 30,
      fontWeight: 500,
      [theme.breakpoints.down(950)]: {
        fontSize: 24,
      },
    },
    logo: {
      height: 100,
      width: 100,
      margin: "60px 0px",
      display: "none",
      [theme.breakpoints.down(600)]: {
        display: "block",
      },
    },
  });
