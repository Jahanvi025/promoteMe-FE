import {
  Avatar,
  Box,
  Button,
  CircularProgress,
  FormControl,
  FormHelperText,
  IconButton,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";
import { ReactComponent as EditIcon } from "../../assets/svg/edit.svg";
import CustomInput from "../../components/CustomInput";
import { SubmitHandler, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { editFanProfileSchema } from "../../utils/validations";
import { createStyles } from "@mui/styles";
import theme from "../../themes";
import {
  useGetUserQuery,
  useUpdateUserMutation,
  useUploadMediaMutation,
} from "../../services/api";
import { useEffect, useState, useRef } from "react";
import { toast } from "react-toastify";
import { updateUserProfile } from "../../store/reducers/authReducer";
import { useAppDispatch } from "../../store/store";

export default function EditProfile() {
  const [user, setUser] = useState<GetUserResponse["data"]["user"] | null>(
    null
  );
  const [profilePicture, setProfilePicture] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const styles = useStyles();
  const [isLoading, setIsLoading] = useState(false);
  const [gender, setGender] = useState("");

  const { isSuccess, isError, error, data, refetch } = useGetUserQuery({
    creatorId: "",
  });

  const User = data?.data?.user;

  const [
    updateUser,
    {
      isSuccess: updateSuccess,
      isError: isUpdateError,
      error: updateError,
      data: updatedUser,
    },
  ] = useUpdateUserMutation();
  const dispatch = useAppDispatch();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    reset,
  } = useForm<UpdateFanFormInput>({
    resolver: yupResolver(editFanProfileSchema),
  });

  const [uploadMedia] = useUploadMediaMutation();
  const [isProfilePicLoading, setIsProfilePicLoading] = useState(false);

  const onSubmit: SubmitHandler<UpdateFanFormInput> = (data) => {
    setIsLoading(true);
    const updatedData = {
      ...data,
      profile_picture: profilePicture,
    };
    updateUser({ id: user?._id || "", data: updatedData });
  };

  const handleProfilePictureChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      setIsProfilePicLoading(true);
      const formData = new FormData();
      formData.append("files", file);
      const response = await uploadMedia(formData).unwrap();
      setProfilePicture(response.data[0]);
      setIsProfilePicLoading(false);
    }
  };

  const handleEditClick = () => {
    fileInputRef.current?.click();
  };

  useEffect(() => {
    refetch();
  }, [updateSuccess]);

  useEffect(() => {
    if (isSuccess && User) {
      setUser(User);
      setValue("displayName", User?.displayName);
      setValue("username", User?.username);
      setValue("email", User?.email);
      setValue("mobile_number", User?.mobile_number);
      setValue("gender", User?.gender);
      setProfilePicture(User?.profile_picture);
      setGender(User?.gender);
    }

    if (isError) {
      const errorMessage = error as ApiError;
      toast.error(errorMessage?.data?.message);
    }
  }, [isError, isSuccess]);

  useEffect(() => {
    setIsLoading(false);
    if (updateSuccess) {
      toast.success("Profile updated successfully!");
      dispatch(
        updateUserProfile({
          profile_picture: updatedUser?.data?.profile_picture,
          username: updatedUser?.data?.username,
          displayName: updatedUser?.data?.displayName,
        })
      );
    }

    if (isUpdateError) {
      const errorMessage = updateError as ApiError;
      toast.error(errorMessage.data.message);
    }
  }, [updateSuccess, isUpdateError]);

  const handleDiscard = () => {
    if (User) {
      reset({
        displayName: User?.displayName,
        username: User?.username,
        email: User?.email,
        mobile_number: User?.mobile_number,
        gender: User?.gender,
      });
      setProfilePicture(User?.profile_picture);
      setGender(User?.gender);
    }
  };

  return (
    <form style={{ width: "100%" }} onSubmit={handleSubmit(onSubmit)}>
      <Box sx={styles.container}>
        <Box mb={4} sx={styles.header}>
          <Typography variant="body1" fontWeight={500} sx={styles.heading}>
            Edit Profile
          </Typography>
        </Box>
        <Box sx={styles.headerRow}>
          <Box sx={styles.headerLeft}>
            <Box py={4} px={3} sx={styles.editForm}>
              <Box>
                <Box
                  sx={{
                    marginX: 1,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    position: "relative",
                  }}
                >
                  <Avatar
                    sx={styles.profilePicture}
                    src={profilePicture || ""}
                  />
                  {isProfilePicLoading && (
                    <Box sx={styles.uploadLoader}>
                      <CircularProgress />
                    </Box>
                  )}
                  <IconButton
                    size="medium"
                    sx={styles.profileEdit}
                    onClick={handleEditClick}
                  >
                    <EditIcon />
                  </IconButton>
                </Box>
              </Box>
              <Box
                sx={{
                  width: "80%",
                  [theme.breakpoints.down(650)]: {
                    width: "100%",
                  },
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    [theme.breakpoints.down(500)]: { gap: "15px" },
                  }}
                >
                  <CustomInput
                    title="Full Name"
                    register={register}
                    name="displayName"
                    error={errors.displayName?.message}
                    isPlain
                    editProfile={true}
                    customWidth="47%"
                  />
                  <CustomInput
                    title="User Name"
                    register={register}
                    name="username"
                    error={errors.username?.message}
                    isPlain
                    editProfile={true}
                    customWidth="47%"
                  />
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    [theme.breakpoints.down(500)]: { gap: "15px" },
                  }}
                >
                  <CustomInput
                    title="Email address"
                    register={register}
                    name="email"
                    error={errors.email?.message}
                    isPlain
                    editProfile={true}
                    readOnly={true}
                    customWidth="47%"
                  />
                  <CustomInput
                    title="Mobile number"
                    register={register}
                    name="mobile_number"
                    error={errors.mobile_number?.message}
                    isPlain
                    editProfile={true}
                    customWidth="47%"
                  />
                </Box>

                <FormControl fullWidth error={!!errors.gender} sx={{ mb: 2 }}>
                  <Typography
                    variant="body1"
                    fontSize={14}
                    color={"#77767A"}
                    mb={"5px"}
                  >
                    Gender
                  </Typography>
                  <Select
                    labelId="gender-label"
                    value={gender}
                    {...register("gender")}
                    onChange={(event) => {
                      setGender(event.target.value);
                    }}
                    sx={{ height: 40, backgroundColor: "white", width: "47%" }}
                    displayEmpty
                  >
                    <MenuItem value={""}>Select Gender</MenuItem>
                    <MenuItem value="MALE">Male</MenuItem>
                    <MenuItem value="FEMALE">Female</MenuItem>
                    <MenuItem value="OTHER">Other</MenuItem>
                  </Select>
                  <FormHelperText>{errors.gender?.message}</FormHelperText>
                </FormControl>
                <Box sx={styles.subContainer}>
                  <Button
                    sx={styles.buttonGroup}
                    variant="outlined"
                    onClick={handleDiscard}
                  >
                    Discard
                  </Button>
                  <Button
                    type="submit"
                    sx={styles.buttonGroup}
                    variant="contained"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <CircularProgress size={24} color="primary" />
                    ) : (
                      "Save"
                    )}
                  </Button>
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: "none" }}
        accept="image/*"
        onChange={handleProfilePictureChange}
      />
    </form>
  );
}

const useStyles = () =>
  createStyles({
    container: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      width: "100%",
    },
    header: {
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      width: "100%",
    },
    headerRow: {
      display: "flex",
      flexDirection: "row",
      alignItems: "flex-start",
      gap: 4,
      width: "100%",
      [theme.breakpoints.down(600)]: {
        flexDirection: "column",
        width: "100%",
        justifyContent: "flex-start",
      },
    },
    headerLeft: {
      width: "100%",
      [theme.breakpoints.down(600)]: {
        width: "100%",
        justifyContent: "center",
      },
    },
    subContainer: {
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      gap: 3,
      paddingRight: "10px",

      [theme.breakpoints.down(600)]: {
        width: "100%",
        justifyContent: "space-between",
        paddingRight: "0px",
      },
    },
    buttonGroup: {
      paddingX: 7,
      minWidth: 130,
      height: 40,
      borderRadius: 2,
      [theme.breakpoints.down(900)]: {
        height: 35,
      },
    },
    profilePicture: {
      height: 110,
      width: 110,
      borderRadius: "50%",
      border: "5px solid white",
      position: "relative",
    },
    profileEdit: {
      backgroundColor: "white",
      position: "absolute",
      right: 5,
      bottom: "0%",
      [theme.breakpoints.down(650)]: {
        right: "38%",
      },
    },
    editForm: {
      backgroundColor: "rgba(247, 247, 247, 1)",
      display: "flex",
      justifyContent: "space-between",
      borderRadius: 4,
      [theme.breakpoints.down(650)]: {
        flexDirection: "column",
      },
    },
    heading: {
      [theme.breakpoints.down(600)]: {
        display: "none",
      },
    },
    uploadLoader: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "rgba(255, 255, 255, 0.7)",
      borderRadius: "50%",
      zIndex: 1,
    },
  });
