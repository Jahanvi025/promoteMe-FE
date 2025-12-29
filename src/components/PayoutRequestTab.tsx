import {
  Box,
  Button,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import { createStyles } from "@mui/styles";
import { useEffect, useState } from "react";
// import { ReactComponent as SortIcon } from "../assets/svg/sort.svg";
import PayoutTableRow from "./PayoutTableRow";
import PayoutDetail from "./Account/PayoutDetail";
import theme from "../themes";
import Paginator from "./Account/TablePaginator";
import { useGetPayoutsQuery } from "../services/api";
import TableSkeleton from "./Account/TableSkeleton";
export default function PayoutRequestTab() {
  const [isViewingPayout, setIsViewingPayout] = useState(false);
  const [isViewOnly, setIsViewOnly] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [payoutRequestData, setPayoutRequestData] = useState<Payout[]>([]);
  const [selectedPage, setSelectedPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [selectedPayout, setSelectedPayout] = useState<Payout>();
  const [lastTransactionId, setLasrTransactionId] = useState("");

  const styles = useStyles();

  const Header = [
    "ID",
    "Amount",
    "Payment Gateway",
    "Status",
    "Requested On",
    "updated On",
    "Action",
  ];

  const {
    data: payoutData,
    isLoading,
    isFetching,
    refetch,
  } = useGetPayoutsQuery({
    page: selectedPage,
    limit: rowsPerPage,
    starting_after: lastTransactionId ? lastTransactionId : undefined,
  });

  useEffect(() => {
    refetch();
  }, [isViewingPayout]);

  useEffect(() => {
    if (payoutData) {
      const payouts = payoutData?.data?.payouts?.data;
      if (payouts.length > 0) {
        const newPayouts =
          selectedPage === 1
            ? payouts
            : payouts.filter(
                (newPayout) =>
                  !payoutRequestData.some(
                    (existingPayout) => existingPayout.id === newPayout.id
                  )
              );
        setPayoutRequestData((prevPayouts) =>
          selectedPage === 1 ? newPayouts : [...prevPayouts, ...newPayouts]
        );
        setHasMore(true);
      } else {
        if (selectedPage === 1) {
          setPayoutRequestData([]);
        }
        setHasMore(false);
      }
    }
  }, [payoutData, selectedPage]);

  const handlePayoutRequest = () => {
    setIsViewOnly(false);
    setIsViewingPayout(true);
  };

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
    if (hasMore && newPage > page) {
      setSelectedPage(selectedPage + 1);
      setLasrTransactionId(payoutRequestData[payoutRequestData.length - 1].id);
    }
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const slicedRows = payoutRequestData.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <Box sx={styles.container}>
      {isViewingPayout ? (
        <PayoutDetail
          setIsViewingPayout={setIsViewingPayout}
          isViewOnly={isViewOnly}
          payout={selectedPayout}
        />
      ) : (
        <>
          <Box sx={styles.tabHeader}>
            <Typography variant="h6" sx={styles.heading}>
              Payout Request
            </Typography>
            <Box sx={styles.actionButtons}>
              <Button
                variant="contained"
                sx={styles.button}
                onClick={handlePayoutRequest}
              >
                Request a Payout
              </Button>
            </Box>
          </Box>
          <TableContainer component={Paper} sx={styles.tableContainer}>
            <Table sx={styles.table} aria-label="order table">
              <TableHead>
                <TableRow>
                  {Header.map((header, index) => (
                    <TableCell
                      key={index}
                      align={index > 1 ? "center" : "left"}
                      sx={{
                        ...styles.cell,
                        ...(index === 3 || index === 4
                          ? styles.marginLeft
                          : {}),
                      }}
                    >
                      <Box display="flex" alignItems="center" gap={2}>
                        <Typography
                          sx={{ fontSize: 14, color: "rgba(0, 0, 0, 0.5)" }}
                        >
                          {header}
                        </Typography>
                        {/* <SortIcon height={14} width={14} /> */}
                      </Box>
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {isFetching || isLoading ? (
                  <>
                    {Array.from({ length: 4 }).map((_, index) => (
                      <TableSkeleton key={index} cellCount={6} />
                    ))}
                  </>
                ) : slicedRows.length > 0 ? (
                  slicedRows.map((row, index) => (
                    <PayoutTableRow
                      key={index}
                      {...row}
                      setIsViewingPayout={setIsViewingPayout}
                      setIsViewOnly={setIsViewOnly}
                      setSelectedPayout={setSelectedPayout}
                    />
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={8} align="center">
                      <Typography variant="body1">No data found</Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <Box
            sx={{ width: "100%", display: "flex", justifyContent: "center" }}
          >
            <Paginator
              totalRows={
                payoutData?.data?.payouts?.has_more
                  ? payoutRequestData.length + 1
                  : payoutRequestData.length
              }
              rowsPerPage={rowsPerPage}
              currentPage={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </Box>
        </>
      )}
    </Box>
  );
}

const useStyles = () =>
  createStyles({
    container: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      width: "100%",
    },
    tabHeader: {
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      width: "100%",
      marginTop: 2,
      justifyContent: "space-between",
    },
    actionButtons: {
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      width: "70%",
      justifyContent: "flex-end",
      gap: 2,
      [theme.breakpoints.down(600)]: {
        width: "100%",
      },
    },
    tableContainer: {
      width: "100%",
      overflowX: "auto",
      border: "none",
      boxShadow: "none",
    },
    cell: {
      fontSize: 14,
      fontWeight: 500,
      color: "#6B7280",
      whiteSpace: "nowrap",
      maxWidth: 150,
      overflow: "hidden",
      textOverflow: "ellipsis",
      borderBottom: "none",
    },
    marginLeft: {
      marginLeft: "40px",
    },
    row: {
      height: 60,
      "&:not(:last-child)": {
        marginBottom: 16,
      },
    },
    button: {
      borderRadius: 2,
      height: 40,
      fontWeight: 400,
      width: "60%",
      maxWidth: 170,
      marginRight: "10px",

      [theme.breakpoints.down(1000)]: {
        marginRight: 0,
      },
    },
    table: {
      margin: "0 3px",
      borderCollapse: "separate",
      borderSpacing: "0 18px",
      maxWidth: "99%",
    },
    heading: {
      [theme.breakpoints.down(600)]: {
        display: "none",
      },
    },
  });
