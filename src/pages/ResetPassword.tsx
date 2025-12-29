import { Box, Button, Typography } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import { createStyles } from "@mui/styles";
import CustomInput from "../components/CustomInput";
import { ReactComponent as CompanyLogo } from "../assets/svg/companyLogo.svg";
import { ReactComponent as BackIcon } from "../assets/svg/backArrow.svg";
import { useForm, SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { resetPasswordSchema } from "../utils/validations";
import { toast } from "react-toastify";
import { useResetPasswordMutation } from "../services/api";
import { useEffect } from "react";
import backgroundImage from "./../assets/png/authenticationBackground.png";
import theme from "../themes";
import logo from "../assets/png/logo.png";

export default function ResetPassword() {
  const styles = useStyles(backgroundImage);
  const navigate = useNavigate();
  const [resetPassword, { error: errorResponse, isSuccess, isError }] =
    useResetPasswordMutation();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPassowrdFormInputs>({
    resolver: yupResolver(resetPasswordSchema),
  });
  const { state } = useLocation();

  const onSubmit: SubmitHandler<ResetPassowrdFormInputs> = (formData) => {
    console.log(formData);
    console.log(state?.resetToken);
    const data = {
      passwordResetToken: state?.resetToken,
      newPassword: formData.password,
    };

    const result = resetPassword(data);
    console.log(result);
  };

  useEffect(() => {
    if (isSuccess) {
      toast("Password changed successfully!", { type: "success" });
      navigate("/login");
    }

    if (isError) {
      const validationError = errorResponse as ValidationError;
      const errorMessage = validationError.data.data?.errors?.[0]?.msg;
      if (errorMessage) {
        toast(errorMessage, { type: "error" });
      }
      const apiError = errorResponse as ApiError;
      if (apiError?.data?.message && !errorMessage) {
        toast(apiError?.data?.message, { type: "error" });
      }
    }
  }, [isSuccess, isError]);

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
          <Typography sx={styles.heading}>Reset Password</Typography>
          <Typography sx={{ fontSize: 15 }} mt={2}>
            Please create a new password
          </Typography>
          <form style={{ width: "100%" }} onSubmit={handleSubmit(onSubmit)}>
            <Box mt={3} sx={{ width: "100%" }}>
              <CustomInput
                title="New Password"
                register={register}
                name="password"
                error={errors.password?.message}
                type="password"
                isEye
                customWidth="100%"
                customSize={true}
                customLabel={true}
                isAuth
              />
              <CustomInput
                title="Confirm Password"
                register={register}
                name="confirmPassword"
                error={errors.confirmPassword?.message}
                type="password"
                isEye
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
      [theme.breakpoints.down(600)]: {
        marginTop: 0,
        fontSize: 32,
      },
    },
    logo: {
      height: 100,
      width: 100,
      margin: "50px 0px",
      display: "none",
      [theme.breakpoints.down(600)]: {
        display: "block",
      },
    },
  });
