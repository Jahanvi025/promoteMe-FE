import { Box, Button, Radio, Typography } from "@mui/material";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import CustomInput from "../CustomInput";
import { addressSchema } from "../../utils/validations";
import {
  useAddAddressMutation,
  useUpdateAddressMutation,
} from "../../services/api";
import { useEffect } from "react";
import { toast } from "react-toastify";
import { createStyles } from "@mui/styles";

interface Props {
  isEditing?: boolean;
  setIsEditing?: (value: boolean) => void;
  address?: Address;
  _id?: string;
  refetch?: () => void;
  setSelecetdAddressId?: (value: string) => void;
  isNewAddress?: boolean;
  setIsNewAddress?: (value: boolean) => void;
}

const NewAddressCard = (props: Props) => {
  const {
    isEditing,
    setIsEditing,
    address,
    _id,
    refetch,
    setSelecetdAddressId,
    isNewAddress,
    setIsNewAddress,
  } = props;
  const styles = useStyles(isNewAddress, isEditing);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AddressInput>({
    resolver: yupResolver(addressSchema),
  });

  useEffect(() => {
    if (address) {
      reset({
        firstName: address.firstName,
        lastName: address.lastName,
        address: address.address,
        contactNumber: address.contactNumber,
        zipCode: address.zipCode,
        state: address.state,
      });
    } else {
      reset();
    }
  }, [address, reset]);

  const [addAddress, { isSuccess, isError, error }] = useAddAddressMutation();

  const [
    updateAddress,
    { isSuccess: addressUpdated, isError: isUpdateError, error: updateError },
  ] = useUpdateAddressMutation();

  const onSubmit = async (data: AddressInput) => {
    if (isEditing && address) {
      await updateAddress({
        id: _id || "",
        body: data,
      }).unwrap();
    } else {
      await addAddress(data).unwrap();
    }
    setIsNewAddress && setIsNewAddress(false);
  };

  useEffect(() => {
    if (isSuccess || addressUpdated) {
      reset();
      setIsNewAddress && setIsNewAddress(false);
      toast.success(
        isEditing
          ? "Address updated successfully"
          : "Address added successfully"
      );
      setIsEditing && setIsEditing(false);
      refetch && refetch();
    }
    if (isError) {
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
    if (updateError) {
      const validationError = updateError as ValidationError;
      const errorMessage = validationError.data.data?.errors?.[0]?.msg;
      if (errorMessage) {
        toast(errorMessage, { type: "error" });
      }
      const apiError = updateError as ApiError;
      if (apiError?.data?.message && !errorMessage) {
        toast(apiError?.data?.message, { type: "error" });
      }
    }
  }, [isSuccess, isError, addressUpdated, isUpdateError]);

  const handleCancel = () => {
    reset();
    setIsEditing && setIsEditing(false);
    setIsNewAddress && setIsNewAddress(false);
  };

  const handleNewAddress = () => {
    setSelecetdAddressId && setSelecetdAddressId("");
    setIsNewAddress && setIsNewAddress(true);
  };

  return (
    <Box sx={styles.container}>
      <Box sx={{ display: "flex", alignItems: "center", gap: "10px" }}>
        {!isEditing && (
          <Radio
            checked={isNewAddress}
            onClick={handleNewAddress}
            value="address"
            name="radio-buttons"
          />
        )}
        <Typography fontSize={18} fontWeight={500}>
          {isEditing ? "Update Address" : "Add New Address"}
        </Typography>
      </Box>
      {(isNewAddress || isEditing) && (
        <>
          <Box sx={styles.row}>
            <CustomInput
              name="firstName"
              register={register}
              title="First Name"
              customSize
              isPlain
              customWidth="47%"
              placeholder="First Name"
              error={errors.firstName?.message}
            />
            <CustomInput
              name="lastName"
              register={register}
              title="Last Name"
              customSize
              isPlain
              customWidth="47%"
              placeholder="Last Name"
              error={errors.lastName?.message}
            />
          </Box>
          <Box padding={"0 10px"}>
            <CustomInput
              name="address"
              register={register}
              title="Address"
              isPlain
              customSize
              placeholder="Address"
              error={errors.address?.message}
            />
          </Box>
          <Box sx={styles.row}>
            <CustomInput
              name="contactNumber"
              register={register}
              title="Contact"
              customSize
              isPlain
              customWidth="30%"
              placeholder="Contact No."
              error={errors.contactNumber?.message}
              type="number"
            />
            <CustomInput
              name="zipCode"
              register={register}
              title="Zip Code"
              customSize
              isPlain
              customWidth="30%"
              placeholder="Zip Code"
              error={errors.zipCode?.message}
              type="number"
            />
            <CustomInput
              name="state"
              register={register}
              title="State"
              customSize
              isPlain
              customWidth="30%"
              placeholder="State"
              error={errors.state?.message}
            />
          </Box>
          <Box sx={styles.buttonContainer}>
            <Button sx={styles.button} onClick={handleCancel}>
              Cancel
            </Button>
            <Button
              variant="contained"
              sx={styles.button}
              onClick={handleSubmit(onSubmit)}
            >
              Save
            </Button>
          </Box>
        </>
      )}
    </Box>
  );
};

export default NewAddressCard;

const useStyles = (
  isNewAddress: boolean | undefined,
  isEditing: boolean | undefined
) =>
  createStyles({
    container: {
      width: "97%",
      display: "flex",
      justifyContent: "space-between",
      flexDirection: "column",
      border: "1px solid rgba(211, 216, 223, 1)",
      borderRadius: 2,
      padding: "10px",
      marginBottom: "40px",
      paddingBottom: isNewAddress || isEditing ? "20px" : "10px",
    },
    row: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      gap: "20px",
      padding: "10px",
    },
    buttonContainer: {
      marginTop: "15px",
      display: "flex",
      alignItems: "center",
      gap: "10px",
      padding: "0px 10px",
    },
    button: {
      width: "150px",
      border: "1px solid rgba(12, 143, 252, 0.5)",
      borderRadius: "24px",
      boxShadow: "unset",
    },
  });
