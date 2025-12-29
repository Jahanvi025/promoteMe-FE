import { Box, Button, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { createStyles } from "@mui/styles";
import CustomInput from "../components/CustomInput";
import { ReactComponent as CompanyLogo } from "../assets/svg/companyLogo.svg";
import { ReactComponent as BackIcon } from "../assets/svg/backArrow.svg";
import { useForm, SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { forgotPasswordSchema } from "../utils/validations";
import { useForgotPasswordOtpMutation } from "../services/api";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import backgroundImage from "./../assets/png/authenticationBackground.png";
import theme from "../themes";
import logo from "../assets/png/logo.png";

export default function ForgotPassword() {
  const navigate = useNavigate();
  const styles = useStyles(backgroundImage);
  const [forgotPasswordOtp, { error, isSuccess, isError, isLoading }] =
    useForgotPasswordOtpMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormInputs>({
    resolver: yupResolver(forgotPasswordSchema),
  });
  const [userEmail, setEmail] = useState("");
  const [isDisabled, setDisabled] = useState(false);
  const onSubmit: SubmitHandler<ForgotPasswordFormInputs> = async (data) => {
    setDisabled(true);
    const { email } = data;
    setEmail(email);
    const result = await forgotPasswordOtp({ email });
    console.log(result);
  };

  useEffect(() => {
    if (isLoading) {
      toast.loading("Sending OTP...");
    }

    if (isSuccess) {
      navigate("/feed");
      navigate("/otp-verification", { state: { email: userEmail } });
      toast.dismiss();
      toast("Otp sent successfully", { type: "success" });
    }

    if (isError) {
      setDisabled(false);
      toast.dismiss();
      const apiError = error as ApiError;
      const errorMessage = apiError?.data?.message;
      if (errorMessage) {
        toast(errorMessage, { type: "error" });
      }
    }
  }, [isSuccess, isError, isLoading]);

  return (
    <Box sx={styles.container}>
      <Box sx={styles.cover}>
        <CompanyLogo style={{ marginTop: "2%", marginLeft: "2%" }} />
      </Box>
      <Box sx={styles.sideForm} pl={5}>
        <Box component="img" src={logo} sx={styles.logo}></Box>
        <Button onClick={() => navigate("/login")} sx={styles.backButton}>
          <BackIcon style={{ marginRight: 10 }} />
          Back
        </Button>
        <Box sx={styles.sideFormInner}>
          <Typography sx={styles.heading}>Forgot Password?</Typography>
          <Typography sx={{ fontSize: 15 }} mt={2}>
            Enter Email Address to get OTP
          </Typography>
          <form style={{ width: "100%" }} onSubmit={handleSubmit(onSubmit)}>
            <Box mt={3} sx={{ width: "100%" }}>
              <CustomInput
                title="Email"
                register={register}
                name="email"
                error={errors.email?.message}
                customWidth="100%"
                customSize={true}
                customLabel={true}
                isAuth
              />
            </Box>
            <Button
              type="submit"
              variant="contained"
              sx={styles.submitButton}
              fullWidth
              disabled={isDisabled}
            >
              Continue
            </Button>
          </form>
        </Box>
      </Box>
    </Box>
  );
}

const useStyles = (backgroundImage: string) =>
  createStyles({
    container: {
      height: "100vh",
      width: "100%",
      display: "flex",
    },
    cover: {
      backgroundImage: `url(${backgroundImage})`,
      backgroundRepeat: "no-repeat",
      backgroundSize: "cover",
      width: "62%",
      [theme.breakpoints.down(600)]: {
        display: "none",
      },
    },
    sideForm: {
      width: "38%",
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
      [theme.breakpoints.down(600)]: {
        marginTop: 0,
        fontSize: 28,
      },
    },
    logo: {
      height: 100,
      width: 100,
      margin: "85px 0px",
      display: "none",
      [theme.breakpoints.down(600)]: {
        display: "block",
      },
    },
  });
