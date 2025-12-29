import {
  Box,
  InputAdornment,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
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
import SearchIcon from "@mui/icons-material/Search";
import { useEffect, useState } from "react";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
// import { ReactComponent as SortIcon } from "../../assets/svg/sort.svg";
import Paginator from "./../Account/TablePaginator";
import theme from "../../themes";
import { useGetSubscriptionsQuery } from "../../services/api";
import dayjs, { Dayjs } from "dayjs";
import TableSkeleton from "../Account/TableSkeleton";
import SubscriptionTableRow from "./SubscriptionTableRow";

export default function SubscriptionTab() {
  const [age, setAge] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const styles = useStyles();
  const [selectedPage, setSelectedPage] = useState(1);
  const [subScriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [fromDate, setFromDate] = useState<Dayjs | null>(null);
  const [toDate, setToDate] = useState<dayjs.Dayjs | null>(dayjs());
  const [searchValue, setSearchValue] = useState<string>("");

  const { data, isLoading, isFetching, refetch } = useGetSubscriptionsQuery({
    page: selectedPage,
    limit: rowsPerPage,
    searchString: searchValue,
    type: age,
    fromDate: fromDate ? fromDate.toDate() : undefined,
    toDate: toDate ? toDate.toDate() : undefined,
  });
  const maxDate = dayjs();

  useEffect(() => {
    if (data?.data?.subscriptions) {
      setSubscriptions(data.data.subscriptions);

      data?.data?.subscriptions?.length > 0
        ? setHasMore(true)
        : setHasMore(false);
    }
  }, [data]);

  const header = [
    "Creator",
    "Type",
    "Start Date",
    "End Date",
    "Payment Method",
    "Status",
    "Action",
  ];

  const handleChange = (event: SelectChangeEvent) => {
    setSelectedPage(1);
    setAge(event.target.value as string);
  };

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
    if (hasMore && newPage > page) {
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

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(event.target.value);
    setSubscriptions([]);
    setSelectedPage(1);
  };

  const slicedRows = subScriptions.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <Box sx={styles.container}>
      <>
        <Box sx={styles.tabHeader}>
          <Typography variant="h6" sx={styles.heading}>
            Subscriptions
          </Typography>
          <Box sx={styles.actionButtons}>
            <TextField
              id="outlined-basic"
              variant="outlined"
              placeholder="Search"
              value={searchValue}
              autoComplete="off"
              onChange={handleSearchChange}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 3,
                  height: 40,
                },
                width: 500,
                maxWidth: "44%",
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon style={{ color: "rgba(0, 0, 0, 0.54)" }} />
                  </InputAdornment>
                ),
              }}
            />
            <Select
              value={age}
              onChange={handleChange}
              displayEmpty
              inputProps={{ "aria-label": "Without label" }}
              sx={styles.select}
            >
              <MenuItem value="">All Types</MenuItem>
              <MenuItem value="MONTHLY">Monthly</MenuItem>
              <MenuItem value="VIDEO">Yearly</MenuItem>
            </Select>
            <DatePicker
              label="From"
              value={fromDate}
              onChange={handleFromDateChange}
              sx={styles.datePicker}
              maxDate={maxDate}
            />
            <DatePicker
              label="To"
              value={toDate}
              onChange={handleToDateChange}
              sx={styles.datePicker}
              maxDate={maxDate}
            />
          </Box>
        </Box>
        <TableContainer component={Paper} sx={styles.tableContainer}>
          <Table sx={styles.table} aria-label="feeds table">
            <TableHead>
              <TableRow>
                {header.map((header, index) => (
                  <TableCell
                    key={index}
                    align={index > 0 ? "center" : "left"}
                    sx={{
                      ...styles.cell,
                      ...(header === "Status"
                        ? { pl: 3 }
                        : header === "Actions"
                        ? { pl: "5%" }
                        : {}),
                    }}
                  >
                    <Box
                      display="flex"
                      alignItems="center"
                      gap={2}
                      justifyContent={header === "Action" ? "center" : "left"}
                    >
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
                slicedRows.map((row, index) => (
                  <SubscriptionTableRow
                    key={index}
                    {...row}
                    refetch={refetch}
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
        <Box sx={{ width: "100%", display: "flex", justifyContent: "center" }}>
          <Paginator
            totalRows={data?.data?.count || 0}
            rowsPerPage={rowsPerPage}
            currentPage={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Box>
      </>
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
      width: "99%",
      justifyContent: "space-between",
      [theme.breakpoints.down(600)]: {
        marginBottom: 0,
        marginTop: 0,
      },
    },
    actionButtons: {
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      width: "65%",
      justifyContent: "flex-end",
      gap: 2,
      [theme.breakpoints.down(900)]: {
        width: "75%",
      },
      [theme.breakpoints.down(600)]: {
        width: "100%",
        flexWrap: "wrap",
        justifyContent: "center",
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
    tableContainer: {
      width: "100%",
      overflowX: "auto",
      border: "none",
      boxShadow: "none",
      scrollbarWidth: "thin",
      [theme.breakpoints.down(600)]: {
        scrollbarWidth: "none",
      },
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
    table: {
      margin: "0 3px",
      borderCollapse: "separate",
      borderSpacing: "0 18px",
      maxWidth: "99%",
    },
    select: {
      height: 40,
      width: 200,
      borderRadius: 3,
      [theme.breakpoints.down(900)]: {
        width: 150,
      },
      [theme.breakpoints.down(900)]: {
        width: 160,
      },
    },
    heading: {
      [theme.breakpoints.down(600)]: {
        display: "none",
      },
    },
  });
