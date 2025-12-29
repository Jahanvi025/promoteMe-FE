import {
  Box,
  Button,
  FormControl,
  FormControlLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  SelectChangeEvent,
  TextField,
  Typography,
} from "@mui/material";
import { ReactComponent as BackIcon } from "../../assets/svg/backArrow.svg";
import { createStyles } from "@mui/styles";
import { useEffect, useState } from "react";
import CustomInput from "../CustomInput";
import MediaPicker from "../MediaPicker";
import MediaContainer from "../MediaContainer";
import theme from "../../themes";
import {
  useAddProductMutation,
  useUpdateProductMutation,
  useUploadMediaMutation,
} from "../../services/api";
import { SubmitHandler, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { ProductSchema } from "../../utils/validations";
import { toast } from "react-toastify";

interface Props {
  setIsEditingProduct: (value: boolean) => void;
  setIsAddingProduct: (value: boolean) => void;
  isEditingProduct: boolean;
  selectedMedia?: (string | File)[];
  selectedProduct: Product | undefined;
  setSelectedProduct: (value: Product) => void;
}

export default function AddProduct(props: Props) {
  const {
    setIsEditingProduct,
    setIsAddingProduct,
    isEditingProduct,
    selectedMedia,
    selectedProduct,
  } = props;
  const styles = useStyles();
  const [Status, setStatus] = useState("ACTIVE");
  const [productType, setProductType] = useState("PHYSICAL");
  const [media, setMedia] = useState<(string | File)[]>(
    selectedMedia && isEditingProduct ? selectedMedia : []
  );

  const [addProduct, { isSuccess, isError, error }] = useAddProductMutation();
  const [
    updateProduct,
    { isSuccess: productUpdated, isError: isUpdateError, error: updateError },
  ] = useUpdateProductMutation();
  const [
    uploadMedia,
    { isLoading: uploading, isError: isUploadError, error: uploadError },
  ] = useUploadMediaMutation();

  const handleClick = () => {
    setIsEditingProduct(false);
    setIsAddingProduct(false);
  };

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<addProductInput>({
    resolver: yupResolver(ProductSchema),
  });

  const onSubmit: SubmitHandler<addProductInput> = async (formData) => {
    let mediaUrls: string[] = [];
    const Media = new FormData();
    media.forEach((file) => {
      if (file instanceof File) {
        Media.append("files", file);
      }
    });

    if (isEditingProduct) {
      const previousMediaUrls = media.filter(
        (item) => typeof item === "string"
      ) as string[];
      mediaUrls = previousMediaUrls;
    }
    const uploadResponse = await uploadMedia(Media).unwrap();
    mediaUrls = [...mediaUrls, ...uploadResponse.data];

    const updatedFormData = {
      ...formData,
      images: mediaUrls,
      type: productType,
      status: Status,
    };

    if (isEditingProduct) {
      await updateProduct({
        id: selectedProduct?._id || "",
        body: updatedFormData,
      });
    } else {
      await addProduct(updatedFormData);
    }
  };

  useEffect(() => {
    if (uploading) {
      toast("Uploading...", { autoClose: false, isLoading: true });
    } else if (uploadError) {
      toast.dismiss();
      const error = uploadError as ApiError;
      toast.error(error.data.message);
    }
    return () => {
      toast.dismiss();
    };
  }, [uploading, isUploadError]);

  useEffect(() => {
    if (isSuccess) {
      toast.success("Product added successfully");
      setIsEditingProduct(false);
      setIsAddingProduct(false);
    } else if (isError) {
      toast.dismiss();
      const validationError = error as ValidationError;
      const errorMessage = validationError.data.data?.errors?.[0]?.msg;
      if (errorMessage) {
        toast(errorMessage, { type: "error" });
      }
      const apiError = error as ApiError;
      if (apiError?.data?.message && !errorMessage) {
        toast(apiError?.data?.message, { type: "error" });
      }
    }
    return () => {
      toast.dismiss();
    };
  }, [isSuccess, isError]);

  useEffect(() => {
    if (productUpdated) {
      toast.success("Product updated successfully");
      setIsEditingProduct(false);
      setIsAddingProduct(false);
    } else if (isUpdateError) {
      toast.dismiss();
      const Error = updateError as ApiError;
      toast.error(Error.data.message);
    }
    return () => {
      toast.dismiss();
    };
  }, [productUpdated, isUpdateError]);

  useEffect(() => {
    if (isEditingProduct) {
      setValue("name", selectedProduct?.name || "");
      setValue("price", selectedProduct?.price || 0);
      setValue("stock", selectedProduct?.stock || 0);
      setValue("description", selectedProduct?.description || "");
      setStatus(selectedProduct?.status || "ACTIVE");
      setProductType(selectedProduct?.type || "PHYSICAL");
    } else {
      reset();
    }
  }, [isEditingProduct]);

  const toggleStatus = (event: SelectChangeEvent) => {
    setStatus(event.target.value as string);
  };

  const toggleProductType = (event: SelectChangeEvent) => {
    setProductType(event.target.value as string);
  };

  return (
    <form style={{ width: "100%" }} onSubmit={handleSubmit(onSubmit)}>
      <Box sx={styles.container}>
        <Box sx={styles.header}>
          <Button onClick={handleClick} sx={{ textTransform: "initial" }}>
            <BackIcon
              style={{ marginRight: 10 }}
              color="rgba(12, 143, 252, 1)"
            />
            <Typography color="rgba(12, 143, 252, 1)">Back</Typography>
          </Button>
          <Button
            type="submit"
            variant="contained"
            sx={{ marginRight: "20px", minWidth: "150px" }}
          >
            {isEditingProduct ? "Save Changes" : "Save"}
          </Button>
        </Box>

        <Box sx={styles.contentSection}>
          <Box sx={styles.row}>
            <CustomInput
              title="Name"
              name="name"
              register={register}
              error={errors.name?.message}
              placeholder="Product Name"
              customSize
              isPlain
              customWidth="48%"
            />

            <Box>
              <Typography sx={styles.heading}>Type</Typography>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={productType}
                onChange={toggleProductType}
                sx={styles.select}
              >
                <MenuItem value={"PHYSICAL"}>Physical</MenuItem>
                <MenuItem value={"DIGITAL"}>Digital</MenuItem>
              </Select>
            </Box>
          </Box>

          <Box sx={styles.row}>
            <CustomInput
              title="Price (USD)"
              name="price"
              type="number"
              register={register}
              error={errors.price?.message}
              customSize
              isPlain
              customWidth="48%"
              placeholder="Price"
            />

            <CustomInput
              title="Stock"
              name="stock"
              type="number"
              register={register}
              error={errors.stock?.message}
              placeholder="No. of Products"
              customSize
              isPlain
              customWidth="48%"
            />
          </Box>

          <Typography sx={styles.heading}>Description</Typography>
          <TextField
            size={"medium"}
            placeholder="Description of Product"
            {...register("description")}
            error={!!errors.description}
            helperText={errors.description?.message}
            type="text"
            fullWidth
            multiline
            minRows={2}
            inputProps={{
              style: { fontSize: "1rem" },
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                backgroundColor: "white",
              },
            }}
          />

          <Typography sx={styles.heading}>Status</Typography>
          <FormControl component="fieldset">
            <RadioGroup
              row
              aria-label="status"
              name="status"
              value={Status}
              onChange={toggleStatus}
              sx={styles.radioGroup}
            >
              <FormControlLabel
                value="ACTIVE"
                control={<Radio sx={styles.radio} />}
                label="Active"
              />
              <FormControlLabel
                value="INACTIVE"
                control={<Radio sx={styles.radio} />}
                label="Inactive"
              />
            </RadioGroup>
          </FormControl>

          <Box
            sx={{ display: "flex", flexDirection: "row", alignItems: "center" }}
            mt={4}
          >
            {media.length > 0 && (
              <MediaContainer media={media} setMedia={setMedia} type="IMAGE" />
            )}
            <MediaPicker setMedia={setMedia} media={media} type="IMAGE" />
          </Box>
        </Box>
      </Box>
    </form>
  );
}

const useStyles = () =>
  createStyles({
    container: {
      display: "flex",
      flexDirection: "column",
      width: "100%",
    },
    header: {
      width: "100%",
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    contentSection: {
      maxWidth: "100%",
      backgroundColor: "#F7F7F7",
      borderRadius: "16px",
      marginTop: "20px",
      display: "flex",
      flexDirection: "column",
      gap: "10px",
      padding: "20px",
    },
    heading: {
      fontSize: 14,
      fontWeight: 400,
      color: "#77767A",
      overflow: "hidden",
    },
    text: {
      fontSize: 16,
      fontWeight: 500,
      color: "#000000",
      overflow: "hidden",
    },
    row: {
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "10px 0",
    },
    select: {
      height: 40,
      width: "33.5vw",
      borderRadius: 2,
      backgroundColor: "white",
      marginTop: "5px",
      [theme.breakpoints.down(900)]: {
        width: "41vw",
      },
    },
    radioGroup: {
      display: "flex",
      flexDirection: "row",
      marginTop: "5px",
    },
    radio: {
      color: "#77767A",
      "&.Mui-checked": {
        color: "#12a0f5",
      },
    },
  });
