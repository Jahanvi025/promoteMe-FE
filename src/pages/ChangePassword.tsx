import { Box, Button } from "@mui/material";
import { createStyles } from "@mui/styles";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm, SubmitHandler } from "react-hook-form";
import { toast } from "react-toastify";
import PageHeader from "../components/PageHeader";
import { changePassword } from "../utils/validations";
import theme from "../themes";
import CustomInput from "../components/CustomInput";
import { useChnagePasswordMutation } from "../services/api";
import { useEffect } from "react";

const ChangePassword = () => {
  const styles = useStyles();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ChangePasswordFormInput>({
    resolver: yupResolver(changePassword),
  });

  const [resetPassword, { isSuccess, isError, error }] =
    useChnagePasswordMutation();

  const onSubmitHandler: SubmitHandler<ChangePasswordFormInput> = async (
    formData
  ) => {
    await resetPassword(formData);
    toast.dismiss();
  };

  useEffect(() => {
    if (isSuccess) {
      toast.success("Password changed successfully");
      reset();
    }

    if (isError) {
      const errorMessage = error as ApiError;
      toast.error(errorMessage.data.message);
    }
  }, [isSuccess, isError]);

  return (
    <Box sx={styles.outerContainer}>
      <PageHeader title="Change Password" />
      <Box sx={styles.container}>
        <Box sx={styles.formContainer}>
          <form
            style={{ width: "100%" }}
            onSubmit={handleSubmit(onSubmitHandler)}
          >
            <Box mt={3} sx={{ width: "100%" }}>
              <CustomInput
                title="Current Password"
                register={register}
                name="currentPassword"
                error={errors.currentPassword?.message}
                type="password"
                isEye
                customWidth="100%"
                customSize={true}
                customLabel={true}
                isAuth
              />
              <CustomInput
                title="New Password"
                register={register}
                name="newPassword"
                error={errors.newPassword?.message}
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
              Confirm
            </Button>
          </form>
        </Box>
      </Box>
    </Box>
  );
};

export default ChangePassword;

const useStyles = () =>
  createStyles({
    container: {
      width: "100%",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    },
    formContainer: {
      boxShadow: "none",
      borderRadius: "20px",
      width: "320px",
      [theme.breakpoints.down(600)]: {
        width: "250px",
      },
    },
    formWrapper: {
      padding: "10px 0px",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      [theme.breakpoints.down(1210)]: {
        padding: "32px 0",
      },
    },
    label: {
      marginBottom: "12px",
    },
    submitButton: {
      marginTop: 3,
      borderRadius: 2.5,
      textTransform: "initial",
      fontWeight: 300,
      fontSize: 15,
    },
    outerContainer: {
      marginLeft: "25%",
      overflowY: "hidden",
      position: "sticky",
      top: "109px",
      marginTop: "105px",
      [theme.breakpoints.down(900)]: {
        marginLeft: "5%",
        marginTop: "102px",
      },
      [theme.breakpoints.down(600)]: {
        marginTop: "58px",
        marginLeft: "2%",
        overflow: "hidden",
        scrollBarWidth: "none",
      },
    },
  });
