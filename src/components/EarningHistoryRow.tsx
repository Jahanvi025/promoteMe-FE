import { TableCell, TableRow, Typography, Box } from "@mui/material";
import { createStyles } from "@mui/styles";
import theme from "../themes";
import dayjs from "dayjs";

interface Props extends BalanceTransaction {}

export default function EarningHistoryRow(props: Props) {
  const { type, amount, created, fee_details } = props;
  const styles = useStyles();

  const getTypeBackgroundColor = (type: string) => {
    switch (type) {
      case "Product":
        return "#0C8FFC40";
      case "Post":
        return "#12891240";
      case "Gallery":
        return "#12891240";
      case "Yearly Sub":
        return "#E0000040";
      case "Monthly Sub":
        return "#E0000040";
      default:
        return "#0C8FFC40";
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "Product":
        return "#0C8FFC";
      case "Post":
        return "#128912";
      case "Gallery":
        return "#128912";
      case "Yearly Sub":
        return "#E00000";
      case "Monthly Sub":
        return "#E00000";
      default:
        return "#0C8FFC";
    }
  };

  return (
    <TableRow sx={styles.row}>
      <TableCell
        sx={{
          ...styles.cell,
          display: "flex",
          gap: "10px",
          alignItems: "center",
        }}
      >
        <Box
          component="img"
          src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRLPjy47N1mbAXa-TXmviwHyxxAJgnC9GRixA&usqp=CAU"
          height={30}
          width={30}
          borderRadius={50}
        ></Box>
        <Typography noWrap>{""}</Typography>
      </TableCell>
      <TableCell sx={styles.cell} align="left">
        <Typography
          noWrap
          sx={{
            backgroundColor: getTypeBackgroundColor(type),
            borderRadius: 1.5,
            padding: "0px 5px",
            width: "100px",
            textAlign: "center",
            color: getTypeColor(type),
          }}
        >
          {type.charAt(0).toUpperCase() + type.slice(1).toLowerCase()}
        </Typography>
      </TableCell>
      <TableCell sx={styles.cell} align="left">
        <Typography noWrap>${amount}</Typography>
      </TableCell>
      <TableCell sx={{ ...styles.cell }} align="left">
        <Typography noWrap>${fee_details[0]?.amount || 0}</Typography>
      </TableCell>
      <TableCell sx={styles.cell} align="left">
        <Typography>${amount - (fee_details[0]?.amount || 0)}</Typography>
      </TableCell>
      <TableCell sx={styles.cell} align="left">
        <Typography>
          {dayjs.unix(created).format("D MMM YYYY : h:mm A")}
        </Typography>
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
      [theme.breakpoints.down(1000)]: {
        maxWidth: "170px",
      },
    },
    row: {
      boxShadow: "0px 1px 10px rgba(0, 0, 0, 0.1)",
      borderRadius: 5,
      marginBottom: 8,
    },
  });
