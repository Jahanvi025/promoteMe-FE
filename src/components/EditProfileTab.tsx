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
  TextField,
  Typography,
} from "@mui/material";
import { ReactComponent as EditIcon } from "../assets/svg/edit.svg";
import { ReactComponent as FacebookIcon } from "../assets/svg/editProfileFacebook.svg";
import { ReactComponent as LinkedinIcon } from "../assets/svg/editProfileLinkedin.svg";
import { ReactComponent as InstagramIcon } from "../assets/svg/instagramIcon.svg";
import EditProfileSocialLink from "./EditProfileSocialLink";
import CustomInput from "./CustomInput";
import { SubmitHandler, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { editProfileSchema } from "../utils/validations";
import { createStyles } from "@mui/styles";
import theme from "../themes";
import {
  useGetCategoriesQuery,
  useGetUserQuery,
  useUpdateUserMutation,
  useUploadMediaMutation,
} from "../services/api";
import { useEffect, useState, useRef } from "react";
import { toast } from "react-toastify";
import { DatePicker } from "@mui/x-date-pickers";
import dayjs, { Dayjs } from "dayjs";
import { useAppDispatch } from "../store/store";
import { updateUserProfile } from "../store/reducers/authReducer";

export default function EditProfileTab() {
  const [user, setUser] = useState<GetUserResponse["data"]["user"] | null>(
    null
  );
  const [profilePicture, setProfilePicture] = useState<string | null>(null);
  const [coverPicture, setCoverPicture] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const coverInputRef = useRef<HTMLInputElement | null>(null);

  const styles = useStyles(user?.cover_image, coverPicture);
  const { isSuccess, isError, error, data, refetch } = useGetUserQuery({});
  const [isLoading, setIsLoading] = useState(false);
  const [dateOfBirth, setDateOfBirth] = useState<Dayjs | null>();
  const [gender, setGender] = useState("MALE");
  const [category, setCategory] = useState("");

  const [
    updateUser,
    {
      isSuccess: updateSuccess,
      isError: isUpdateError,
      error: updateError,
      data: updatedUser,
    },
  ] = useUpdateUserMutation();

  const { data: categoriesData } = useGetCategoriesQuery();

  const dispatch = useAppDispatch();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<UpdateUserFormInput>({
    resolver: yupResolver(editProfileSchema),
  });

  const [uploadMedia] = useUploadMediaMutation();

  const onSubmit: SubmitHandler<UpdateUserFormInput> = (data) => {
    setIsLoading(true);
    const updatedData = {
      ...data,
      profile_picture: profilePicture,
      cover_image: coverPicture,
      date_of_birth: dateOfBirth ? dateOfBirth?.format("YYYY-MM-DD") : "",
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
      const toastId = toast.loading("Uploading profile picture...");
      const formData = new FormData();
      formData.append("files", file);
      const response = await uploadMedia(formData).unwrap();
      setProfilePicture(response.data[0]);
      toast.dismiss(toastId);
    }
  };

  const handleCoverPictureChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      const toastId = toast.loading("Uploading cover picture...");
      const formData = new FormData();
      formData.append("files", file);

      const response = await uploadMedia(formData).unwrap();
      setCoverPicture(response.data[0]);
      toast.dismiss(toastId);
    }
  };

  const handleEditClick = () => {
    fileInputRef.current?.click();
  };

  const handleProfileEditClick = () => {
    coverInputRef.current?.click();
  };

  useEffect(() => {
    refetch();
  }, [updateSuccess]);

  useEffect(() => {
    if (isSuccess && data) {
      setUser(data.data.user);
      setValue("displayName", data.data.user.displayName);
      setValue("username", data.data.user.username);
      setValue("email", data.data.user.email);
      setValue("mobile_number", data.data.user.mobile_number);
      setValue("category_id", data.data.user.category_id?._id || "");
      setValue("date_of_birth", data.data.user.date_of_birth || "");
      setValue("bio", data.data.user.bio || "");
      setValue("facebook_url", data.data.user.facebook_url || "");
      setValue("instagram_url", data.data.user.instagram_url || "");
      setValue("linkedin_url", data.data.user.linkedin_url || "");
      setValue("yearly_Price", data.data.user.yearly_Price || 0);
      setValue("monthly_Price", data.data.user.monthly_Price || 0);
      setProfilePicture(data.data.user.profile_picture);
      setCoverPicture(data.data.user.cover_image);
      setDateOfBirth(
        data.data.user.date_of_birth
          ? dayjs(data.data.user.date_of_birth)
          : null
      );
      setGender(data.data.user.gender || "");
      setCategory(data.data.user?.category_id?._id || "");
    }

    if (isError) {
      const errorMessage = error as ApiError;
      toast.error(errorMessage.data.message);
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

  return (
    <form style={{ width: "100%" }} onSubmit={handleSubmit(onSubmit)}>
      <Box sx={styles.container}>
        <Box mb={4} sx={styles.header}>
          <Typography variant="body1" fontWeight={500} sx={styles.heading}>
            Edit Profile
          </Typography>
          <Box sx={styles.subContainer}>
            <Button sx={styles.buttonGroup} variant="outlined">
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
        <Box sx={styles.headerRow}>
          <Box sx={styles.headerRight}>
            <Box mb={2} sx={styles.profileContainer}>
              <Box p={1} sx={styles.cover}>
                <IconButton
                  size="medium"
                  sx={styles.edit}
                  onClick={handleProfileEditClick}
                >
                  <EditIcon />
                </IconButton>
                <Box
                  sx={{
                    width: "100%",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Avatar
                    sx={styles.profilePicture}
                    src={profilePicture || user?.profile_picture}
                  />
                  <IconButton
                    size="medium"
                    sx={styles.profileEdit}
                    onClick={handleEditClick}
                  >
                    <EditIcon />
                  </IconButton>
                </Box>
              </Box>
              <Box sx={styles.profileBottomContainer}>
                <Typography mb={1} variant="body1" fontWeight={500}>
                  Bio
                </Typography>
                <TextField
                  fullWidth
                  multiline
                  minRows={4}
                  variant="outlined"
                  defaultValue={user?.bio || ""}
                  {...register("bio")}
                  error={!!errors.bio}
                  helperText={errors.bio?.message}
                  sx={styles.bioDesc}
                  placeholder="Enter your bio"
                  maxRows={4}
                />
              </Box>
            </Box>
            <Box sx={styles.socials} p={3}>
              <Typography variant="body1" fontWeight={500}>
                Social Media Accounts
              </Typography>
              <EditProfileSocialLink
                Icon={FacebookIcon}
                register={register}
                size={19}
                fieldName="facebook_url"
              />
              <EditProfileSocialLink
                Icon={LinkedinIcon}
                size={19}
                register={register}
                fieldName="linkedin_url"
              />
              <EditProfileSocialLink
                Icon={InstagramIcon}
                size={19}
                register={register}
                fieldName="instagram_url"
              />
            </Box>
          </Box>
          <Box sx={styles.headerLeft}>
            <Box py={4} px={3} sx={styles.editForm}>
              <Typography variant="body1" fontWeight={500}>
                Personal Information
              </Typography>
              <CustomInput
                title="Full Name"
                register={register}
                name="displayName"
                error={errors.displayName?.message}
                isPlain
                editProfile={true}
              />
              <CustomInput
                title="User Name"
                register={register}
                name="username"
                error={errors.username?.message}
                isPlain
                editProfile={true}
              />
              <CustomInput
                title="Email address"
                register={register}
                name="email"
                error={errors.email?.message}
                isPlain
                editProfile={true}
                readOnly={true}
              />
              <CustomInput
                title="Mobile number"
                register={register}
                name="mobile_number"
                error={errors.mobile_number?.message}
                isPlain
                editProfile={true}
              />
              <Box mb={2}>
                <FormControl fullWidth variant="outlined">
                  <Typography
                    mb={0.5}
                    variant="body1"
                    fontSize={14}
                    color={"#77767A"}
                  >
                    Category
                  </Typography>
                  <Select
                    value={category}
                    {...register("category_id")}
                    error={!!errors.category_id}
                    sx={{ height: 40, backgroundColor: "white", fontSize: 14 }}
                    onChange={(event) => {
                      setCategory(event.target.value);
                    }}
                  >
                    {categoriesData?.data?.categories?.map((category) => (
                      <MenuItem key={category._id} value={category._id}>
                        {category.name}
                      </MenuItem>
                    ))}
                  </Select>
                  <FormHelperText>{errors.category_id?.message}</FormHelperText>
                </FormControl>
              </Box>
              <Box mb={2} sx={{ width: "100%" }}>
                <Typography variant="body1" fontSize={14} color={"#77767A"}>
                  Date of Birth
                </Typography>
                <DatePicker
                  value={dateOfBirth || null}
                  sx={{
                    "& .MuiInputBase-root": {
                      height: 40,
                      backgroundColor: "white",
                    },
                    width: "100%",
                  }}
                  onChange={(newValue) => {
                    setValue(
                      "date_of_birth",
                      newValue?.format("YYYY-MM-DD") || ""
                    );
                    setDateOfBirth(newValue);
                  }}
                />
              </Box>
              <FormControl fullWidth error={!!errors.gender} sx={{ mb: 2 }}>
                <Typography variant="body1" fontSize={14} color={"#77767A"}>
                  Gender
                </Typography>
                <Select
                  labelId="gender-label"
                  value={gender}
                  {...register("gender")}
                  onChange={(event) => {
                    setGender(event.target.value);
                  }}
                  displayEmpty
                  sx={{ height: 40, backgroundColor: "white", fontSize: 14 }}
                >
                  <MenuItem value="">Select Gender</MenuItem>
                  <MenuItem value="MALE">Male</MenuItem>
                  <MenuItem value="FEMALE">Female</MenuItem>
                  <MenuItem value="OTHER">Other</MenuItem>
                </Select>
                <FormHelperText>{errors.gender?.message}</FormHelperText>
              </FormControl>
              <CustomInput
                title="Yearly Price"
                register={register}
                name="yearly_Price"
                error={errors.yearly_Price?.message}
                isPlain
                editProfile={true}
              />
              <CustomInput
                title="Monthly Price"
                register={register}
                name="monthly_Price"
                error={errors.monthly_Price?.message}
                isPlain
                editProfile={true}
              />
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
      <input
        type="file"
        ref={coverInputRef}
        style={{ display: "none" }}
        accept="image/*"
        onChange={handleCoverPictureChange}
      />
    </form>
  );
}

const useStyles = (
  cover_image: string | undefined,
  coverPicture: string | null
) =>
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
    headerRight: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      width: "48%",
      [theme.breakpoints.down(600)]: {
        width: "100%",
        justifyContent: "center",
      },
    },
    headerLeft: {
      width: "48%",
      [theme.breakpoints.down(600)]: {
        width: "100%",
        justifyContent: "center",
      },
    },
    profileContainer: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      width: "100%",
      borderRadius: 10,
    },
    cover: {
      position: "relative",
      backgroundColor: "#cccccc",
      backgroundImage: coverPicture
        ? `url('${coverPicture}')`
        : cover_image
        ? `url('${cover_image}')`
        : `url('https://cdn.pixabay.com/photo/2015/12/01/20/28/road-1072821_640.jpg')`,
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat",
      backgroundSize: "cover",
      height: 100,
      borderTopLeftRadius: 10,
      borderTopRightRadius: 10,
      width: "-webkit-fill-available",
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
    edit: {
      backgroundColor: "white",
      position: "absolute",
      right: 10,
    },
    profilePicture: {
      position: "absolute",
      height: 80,
      width: 80,
      borderRadius: "50%",
      bottom: "-35%",
      left: 10,
      border: "5px solid white",
    },
    profileEdit: {
      backgroundColor: "white",
      position: "absolute",
      left: 75,
      bottom: "-35%",
    },
    profileBottomContainer: {
      backgroundColor: "rgba(247, 247, 247, 1)",
      borderBottomLeftRadius: 20,
      borderBottomRightRadius: 20,
      paddingTop: 7,
      paddingX: 3,
      paddingBottom: 3,
      width: "-webkit-fill-available",
    },
    bio: {
      backgroundColor: "white",
      border: "2px solid rgba(231, 231, 231, 1)",
      borderRadius: 3,
    },
    bioDesc: {
      color: "#5E5E5E",
      scrollbarWidth: "thin",

      "& .MuiInputBase-root": {
        fontSize: 14,
        borderRadius: 4,
        backgroundColor: "white",
      },
      "& .MuiOutlinedInput": {
        scrollbarWidth: "thin",
      },
    },
    socials: {
      backgroundColor: "rgba(247, 247, 247, 1)",
      borderRadius: 4,
      width: "-webkit-fill-available",
      display: "flex",
      flexDirection: "column",
      alignItems: "flex-start",
      gap: 1.5,
    },
    addSocial: {
      border: "2px solid rgba(211, 216, 223, 1)",
      backgroundColor: "white",
      display: "flex",
      flexDirection: "row",
      height: 50,
      alignItems: "center",
      borderRadius: 3,
      width: "-webkit-fill-available",
      textTransform: "initial",
    },
    addMore: {
      fontSize: 14,
      fontWeight: 500,
    },
    editForm: {
      backgroundColor: "rgba(247, 247, 247, 1)",
      borderRadius: 4,
    },
    heading: {
      [theme.breakpoints.down(600)]: {
        display: "none",
      },
    },
  });
