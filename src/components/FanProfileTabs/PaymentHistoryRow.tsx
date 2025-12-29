import React from "react";
import { TableCell, TableRow, Typography } from "@mui/material";
import dayjs from "dayjs";
import { CustomChip } from "../Account/CustomChip";

interface PaymentHistoryRowProps {
  _id: string;
  type: string;
  amount: string;
  paymentMethod: string;
  status: string;
  createdAt: string;
}

const PaymentHistoryRow: React.FC<PaymentHistoryRowProps> = ({
  _id,
  type,
  paymentMethod,
  status,
  createdAt,
  amount,
}) => {
  const resolvePaymentMethodColor = (paymentMethod: string) => {
    switch (paymentMethod) {
      case "PayPal":
        return "rgba(206, 19, 35, 1)";
      case "Credit Card":
        return "rgba(12, 143, 252, 1)";
      case "Stripe":
        return "rgba(206, 19, 35, 1)";
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
        return "rgba(12, 143, 252, 0.12)";
      case "Stripe":
        return "rgba(206, 19, 35, 0.2)";
      case "Bank Transfer":
        return "rgba(72, 191, 58, 0.2)";
      default:
        return "rgba(72, 191, 58, 0.2)";
    }
  };

  const resolveStatusColor = (status: string) => {
    switch (status) {
      case "Cancelled":
        return "rgba(206, 19, 35, 1)";
      case "Done":
        return "rgba(12, 143, 252, 1)";
      default:
        return "rgba(72, 191, 58, 1)";
    }
  };

  const resolveStatusBackground = (status: string) => {
    switch (status) {
      case "Cancelled":
        return "rgba(206, 19, 35, 0.2)";
      case "Done":
        return "rgba(12, 143, 252, 0.12)";
      default:
        return "rgba(72, 191, 58, 0.2)";
    }
  };

  const resolvePaymentTypeColor = (type: string) => {
    switch (type) {
      case "Monthly Subscription":
        return "rgba(211, 96, 30, 1)";
      case "Wallet Purchase":
        return "rgba(12, 143, 252, 1)";
      case "Yearly Subscription":
        return "rgba(206, 19, 35, 1)";
      case "Exclusive Content":
        return "rgba(118, 12, 252, 1)";
      default:
        return "rgba(12, 143, 252, 1)";
    }
  };

  const resolvePaymentTypeBackground = (type: string) => {
    switch (type) {
      case "Monthly Subscription":
        return "rgba(211, 96, 30, 0.12)";
      case "Wallet Purchase":
        return "rgba(12, 143, 252, 0.12)";
      case "Yearly Subscription":
        return "rgba(206, 19, 35, 0.2)";
      case "Exclusive Content":
        return "rgba(146, 12, 252, 0.12)";
      default:
        return "rgba(12, 143, 252, 0.12)";
    }
  };

  return (
    <TableRow sx={styles.row}>
      <TableCell sx={styles.cell} align="left">
        <Typography variant="body2" sx={styles.text} maxWidth={"70%"}>
          {_id}
        </Typography>
      </TableCell>
      <TableCell sx={styles.cell} align="left">
        <CustomChip
          name={type.toLowerCase()}
          color={resolvePaymentTypeColor(type)}
          backgroundColor={resolvePaymentTypeBackground(type)}
          width="fit-content"
        />
      </TableCell>
      <TableCell sx={styles.cell} align="left">
        <Typography variant="body2">{amount ? `$${amount}` : "-"} </Typography>
      </TableCell>
      <TableCell sx={styles.cell} align="left">
        <CustomChip
          name={status.toLowerCase()}
          color={resolveStatusColor(status)}
          backgroundColor={resolveStatusBackground(status)}
          width="fit-content"
        />
      </TableCell>
      <TableCell sx={styles.cell} align="left">
        <CustomChip
          name={paymentMethod}
          color={resolvePaymentMethodColor(paymentMethod)}
          backgroundColor={resolvePaymentMethodBackground(paymentMethod)}
          width="fit-content"
        />
      </TableCell>
      <TableCell sx={styles.cell} align="left">
        <Typography variant="body2">
          {dayjs(createdAt).format("DD MMM YYYY")}
        </Typography>
      </TableCell>
    </TableRow>
  );
};

const styles = {
  cell: {
    fontSize: 14,
    whiteSpace: "nowrap",
    maxW_idth: "165px",
    overflow: "h_idden",
    textOverflow: "ellipsis",
    borderBottom: "none",
    padding: "16px",
  },
  row: {
    boxShadow: "0px 1px 10px rgba(0, 0, 0, 0.1)",
    borderRadius: 5,
    marginBottom: 8,
    padding: "10px 0",
  },
  text: {
    maxWidth: "90%",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },
};

export default PaymentHistoryRow;
