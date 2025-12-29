import {
  Box,
  MenuItem,
  Select,
  SelectChangeEvent,
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
import { DatePicker } from "@mui/x-date-pickers";
import OrderTableRow from "./OrderTableRow";
import OrderDetail from "./Account/OrderDetail";
import Paginator from "./Account/TablePaginator";
import theme from "../themes";
import { useGetOrderHistoryQuery } from "../services/api";
import dayjs, { Dayjs } from "dayjs";
import TableSkeleton from "./Account/TableSkeleton";

export default function OrderHistoryTab() {
  const [productType, setProductType] = useState("");
  const [isViewingOrder, setIsViewingOrder] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [selectedPage, setSelectedPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [orderTableRows, setOrderTableRows] = useState<OrderHistoryItem[]>([]);
  const [fromDate, setFromDate] = useState<Dayjs | null>(null);
  const [toDate, setToDate] = useState<dayjs.Dayjs | null>(dayjs());
  const [selectedProduct, setSelectedProduct] =
    useState<OrderHistoryItem | null>(null);
  const maxDate = dayjs();

  const styles = useStyles();

  const {
    data: orderHistoryData,
    isLoading,
    isFetching,
    refetch,
  } = useGetOrderHistoryQuery({
    page: selectedPage,
    limit: rowsPerPage,
    status: productType,
    fromDate: fromDate ? fromDate.toDate() : undefined,
    toDate: toDate ? toDate.toDate() : undefined,
  });

  useEffect(() => {
    refetch();
  }, [isViewingOrder]);

  useEffect(() => {
    if (orderHistoryData) {
      const newOrders =
        orderHistoryData.data?.orderHistory?.length > 0
          ? selectedPage === 1
            ? orderHistoryData.data?.orderHistory
            : orderHistoryData?.data?.orderHistory.filter(
                (newOrder) =>
                  !orderTableRows.some(
                    (existingOrder) => existingOrder._id === newOrder._id
                  )
              )
          : [];

      setOrderTableRows((prevOrders) =>
        selectedPage === 1 ? newOrders : [...prevOrders, ...newOrders]
      );
      setHasMore(orderHistoryData.data?.orderHistory?.length > 0);
    }
  }, [orderHistoryData, selectedPage, productType]);

  const slicedRows = orderTableRows.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const handleChange = (event: SelectChangeEvent) => {
    setSelectedPage(1);
    setProductType(event.target.value as string);
  };

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
    if (hasMore) {
      setSelectedPage(selectedPage + 1);
    }
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleFromDateChange = (date: Dayjs | null) => {
    setFromDate(date);
  };

  const handleToDateChange = (date: Dayjs | null) => {
    setToDate(date);
  };

  const header = [
    "ID",
    "Products",
    "Price",
    "Delivery Status",
    "Updated On",
    "Action",
  ];

  return (
    <Box sx={styles.container}>
      {isViewingOrder ? (
        <OrderDetail
          setIsViewingOrder={setIsViewingOrder}
          product={selectedProduct}
        />
      ) : (
        <>
          <Box sx={styles.tabHeader}>
            <Typography variant="h6" sx={styles.heading}>
              Order History
            </Typography>
            <Box sx={styles.actionButtons}>
              <DatePicker
                label="From"
                value={fromDate}
                onChange={handleFromDateChange}
                sx={styles.datePicker}
                maxDate={maxDate}
                disabled={!orderTableRows.length}
              />
              <DatePicker
                label="To"
                value={toDate}
                onChange={handleToDateChange}
                sx={styles.datePicker}
                maxDate={maxDate}
                disabled={!orderTableRows.length}
              />
              <Select
                value={productType}
                onChange={handleChange}
                displayEmpty
                inputProps={{ "aria-label": "Without label" }}
                sx={{ height: 40, width: 200, borderRadius: 3 }}
                disabled={!orderTableRows.length}
              >
                <MenuItem value="">All Types</MenuItem>
                <MenuItem value="SHIPPING">Shipping</MenuItem>
                <MenuItem value="REFUNDED">Refunded</MenuItem>
                <MenuItem value="DELIVERED">Delivered</MenuItem>
                <MenuItem value="PROCESSING">Processing</MenuItem>
              </Select>
            </Box>
          </Box>
          <TableContainer component={Paper} sx={styles.tableContainer}>
            <Table
              sx={{
                margin: "0 3px",
                borderCollapse: "separate",
                borderSpacing: "0 18px",
                maxWidth: "99%",
              }}
              aria-label="order table"
            >
              <TableHead>
                <TableRow>
                  {header.map((header, index) => (
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
                      <TableSkeleton key={index} cellCount={header.length} />
                    ))}
                  </>
                ) : slicedRows.length > 0 ? (
                  slicedRows.map((order) => (
                    <OrderTableRow
                      key={order._id}
                      {...order}
                      setIsViewingOrder={setIsViewingOrder}
                      setSelectedProduct={setSelectedProduct}
                    />
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} align="center">
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
              totalRows={orderHistoryData?.data?.count || 0}
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
      width: "99%",
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
      padding: "0 16px",
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
    datePicker: {
      "& .MuiOutlinedInput-root": {
        borderRadius: "10px",
        height: "40px",
      },
      "& .MuiInputLabel-root": {
        lineHeight: 0.5,
        overflow: "visible",
      },
      maxWidth: "160px",
    },
    heading: {
      [theme.breakpoints.down(600)]: {
        display: "none",
      },
    },
  });
