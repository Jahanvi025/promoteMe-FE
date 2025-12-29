import { Box, Button, Radio, Typography } from "@mui/material";
import { createStyles } from "@mui/styles";
import { useState } from "react";
import NewAddressCard from "./newAddressCard";

interface Props {
  address: Address;
  refetch?: () => void;
  selectedAddressId: string;
  setSelectedAddressId: (value: string) => void;
  setIsNewAddress: (value: boolean) => void;
}

const AddressCard = (props: Props) => {
  const {
    address,
    refetch,
    selectedAddressId,
    setSelectedAddressId,
    setIsNewAddress,
  } = props;
  const [isEditing, setIsEditing] = useState(false);

  const styles = useStyles();

  const handleChange = () => {
    setSelectedAddressId(address._id);
    setIsNewAddress(false);
    sessionStorage.setItem("selectedAddressId", address._id);
  };

  const handleClick = () => {
    setIsEditing(!isEditing);
  };

  return (
    <>
      {isEditing ? (
        <NewAddressCard
          isEditing={isEditing}
          setIsEditing={setIsEditing}
          address={address}
          _id={address._id}
          refetch={refetch}
        />
      ) : (
        <Box sx={styles.container}>
          <Box sx={styles.leftContainer}>
            <Radio
              checked={selectedAddressId === address._id}
              onChange={handleChange}
              value={address._id}
              name="radio-buttons"
            />
            <Typography fontSize={18} fontWeight={500}>
              {address.firstName} {address.lastName}
            </Typography>
            <Typography fontSize={15} color={"rgba(119, 118, 122, 1)"}>
              {address.address}, {address.state} {address.zipCode}
            </Typography>
            <Typography fontSize={15} color={"rgba(119, 118, 122, 1)"}>
              {address.contactNumber}
            </Typography>
          </Box>
          <Button onClick={handleClick}>Edit</Button>
        </Box>
      )}
    </>
  );
};

export default AddressCard;

const useStyles = () =>
  createStyles({
    container: {
      width: "97%",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      border: "1px solid rgba(211, 216, 223, 1)",
      borderRadius: 2,
      padding: "10px 10px",
      marginBottom: "15px",
    },
    leftContainer: {
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      gap: "10px",
    },
  });
