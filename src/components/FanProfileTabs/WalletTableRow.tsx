import { Avatar, Box, TableCell, TableRow, Typography } from "@mui/material";
import { createStyles } from "@mui/styles";
import dayjs from "dayjs";

interface WalletTransaction {
  _id: string;
  paidTo: {
    profile_picture: string;
    displayName: string;
  };
  description?: string;
  amount: number;
  createdAt: string;
  type: string;
}

interface Props extends WalletTransaction {}

export default function WalletTableRow(props: Props) {
  const { description, amount, createdAt, paidTo, _id, type } = props;

  const styles = useStyles();

  return (
    <TableRow sx={styles.row}>
      <TableCell sx={styles.cell} align="left">
        <Typography sx={styles.text}>{_id}</Typography>
      </TableCell>
      <TableCell sx={styles.cell} align="left">
        <Box sx={{ display: "flex", gap: "10px", alignItems: "center" }}>
          <Avatar src={paidTo?.profile_picture} sx={{ borderRadius: "50%" }} />
          <Typography>{paidTo?.displayName}</Typography>
        </Box>
      </TableCell>
      <TableCell sx={styles.cell} align="left">
        <Typography sx={styles.text}>
          {description ? description : "-"}
        </Typography>
      </TableCell>
      <TableCell sx={styles.cell} align="left">
        <Typography color={type === "DEPOSIT" ? "green" : "red"}>
          {type === "DEPOSIT" ? "+" : "-"}${amount}
        </Typography>
      </TableCell>
      <TableCell sx={styles.cell} align="center">
        <Typography>{dayjs(createdAt).format("DD MMM YYYY")}</Typography>
      </TableCell>
    </TableRow>
  );
}

const useStyles = () =>
  createStyles({
    cell: {
      fontSize: 14,
      whiteSpace: "nowrap",
      maxWidth: "90px",
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
    text: {
      maxWidth: "90%",
      overflow: "hidden",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap",
    },
  });
