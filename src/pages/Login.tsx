import { Box, Button, Typography } from "@mui/material";
import CustomInput from "../components/CustomInput";
import { ReactComponent as CompanyLogo } from "../assets/svg/companyLogo.svg";
import logo from "../assets/png/logo.png";
import { createStyles } from "@mui/styles";
import { useNavigate } from "react-router-dom";
import SocialAuthButton from "../components/SocialAuthButton";
import { ReactComponent as LinkedinIcon } from "../assets/svg/linkedin.svg";
import { ReactComponent as FacebookIcon } from "../assets/svg/facebook.svg";
import { ReactComponent as GoogleIcon } from "../assets/svg/google.svg";
import { useForm, SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { loginSchema } from "../utils/validations";
import {
  LoginSocialFacebook,
  IResolveParams,
  LoginSocialGoogle,
  LoginSocialLinkedin,
  // @ts-ignore
} from "reactjs-social-login";
import {
  useFacebookLoginMutation,
  useGoogleLoginMutation,
  useLinkedinLoginMutation,
  useLoginUserMutation,
} from "../services/api";
import { useEffect, useState } from "react";
import { useAppDispatch } from "../store/store";
import { setTokens, setUser } from "../store/reducers/authReducer";
import { toast } from "react-toastify";
import backgroundImage from "./../assets/png/authenticationBackground.png";
import theme from "../themes";

export default function Login() {
  const styles = useStyles(backgroundImage);
  const navigate = useNavigate();
  const [isDisabled, setDisabled] = useState(false);

  const [
    googleLogin,
    {
      data: googleAuthResponse,
      error: googleAuthError,
      isSuccess: isGoogleAuthSuccess,
      isError: isGoogleAuthError,
    },
  ] = useGoogleLoginMutation();

  const [
    linkedinLogin,
    {
      data: linkedinAuthResponse,
      error: linkedinAuthError,
      isSuccess: isLinkedinAuthSuccess,
      isError: isLinkedinAuthError,
    },
  ] = useLinkedinLoginMutation();

  const [
    facebookLogin,
    {
      data: facebookAuthResponse,
      error: facebookAuthError,
      isSuccess: isFacebookAuthSuccess,
      isError: isFacebookAuthError,
    },
  ] = useFacebookLoginMutation();
  const [loginUser, { data: response, error, isSuccess, isError }] =
    useLoginUserMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormInputs>({ resolver: yupResolver(loginSchema) });

  const dispatch = useAppDispatch();

  const onSubmit: SubmitHandler<LoginFormInputs> = async (formData) => {
    const { email, password } = formData;
    await loginUser({ email, password });
    setDisabled(true);
  };

  useEffect(() => {
    if (isSuccess) {
      dispatch(
        setTokens({
          accessToken: response.data?.accessToken,
          refreshToken: response.data?.refreshToken,
        })
      );
      dispatch(setUser({ user: response?.data }));
      toast("Login Successful", { type: "success" });

      if (!response.data?.stripeAccountId) {
        navigate("/connect-account");
      } else {
        navigate("/feed");
      }
    }

    if (isError) {
      setDisabled(false);
      const apiError = error as ApiError;
      const errorMessage = apiError?.data?.message;
      if (errorMessage) {
        toast(errorMessage, { type: "error" });
      }
    }
  }, [isSuccess, isError]);

  const handleGoogleAuth = async (data: IResolveParams) => {
    await googleLogin({
      access_token: data.data.access_token,
    });
  };

  useEffect(() => {
    if (isGoogleAuthSuccess && googleAuthResponse?.data) {
      toast.dismiss();
      const { accessToken, ...userData } = googleAuthResponse.data;

      dispatch(setTokens({ accessToken, refreshToken: "" }));
      dispatch(setUser({ user: userData }));
      toast("Login Successful", { type: "success" });
      if (!googleAuthResponse.data?.stripeAccountId) {
        navigate("/connect-account");
      } else {
        navigate("/feed");
      }
    }

    if (isGoogleAuthError) {
      toast.dismiss();
      const validationError = googleAuthError as ValidationError;
      const errorMessage = validationError.data.data?.errors?.[0]?.msg;
      if (errorMessage) {
        toast(errorMessage, { type: "error" });
      }
      const apiError = googleAuthError as ApiError;
      if (apiError?.data?.message && !errorMessage) {
        toast(apiError?.data?.message, { type: "error" });
      }
    }
  }, [isGoogleAuthError, isGoogleAuthSuccess]);

  const handleLinkedinAuth = async (data: IResolveParams) => {
    await linkedinLogin({
      access_token: data.data.access_token,
    });
  };

  useEffect(() => {
    if (isLinkedinAuthSuccess && linkedinAuthResponse?.data) {
      const { accessToken, ...userData } = linkedinAuthResponse.data;
      toast.dismiss();
      dispatch(setTokens({ accessToken, refreshToken: "" }));
      dispatch(setUser({ user: userData }));
      toast("Login Successful", { type: "success" });
      if (!linkedinAuthResponse.data?.stripeAccountId) {
        navigate("/connect-account");
      } else {
        navigate("/feed");
      }
    }

    if (isLinkedinAuthError) {
      toast.dismiss();
      const validationError = linkedinAuthError as ValidationError;
      const errorMessage = validationError.data.data?.errors?.[0]?.msg;
      if (errorMessage) {
        toast(errorMessage, { type: "error" });
      }
      const apiError = linkedinAuthError as ApiError;
      if (apiError?.data?.message && !errorMessage) {
        toast(apiError?.data?.message, { type: "error" });
      }
    }
  }, [isLinkedinAuthError, isLinkedinAuthSuccess]);

  const handleFacebookAuth = async (data: IResolveParams) => {
    await facebookLogin({
      access_token: data.data.accessToken,
    });
  };

  useEffect(() => {
    if (isFacebookAuthSuccess && facebookAuthResponse?.data) {
      const { accessToken, ...userData } = facebookAuthResponse.data;
      toast.dismiss();
      dispatch(setTokens({ accessToken, refreshToken: "" }));
      dispatch(setUser({ user: userData }));
      toast("Login Successful", { type: "success" });
      if (!facebookAuthResponse.data?.stripeAccountId) {
        navigate("/connect-account");
      } else {
        navigate("/feed");
      }
    }

    if (isFacebookAuthError) {
      toast.dismiss();
      const validationError = facebookAuthError as ValidationError;
      const errorMessage = validationError.data.data?.errors?.[0]?.msg;
      if (errorMessage) {
        toast(errorMessage, { type: "error" });
      }
      const apiError = facebookAuthError as ApiError;
      if (apiError?.data?.message && !errorMessage) {
        toast(apiError?.data?.message, { type: "error" });
      }
    }
  }, [isFacebookAuthError, isFacebookAuthSuccess]);

  const handleAuthSuccess = async (data: IResolveParams) => {
    setDisabled(true);
    toast.loading("Logging in!");
    if (data.provider === "google") {
      handleGoogleAuth(data);
    }

    if (data.provider === "linkedin") {
      handleLinkedinAuth(data);
    }

    if (data.provider === "facebook") {
      handleFacebookAuth(data);
    }
  };

  const handleAuthFailure = (err: any) => {
    console.log(err);
  };

  return (
    <Box sx={styles.container}>
      <Box sx={styles.cover}>
        <CompanyLogo style={{ marginTop: "2%", marginLeft: "2%" }} />
      </Box>
      <Box sx={styles.sideForm} pl={5}>
        <Box component="img" src={logo} sx={styles.logo}></Box>
        <Box sx={styles.sideFormInner}>
          <Typography sx={styles.heading}>Welcome Back 👋</Typography>
          <Typography mt={2} sx={{ fontSize: 18, lineHeight: 1 }}>
            Enter details to login
          </Typography>
          <form style={{ width: "100%" }} onSubmit={handleSubmit(onSubmit)}>
            <Box mt={3} sx={{ width: "100%" }}>
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
                title="Password"
                name="password"
                type="password"
                register={register}
                error={errors.password?.message}
                isEye
                customWidth="100%"
                customSize={true}
                customLabel={true}
                isAuth
              />
            </Box>
            <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
              <Typography
                component="span"
                onClick={() => navigate("/forgot-password")}
                textAlign="right"
                width="100%"
                sx={{
                  cursor: "pointer",
                  display: "block",
                  width: "fit-content",
                }}
              >
                <strong style={{ fontWeight: 500, fontSize: "0.875rem" }}>
                  Forgot Password?
                </strong>
              </Typography>
            </Box>
            <Button
              type="submit"
              variant="contained"
              sx={styles.submitButton}
              disabled={isDisabled}
            >
              Login
            </Button>
          </form>
          <Typography sx={styles.lineBreak}>
            <Box
              component="span"
              sx={{ background: "#fff", padding: "0 10px" }}
            >
              Or
            </Box>
          </Typography>
          <LoginSocialGoogle
            className="social_auth"
            isOnlyGetToken
            redirect_uri={import.meta.env.VITE_APP_REDIRECT_URI}
            client_id={import.meta.env.VITE_APP_GG_APP_ID}
            // onLoginStart={toast.loading("Logging in...")}
            scope="profile email"
            onResolve={handleAuthSuccess}
            onReject={handleAuthFailure}
          >
            <SocialAuthButton
              Icon={GoogleIcon}
              title={"Google"}
              disabled={isDisabled}
            />
          </LoginSocialGoogle>
          <LoginSocialLinkedin
            isOnlyGetToken
            className="social_auth"
            client_id={import.meta.env.VITE_APP_LINKEDIN_APP_ID}
            client_secret={import.meta.env.VITE_APP_LINKEDIN_APP_SECRET}
            redirect_uri={import.meta.env.VITE_APP_REDIRECT_URI}
            scope="openid email profile"
            // onLoginStart={onLoginStart}
            onResolve={handleAuthSuccess}
            onReject={handleAuthFailure}
          >
            <SocialAuthButton
              Icon={LinkedinIcon}
              title={"Linkedin"}
              disabled={isDisabled}
            />
          </LoginSocialLinkedin>
          <LoginSocialFacebook
            isOnlyGetToken
            className="social_auth"
            appId={import.meta.env.VITE_APP_FB_APP_ID}
            // onLoginStart={onLoginStart}
            onResolve={handleAuthSuccess}
            onReject={handleAuthFailure}
          >
            <SocialAuthButton
              Icon={FacebookIcon}
              title={"Facebook"}
              disabled={isDisabled}
            />
          </LoginSocialFacebook>
          <Typography
            component="span"
            onClick={() => navigate("/signup")}
            my={3}
            sx={styles.footer}
          >
            Don't you have an account? <strong>Sign up</strong>
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}

const useStyles = (backgroundImage: string) =>
  createStyles({
    container: { width: "100%", display: "flex", overflowY: "scroll" },
    cover: {
      backgroundImage: `url(${backgroundImage})`,
      backgroundRepeat: "no-repeat",
      backgroundSize: "cover",
      width: "62%",
      height: "100vh",
      display: "flex",
      alignItems: "flex-start",
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
    submitButton: {
      marginTop: 2,
      borderRadius: 2.5,
      textTransform: "initial",
      fontWeight: 300,
      fontSize: 15,
      width: "100%",
    },
    lineBreak: {
      width: "100%",
      textAlign: "center",
      borderBottom: "1px solid rgba(207, 223, 226, 1)",
      lineHeight: "0.01em",
      margin: "30px 0 15px",
    },
    footer: {
      width: "90%",
      cursor: "pointer",
      textAlign: "center",
      fontSize: "0.875rem",
    },
    heading: {
      fontSize: 35,
      fontWeight: 700,
      lineHeight: 1,

      [theme.breakpoints.down(900)]: {
        marginTop: "120px",
        fontSize: 30,
      },
      [theme.breakpoints.down(600)]: {
        marginTop: "10px",
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
