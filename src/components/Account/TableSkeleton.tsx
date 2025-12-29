import { Skeleton, TableCell, TableRow } from "@mui/material";
import { createStyles } from "@mui/styles";
interface TableSkeletonProps {
  cellCount?: number;
}
const TableSkeleton: React.FC<TableSkeletonProps> = ({ cellCount = 5 }) => {
  const styles = useStyles();
  return (
    <TableRow sx={styles.row}>
      <TableCell
        sx={{
          ...styles.cell,
        }}
        align="left"
      >
        <Skeleton variant="text" width="80%" />
      </TableCell>
      <TableCell sx={styles.cell} align="left">
        <Skeleton variant="text" width="80%" />
      </TableCell>
      <TableCell sx={{ ...styles.cell, minWidth: 110 }} align="left">
        <Skeleton variant="text" width="80%" />
      </TableCell>
      <TableCell sx={styles.cell} align="center">
        <Skeleton variant="text" width="80%" />
      </TableCell>
      <TableCell sx={styles.cell} align="right">
        <Skeleton variant="text" width="80%" />
      </TableCell>
      {cellCount >= 6 && (
        <TableCell sx={styles.cell} align="center">
          <Skeleton variant="text" width="80%" />
        </TableCell>
      )}
      {cellCount >= 7 && (
        <TableCell sx={styles.cell} align="center">
          <Skeleton variant="text" width="80%" />
        </TableCell>
      )}
      {cellCount >= 8 && (
        <TableCell sx={styles.cell} align="center">
          <Skeleton variant="text" width="80%" />
        </TableCell>
      )}
    </TableRow>
  );
};

export default TableSkeleton;

const useStyles = () =>
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
  });
