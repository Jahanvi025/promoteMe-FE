import { Button, TableCell, TableRow, Typography } from "@mui/material";
import { createStyles } from "@mui/styles";
import dayjs from "dayjs";
import { CustomChip } from "./Account/CustomChip";

interface Props extends Payout {
  setIsViewingPayout: (value: boolean) => void;
  setIsViewOnly: (value: boolean) => void;
  setSelectedPayout: (value: Payout) => void;
}

export default function PayoutTableRow(props: Props) {
  const {
    id,
    amount,
    status,
    created,
    setIsViewingPayout,
    setIsViewOnly,
    arrival_date,
    setSelectedPayout,
  } = props;
  const styles = useStyles();

  const getStatusBackgroundColor = (status: string) => {
    switch (status) {
      case "Done":
        return "#0C8FFC40";
      case "Pending":
        return "#12891240";
      case "Cancelled":
        return "#E0000040";
      default:
        return "#0C8FFC40";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Done":
        return "#0C8FFC";
      case "Pending":
        return "#128912";
      case "Cancelled":
        return "#E00000";
      default:
        return "#0C8FFC";
    }
  };

  const getGatewayBackgroundColor = (status: string) => {
    switch (status) {
      case "PayPal":
        return "#0C8FFC40";
      case "Stripe":
        return "#12891240";
      case "Bank Transfer":
        return "#E0000040";
      default:
        return "#FFFFFF";
    }
  };

  const getGatewayColor = (status: string) => {
    switch (status) {
      case "PayPal":
        return "#0C8FFC";
      case "Stripe":
        return "#128912";
      case "Bank Transfer":
        return "#E00000";
      default:
        return "#FFFFFF";
    }
  };

  const handleViewProduct = () => {
    setIsViewOnly(true);
    setIsViewingPayout(true);
    setSelectedPayout(props);
  };

  return (
    <TableRow sx={styles.row}>
      <TableCell sx={styles.cell} align="left">
        <Typography noWrap>{id}</Typography>
      </TableCell>
      <TableCell sx={styles.cell} align="left">
        <Typography noWrap>{amount}</Typography>
      </TableCell>
      <TableCell sx={styles.cell} align="left">
        <Typography
          noWrap
          sx={{
            backgroundColor: getGatewayBackgroundColor("Stripe"),
            borderRadius: 1.5,
            padding: "0px 2px",
            maxWidth: "130px",
            color: getGatewayColor("Stripe"),
            textAlign: "center",
          }}
        >
          {"Stripe"}
        </Typography>
      </TableCell>
      <TableCell sx={styles.cell} align="left">
        <Typography noWrap>
          <CustomChip
            name={
              status.charAt(0).toUpperCase() + status.slice(1).toLowerCase()
            }
            backgroundColor={getStatusBackgroundColor(status)}
            color={getStatusColor(status)}
            width="50px"
          />
        </Typography>
      </TableCell>
      <TableCell sx={styles.cell} align="left">
        <Typography>
          {dayjs.unix(created).format("D MMM YYYY : h:mm A")}
        </Typography>
      </TableCell>
      <TableCell sx={styles.cell} align="left">
        <Typography>
          {dayjs.unix(arrival_date).format("D MMM YYYY : h:mm A")}
        </Typography>
      </TableCell>
      <TableCell sx={styles.cell} align="left">
        <Button onClick={handleViewProduct}>View</Button>
      </TableCell>
    </TableRow>
  );
}

const useStyles = () =>
  createStyles({
    cell: {
      fontSize: 14,
      whiteSpace: "nowrap",
      maxWidth: "150px",
      overflow: "hidden",
      textOverflow: "ellipsis",
      borderBottom: "none",
    },
    row: {
      boxShadow: "0px 1px 10px rgba(0, 0, 0, 0.1)",
      borderRadius: 5,
      marginBottom: 8,
    },
  });
