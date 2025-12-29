import {
  Box,
  // MenuItem,
  // Select,
  // SelectChangeEvent,
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
import { DatePicker } from "@mui/x-date-pickers";
import theme from "../themes";
import EarningHistoryRow from "./EarningHistoryRow";
// import { CustomCard } from "./Account/CustomCard";
import Paginator from "./Account/TablePaginator";
import { useGetEarningQuery } from "../services/api";
import TableSkeleton from "./Account/TableSkeleton";
import dayjs from "dayjs";

export default function EarningHistoryTab() {
  // const [productType, setProductType] = useState("YEARLYSUBSCRIPTION");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [selectedPage, setSelectedPage] = useState(1);
  const [earningHistoryData, setEarning] = useState<BalanceTransaction[]>([]);
  const maxDate = dayjs();
  const [lastTransactionId, setLasrTransactionId] = useState("");

  const styles = useStyles();

  const {
    data: EarningData,
    isLoading,
    isFetching,
    refetch,
  } = useGetEarningQuery({
    page: selectedPage,
    limit: rowsPerPage,
    starting_after: lastTransactionId ? lastTransactionId : undefined,
  });

  useEffect(() => {
    refetch();
    setSelectedPage(1);
  }, []);

  useEffect(() => {
    if (EarningData) {
      const newData = EarningData?.data?.data;
      if (selectedPage === 1) {
        setEarning(newData);
      } else {
        setEarning((prevData) => {
          const prevDataIds = new Set(prevData.map((item) => item.id));
          const filteredNewData = newData.filter(
            (item) => !prevDataIds.has(item.id)
          );
          return [...prevData, ...filteredNewData];
        });
      }
    }
  }, [EarningData, selectedPage, refetch]);

  // const handleChange = (event: SelectChangeEvent) => {
  //   setProductType(event.target.value as string);
  //   setSelectedPage(1);
  // };

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
    if (EarningData?.data?.has_more) {
      setSelectedPage(selectedPage + 1);
      setLasrTransactionId(
        earningHistoryData[earningHistoryData.length - 1].id
      );
    }
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const slicedRows = earningHistoryData?.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const Header = ["User", "Type", "Gross", "Commission", "NET", "Date"];

  return (
    <Box sx={styles.container}>
      <Box sx={styles.earningSection}>
        {/* <CustomCard
          heading="Total"
          subheading="$0"
          backgroundColor="#E2F2FF"
          width="150px"
        />

        <CustomCard
          heading="PlateFrom Commission"
          subheading="$0"
          backgroundColor="#F4FFEB"
        />

        <CustomCard
          heading="Your Earning"
          subheading="$0"
          backgroundColor="#FFEFEE"
          width="150px"
        /> */}
      </Box>
      <Box sx={styles.tabHeader}>
        <Typography variant="h6" sx={styles.heading}>
          Earning History
        </Typography>
        <Box sx={styles.actionButtons}>
          <DatePicker label="From" sx={styles.datePicker} maxDate={maxDate} disabled={!earningHistoryData.length}/>
          <DatePicker label="To" sx={styles.datePicker} maxDate={maxDate} disabled={!earningHistoryData.length}/>
          {/* <Select
            value={productType}
            onChange={handleChange}
            displayEmpty
            inputProps={{ "aria-label": "Without label" }}
            sx={{ height: 40, width: 200, borderRadius: 3 }}
          >
            <MenuItem value="">All Types</MenuItem>
            <MenuItem value="YEARLYSUBSCRIPTION">Yearly Subscription</MenuItem>
            <MenuItem value="MONTHLYSUBSCRIPTION">
              Monthly Subscription
            </MenuItem>
            <MenuItem value="GALLERY">Gallery</MenuItem>
          </Select> */}
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
                    ...(index === 3 || index === 4 ? styles.marginLeft : {}),
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
                  <TableSkeleton key={index} cellCount={Header.length} />
                ))}
              </>
            ) : slicedRows.length > 0 ? (
              slicedRows.map((row, index) => (
                <EarningHistoryRow key={index} {...row} />
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
          totalRows={
            EarningData?.data?.has_more
              ? earningHistoryData.length + 1
              : earningHistoryData.length
          }
          rowsPerPage={rowsPerPage}
          currentPage={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Box>
    </Box>
  );
}

const useStyles = () =>
  createStyles({
    container: {
      display: "flex",
      flexDirection: "column",
      width: "100%",
    },
    tabHeader: {
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      width: "99%",
      // marginTop: 2,
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
    earningSection: {
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      width: "100%",
      maxWidth: "800px",
      justifyContent: "space-between",
      flexWrap: "wrap",
      gap: "20px",
      // marginBottom: 3,
    },
    earningTabs: {
      minWidth: 150,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      // padding: "10px 30px",
      borderRadius: 4,
      [theme.breakpoints.down(1250)]: {
        minWidth: "unset",
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
