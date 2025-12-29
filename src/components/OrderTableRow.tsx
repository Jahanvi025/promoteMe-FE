import { TableCell, TableRow, Typography, Button } from "@mui/material";
import { createStyles } from "@mui/styles";
import { formatDate } from "../utils/helper";
import { CustomChip } from "./Account/CustomChip";

export interface Order extends OrderHistoryItem {
  setIsViewingOrder: (value: boolean) => void;
  setSelectedProduct: (value: OrderHistoryItem) => void;
}

export default function OrderTableRow(props: Order) {
  const {
    _id,
    status,
    updatedAt,
    setIsViewingOrder,
    setSelectedProduct,
    product_id,
    total_price,
  } = props;
  const styles = useStyles();

  const handleViewOrder = () => {
    setSelectedProduct(props);
    setIsViewingOrder(true);
  };

  const getStatusBackgroundColor = (status: string) => {
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

  const getStatusColor = (status: string) => {
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
    <TableRow sx={styles.row}>
      <TableCell sx={styles.cell}>
        <Typography noWrap>{_id}</Typography>
      </TableCell>
      <TableCell sx={styles.cell} align="left">
        <Typography noWrap>{product_id[0].name}</Typography>
      </TableCell>
      <TableCell sx={styles.cell} align="left">
        <Typography noWrap>${total_price}</Typography>
      </TableCell>
      <TableCell sx={styles.cell} align="center">
        <Typography noWrap>
          {
            <CustomChip
              name={
                status.charAt(0).toUpperCase() + status.slice(1).toLowerCase()
              }
              backgroundColor={getStatusBackgroundColor(status)}
              color={getStatusColor(status)}
              width="70px"
            />
          }
        </Typography>
      </TableCell>
      <TableCell sx={styles.cell} align="left">
        <Typography>{formatDate(updatedAt)}</Typography>
      </TableCell>
      <TableCell sx={styles.cell} align="left">
        <Button onClick={handleViewOrder}>View</Button>
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
      padding: "14px 16px",
    },
    row: {
      boxShadow: "0px 1px 10px rgba(0, 0, 0, 0.1)",
      borderRadius: 5,
      marginBottom: 8,
    },
    noDataRow: {
      textAlign: "center",
      padding: "16px",
    },
  });
