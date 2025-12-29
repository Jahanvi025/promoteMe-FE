import { Box, Button, Typography, FormControl } from "@mui/material";
import { ReactComponent as CompanyLogo } from "../assets/svg/companyLogo.svg";
import CustomInput from "../components/CustomInput";
import { createStyles } from "@mui/styles";
import { useNavigate } from "react-router-dom";
import { useForm, SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { signupSchema } from "../utils/validations";
import { useRegisterUserMutation } from "../services/api";
import { useEffect } from "react";
import { toast } from "react-toastify";
import backgroundImage from "./../assets/png/authenticationBackground.png";
import theme from "../themes";
import logo from "../assets/png/logo.png";

export default function Signup() {
  const styles = useStyles(backgroundImage);
  const navigate = useNavigate();
  const [registerUser, { error, isSuccess, isError }] =
    useRegisterUserMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormInputs>({ resolver: yupResolver(signupSchema) });

  const onSubmit: (role: string) => SubmitHandler<SignupFormInputs> =
    (role) => (data) => {
      console.log(data);
      const { email, password, name, username, mobile_number } = data;
      const displayName = data.name;
      const isCreator = role === "CREATOR";
      const isFan = role === "FAN";
      const result = registerUser({
        name,
        username,
        email,
        mobile_number,
        password,
        lastActiveRole: role,
        displayName,
        isCreator,
        isFan,
      });
      console.log(result);
    };

  useEffect(() => {
    if (isSuccess) {
      toast("Registration Successful", { type: "success" });
      navigate("/login");
    }

    if (isError) {
      const validationError = error as ValidationError;
      const errorMessage = validationError.data?.data?.errors?.[0]?.msg;
      if (errorMessage) {
        toast(errorMessage, { type: "error" });
      }
      const apiError = error as ApiError;
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
        <Box sx={styles.sideFormInner}>
          <Typography sx={styles.heading}>Signup Now 👋</Typography>
          <Typography mt={1} sx={{ fontSize: 15, lineHeight: 1 }}>
            Signup today to start your journey
          </Typography>
          <form style={{ width: "100%" }}>
            <Box sx={{ width: "100%" }} mt={3}>
              <CustomInput
                title="Name"
                name="name"
                register={register}
                error={errors.name?.message}
                customWidth="100%"
                customSize={true}
                customLabel={true}
                isAuth
              />
              <CustomInput
                title="Username"
                name="username"
                register={register}
                error={errors.username?.message}
                customWidth="100%"
                customSize={true}
                customLabel={true}
                isAuth
              />
              <CustomInput
                title="Email"
                name="email"
                register={register}
                error={errors.email?.message}
                customWidth="100%"
                customSize={true}
                customLabel={true}
                isAuth
              />
              <CustomInput
                title="Mobile Number"
                name="mobile_number"
                register={register}
                customSize={true}
                error={errors.mobile_number?.message}
                isAuth
              />
              <CustomInput
                title="Password"
                name="password"
                register={register}
                error={errors.password?.message}
                type="password"
                isEye
                customWidth="100%"
                customSize={true}
                customLabel={true}
                isAuth
              />
            </Box>
            <FormControl component="fieldset" fullWidth margin="normal">
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "10px",
                  alignItems: "center",
                  width: "100%",
                }}
              >
                <Button
                  variant="contained"
                  onClick={handleSubmit(onSubmit("CREATOR"))}
                  sx={styles.roleButton}
                >
                  Sign Up as Creator
                </Button>
                <Button
                  variant="contained"
                  onClick={handleSubmit(onSubmit("FAN"))}
                  sx={styles.roleButton}
                >
                  Sign Up as Fan
                </Button>
              </Box>
            </FormControl>
          </form>
          <Typography
            component="span"
            onClick={() => navigate("/login")}
            my={2}
            sx={styles.footer}
          >
            Already have an account? <strong>Login</strong>
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}

const useStyles = (backgroundImage: string) =>
  createStyles({
    container: { height: "100vh", width: "100%", display: "flex" },
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
      [theme.breakpoints.down(900)]: {
        width: "46%",
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
      width: "70%",
      maxWidth: "100%",
      overflowY: "scroll",
      scrollbarWidth: "none",
    },
    roleButton: {
      margin: "0 8px",
      borderRadius: 2.5,
      textTransform: "initial",
      fontWeight: 300,
      fontSize: 15,
      width: "100%",
    },
    footer: {
      cursor: "pointer",
      width: "100%",
      textAlign: "center",
      fontSize: "0.875rem",
    },
    heading: {
      fontSize: 35,
      fontWeight: 700,
      lineHeight: 1,

      [theme.breakpoints.down(900)]: {
        marginTop: "120px",
      },

      [theme.breakpoints.down(600)]: {
        marginTop: "10px",
        fontSize: 32,
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
