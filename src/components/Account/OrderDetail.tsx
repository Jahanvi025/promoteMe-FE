import {
  Box,
  Button,
  MenuItem,
  Select,
  SelectChangeEvent,
  Typography,
} from "@mui/material";
import { ReactComponent as BackIcon } from "../../assets/svg/backArrow.svg";
import { createStyles } from "@mui/styles";
import { useEffect, useState } from "react";
import { CustomChip } from "./CustomChip";
import { useUpdateOrderStatusMutation } from "../../services/api";
import { toast } from "react-toastify";
import { useAppSelector } from "../../store/store";

interface Props {
  setIsViewingOrder: (value: boolean) => void;
  product: OrderHistoryItem | null;
}

export default function OrderDetail(props: Props) {
  const { setIsViewingOrder, product } = props;
  const [deliveryStatus, setDeliveryStatus] = useState(product?.status || "");
  const styles = useStyles();

  const handleChange = (event: SelectChangeEvent) => {
    setDeliveryStatus(event.target.value as string);
  };

  const role = useAppSelector((state) => state.auth?.user?.lastActiveRole);

  const [updateStatus, { isSuccess, isError, error }] =
    useUpdateOrderStatusMutation();

  const handleUpdate = async () => {
    await updateStatus({
      id: product?._id || "",
      status: deliveryStatus,
    });
  };

  useEffect(() => {
    if (isSuccess) {
      setIsViewingOrder(false);
      toast.success("Order updated");
    }
    if (isError) {
      const Error = error as ApiError;
      toast.error(Error.data.message);
    }
  }, [isError, isSuccess]);

  const getStatusBackgroundColor = (status?: string) => {
    switch (status) {
      case "SHIPPING":
        return "#0C8FFC40";
      case "DELIVERED":
        return "#12891240";
      case "REFUNDED":
        return "#FF8C0040";
      case "PROCESSING":
        return "#FFC83240";
      default:
        return "#FFFFFF";
    }
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case "SHIPPING":
        return "#0C8FFC";
      case "DELIVERED":
        return "#128912";
      case "REFUNDED":
        return "#FF8C00";
      case "PROCESSING":
        return "#FFC832";
      default:
        return "#FFFFFF";
    }
  };

  return (
    <Box sx={styles.container}>
      <Box sx={styles.header}>
        <Button
          onClick={() => setIsViewingOrder(false)}
          sx={{ textTransform: "initial" }}
        >
          <BackIcon style={{ marginRight: 10 }} color="rgba(12, 143, 252, 1)" />
          <Typography color="rgba(12, 143, 252, 1)">Back</Typography>
        </Button>
        {role === "CREATOR" && (
          <Button
            variant="contained"
            sx={{ marginRight: "0px", minWidth: "150px" }}
            onClick={handleUpdate}
          >
            Update
          </Button>
        )}
      </Box>

      <Box sx={styles.contentSection}>
        <Box sx={styles.row}>
          <Box sx={styles.cellSmall}>
            <Typography sx={styles.heading}>Product</Typography>
            <Typography sx={styles.text}>
              {product?.product_id[0]?.name}
            </Typography>
          </Box>
          <Box sx={styles.cellSmall}>
            <Typography sx={styles.heading}>Product Type</Typography>
            <CustomChip
              name={
                product?.product_id?.[0]?.type
                  ? product?.product_id?.[0]?.type?.charAt(0) +
                    product?.product_id?.[0]?.type?.slice(1).toLowerCase()
                  : "Physical"
              }
              backgroundColor="#12891240"
              color="#128912"
              width="70px"
            />
          </Box>
          <Box sx={styles.cellLarge}>
            <Typography sx={styles.heading}>Description</Typography>
            <Typography sx={styles.text}>
              {product?.product_id[0]?.description}
            </Typography>
          </Box>
        </Box>

        <Box sx={styles.row}>
          <Box sx={styles.cellSmall}>
            <Typography sx={styles.heading}>Unit Price</Typography>
            <Typography sx={styles.text}>
              ${product?.unit_price?.toFixed(2)}
            </Typography>
          </Box>
          <Box sx={styles.cellSmall}>
            <Typography sx={styles.heading}>Quantity</Typography>
            <Typography sx={styles.text}>{product?.quantity}</Typography>
          </Box>
          <Box sx={styles.cellLarge}>
            <Typography sx={styles.heading}>Total Price</Typography>
            <Typography sx={styles.text}>${product?.total_price}</Typography>
          </Box>
        </Box>

        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            borderBottom: "1px solid #0C8FFC24",
            gap: "20px",
          }}
        >
          <Box sx={{ ...styles.row, borderBottom: "none" }}>
            <Box sx={styles.cellSmall}>
              <Typography sx={styles.heading}>Name</Typography>
              <Typography sx={styles.text}>
                {product?.ordered_by?.displayName}
              </Typography>
            </Box>
            <Box sx={styles.cellSmall}>
              <Typography sx={styles.heading}>Contact Number</Typography>
              <Typography sx={styles.text}>
                {product?.address_id?.contactNumber}
              </Typography>
            </Box>
            <Box sx={styles.cellLarge}>
              <Typography sx={styles.heading}>Email</Typography>
              <Typography sx={styles.text}>
                {product?.ordered_by?.email}
              </Typography>
            </Box>
          </Box>
          <Box sx={styles.cellSmall}>
            <Typography sx={styles.heading}>Address</Typography>
            <Typography sx={styles.text}>
              {product?.address_id?.address || "No address available"}
            </Typography>
          </Box>
        </Box>

        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: role === "FAN" ? "unset" : "space-between",
            alignItems: "center",
            gap: "20px",
            justifyItems: "center",
          }}
        >
          {product?.status !== "DELIVERED" && (
            <Box sx={role === "CREATOR" ? styles.cellSmall : {}}>
              <Typography sx={styles.heading}>Pin Code</Typography>
              <Typography sx={styles.text}>
                {product?.address_id?.zipCode || "No Pincode available"}
              </Typography>
            </Box>
          )}

          <Box
            sx={{ justifyContent: role === "FAN" ? "unset" : "space-between" }}
          >
            <Typography sx={styles.heading}>Delivery Status</Typography>

            {product?.status === "DELIVERED" || role === "FAN" ? (
              <CustomChip
                name={product?.status || ""}
                backgroundColor={getStatusBackgroundColor(product?.status)}
                color={getStatusColor(product?.status)}
                width="60px"
              />
            ) : (
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={deliveryStatus}
                onChange={handleChange}
                sx={{
                  height: 40,
                  width: "30vw",
                  borderRadius: 2,
                  backgroundColor: "white",
                }}
              >
                <MenuItem value={"PROCESSING"}>Processing</MenuItem>
                <MenuItem value={"SHIPPING"}>Shipping</MenuItem>
                <MenuItem value={"DELIVERED"}>Delivered</MenuItem>
              </Select>
            )}
          </Box>
        </Box>
      </Box>
    </Box>
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
    row: {
      width: "100%",
      display: "flex",
      flexDirection: "row",
      alignItems: "flex-start",
      justifyContent: "space-between",
      borderBottom: "1px solid #0C8FFC24",
      padding: "10px 0",
    },
    cellSmall: {
      flex: "1 1 25%",
      display: "flex",
      flexDirection: "column",
      alignItems: "flex-start",
      padding: "0 10px",
    },
    cellLarge: {
      flex: "1 1 50%",
      display: "flex",
      flexDirection: "column",
      alignItems: "flex-start",
      padding: "0 10px",
    },
    heading: {
      fontSize: 12,
      fontWeight: 500,
      color: "#77767A",
      overflow: "hidden",
    },
    text: {
      fontSize: 16,
      fontWeight: 500,
      color: "#000000",
      overflow: "hidden",
    },
  });
