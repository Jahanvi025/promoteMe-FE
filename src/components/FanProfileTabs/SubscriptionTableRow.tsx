import React, { useEffect } from "react";
import {
  TableCell,
  TableRow,
  Typography,
  Box,
  IconButton,
  Button,
} from "@mui/material";
import Avatar from "@mui/material/Avatar";
import { createStyles } from "@mui/styles";
import dayjs from "dayjs";
import { CustomChip } from "../Account/CustomChip";
import { useCancelSubscriptionMutation } from "../../services/api";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

interface SubscriptionTableRowProps extends Subscription {
  refetch: () => void;
}

const SubscriptionTableRow: React.FC<SubscriptionTableRowProps> = ({
  creator,
  type,
  startDate,
  expiryDate,
  paymentMethod,
  status,
  _id,
  refetch,
}) => {
  const styles = useStyles(status);

  const [cancelSubscription, { isSuccess, isError, error }] =
    useCancelSubscriptionMutation();

  const navigate = useNavigate();

  const resolvePaymentMethodColor = (paymentMethod: string) => {
    switch (paymentMethod) {
      case "PayPal":
        return "rgba(206, 19, 35, 1)";
      case "Credit Card":
        return "rgba(0, 78, 206, 1)";
      case "Stripe":
        return "rgba(206, 19, 35, 1)";
      case "Bank Transfer":
        return "rgba(72, 191, 58, 1)";
      default:
        return "rgba(72, 191, 58, 1)";
    }
  };

  const resolveSubscriptionTypeColor = (paymentMethod: string) => {
    switch (paymentMethod) {
      case "YEARLY":
        return "rgba(206, 19, 35, 1)";
      case "MONTHLY":
        return "rgba(0, 78, 206, 1)";
      case "Free":
        return "rgba(211, 96, 30, 1)";
      case "Bank Transfer":
        return "rgba(72, 191, 58, 1)";
      default:
        return "rgba(72, 191, 58, 1)";
    }
  };

  const resolvePaymentMethodBackground = (type: string) => {
    switch (type) {
      case "PayPal":
        return "rgba(206, 19, 35, 0.2)";
      case "Credit Card":
        return "rgba(1, 78, 206, 0.2)";
      case "Stripe":
        return "rgba(206, 19, 35, 0.2)";
      case "Bank Transfer":
        return "rgba(72, 191, 58, 0.2)";
      default:
        return "rgba(72, 191, 58, 0.2)";
    }
  };

  const resolveSubscriptionTypeBackground = (type: string) => {
    switch (type) {
      case "YEARLY":
        return "rgba(206, 19, 35, 0.2)";
      case "MONTHLY":
        return "rgba(1, 78, 206, 0.2)";
      default:
        return "rgba(72, 191, 58, 0.2)";
    }
  };

  const handleCancel = async () => {
    await cancelSubscription({
      id: _id,
    });
  };

  const handleActivate = async () => {
    navigate(`/profile/${creator?._id}`);
  };

  useEffect(() => {
    if (isSuccess) {
      toast.success("Subscription canceled successfully");
      refetch();
    }
    if (isError) {
      const Error = error as ApiError;
      toast.error(Error?.data?.message);
    }
  }, [isSuccess, isError]);

  return (
    <TableRow sx={styles.row}>
      <TableCell sx={styles.cell} align="left">
        <Box sx={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <Avatar src={creator.profile_picture} sx={{ borderRadius: "50%" }} />
          <Typography>{creator.displayName}</Typography>
        </Box>
      </TableCell>
      <TableCell sx={styles.cell} align="left">
        <CustomChip
          name={type.charAt(0) + type.slice(1).toLowerCase()}
          color={resolveSubscriptionTypeColor(type)}
          backgroundColor={resolveSubscriptionTypeBackground(type)}
          width="fit-content"
        />
      </TableCell>
      <TableCell sx={styles.cell} align="left">
        <Typography>{dayjs(startDate).format("DD MMM YYYY")}</Typography>
      </TableCell>
      <TableCell sx={styles.cell} align="left">
        <Typography>{dayjs(expiryDate).format("DD MMM YYYY")}</Typography>
      </TableCell>
      <TableCell sx={styles.cell} align="left">
        <CustomChip
          name={paymentMethod?.charAt(0)?.toUpperCase() + paymentMethod?.slice(1)}
          color={resolvePaymentMethodColor(paymentMethod)}
          backgroundColor={resolvePaymentMethodBackground(paymentMethod)}
          width="fit-content"
        />
      </TableCell>
      <TableCell sx={styles.cell} align="center">
        {status === "EXPIRED" ? (
          <CustomChip
            name={status}
            color="rgba(206, 19, 35, 1)"
            backgroundColor="rgba(206, 19, 35, 0.2)"
            width="fit-content"
          />
        ) : (
          <CustomChip
            name={status?.charAt(0) + status?.slice(1).toLowerCase()}
            backgroundColor="rgba(72, 191, 58, 0.2)"
            color="rgba(72, 191, 58, 1)"
            width="fit-content"
          />
        )}
      </TableCell>
      <TableCell sx={styles.cell} align="left">
        <IconButton>
          {status === "EXPIRED" ? (
            <Button
              variant="contained"
              sx={styles.button}
              onClick={handleActivate}
            >
              Activate
            </Button>
          ) : (
            <Button sx={styles.button} onClick={handleCancel}>
              Cancel
            </Button>
          )}
        </IconButton>
      </TableCell>
    </TableRow>
  );
};

const useStyles = (status: string) =>
  createStyles({
    cell: {
      fontSize: 14,
      whiteSpace: "nowrap",
      maxWidth: "150px",
      overflow: "hidden",
      textOverflow: "ellipsis",
      borderBottom: "none",
      padding: "8px 16px",
    },
    row: {
      boxShadow: "0px 1px 10px rgba(0, 0, 0, 0.1)",
      borderRadius: 5,
      marginBottom: 8,
    },
    button: {
      width: "100px",
      border: status !== "ACTIVE" ? "none" : "1px solid rgba(206, 19, 35, 1)",
      boxShadow: "unset",
      color: status !== "ACTIVE" ? "white" : "rgba(206, 19, 35, 1)",
    },
  });

export default SubscriptionTableRow;
