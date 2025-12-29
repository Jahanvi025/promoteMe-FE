import {
  Box,
  Button,
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
// import { ReactComponent as SortIcon } from "../assets/svg/sort.svg";
import ProductTableRow from "./ProductTableRow";
import CustomModal from "./CustomModal";
import { IoMdAdd } from "react-icons/io";
import AddProduct from "./Account/AddProduct";
import Paginator from "./Account/TablePaginator";
import theme from "../themes";
import { useDeleteProductMutation, useGetProductsQuery } from "../services/api";
import { toast } from "react-toastify";
import TableSkeleton from "./Account/TableSkeleton";

export default function MyProductsTab() {
  const [productType, setProductType] = useState("");
  const [deleteProductModal, setDeleteProductModal] = useState(false);
  const [isEditingProduct, setIsEditingProduct] = useState(false);
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState<(File | string)[]>();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [selectedPage, setSelectedPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [productTableRows, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product>();
  const [searchValue, setSearchValue] = useState<string>("");

  const styles = useStyles();

  const {
    data: productsData,
    isLoading,
    isFetching,
    refetch,
  } = useGetProductsQuery({
    page: selectedPage,
    limit: rowsPerPage,
    type: productType,
    searchString: searchValue,
  });

  const [deleteProduct, { isSuccess, isError, error }] =
    useDeleteProductMutation();

  useEffect(() => {
    refetch();
  }, [isEditingProduct, isAddingProduct, isSuccess, productType]);

  useEffect(() => {
    if (productsData) {
      const newProducts =
        productsData.data.products.length > 0
          ? selectedPage === 1
            ? productsData.data.products
            : productsData.data.products.filter(
                (newProduct) =>
                  !productTableRows.some(
                    (existingProduct) => existingProduct._id === newProduct._id
                  )
              )
          : [];

      setProducts((prevProducts) =>
        selectedPage === 1 ? newProducts : [...prevProducts, ...newProducts]
      );
      setHasMore(productsData.data.products.length > 0);
    }
  }, [productsData, selectedPage]);

  const slicedRows = productTableRows.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const handleChange = (event: SelectChangeEvent) => {
    setProductType(event.target.value as string);
    setSelectedPage(1);
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

  const handleDeleteProduct = async () => {
    await deleteProduct(selectedProduct?._id || "");
  };

  useEffect(() => {
    if (isSuccess) {
      toast.success("Product deleted successfully");
      setDeleteProductModal(false);
    }
    if (isError) {
      const Error = error as ApiError;
      toast.error(Error.data.message);
    }
  }, [isSuccess, isError]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(event.target.value);
    setProducts([]);
    setSelectedPage(1);
  };

  const header = [
    "Thumbnail",
    "Name",
    "Price",
    "Stock",
    "Type",
    "Status",
    "Updated On",
    "Actions",
  ];

  return (
    <Box sx={styles.container}>
      {isEditingProduct || isAddingProduct ? (
        <AddProduct
          setIsEditingProduct={setIsEditingProduct}
          setIsAddingProduct={setIsAddingProduct}
          isEditingProduct={isEditingProduct}
          selectedMedia={selectedMedia}
          selectedProduct={selectedProduct}
          setSelectedProduct={setSelectedProduct}
        />
      ) : (
        <>
          <Box sx={styles.tabHeader}>
            <Typography variant="h6" sx={styles.heading}>
              My Products
            </Typography>
            <Box sx={styles.actionButtons}>
              <TextField
                id="outlined-basic"
                variant="outlined"
                placeholder="Search"
                value={searchValue}
                onChange={handleSearchChange}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 3,
                    height: 40,
                  },
                  "& .MuiInputBase-root": {
                    paddingLeft: "10px",
                  },
                  width: 200,
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon
                        style={{
                          color: "rgba(0, 0, 0, 0.54)",
                          fontSize: "22px",
                        }}
                      />
                    </InputAdornment>
                  ),
                }}
                disabled={!productTableRows.length}
              />
              <Select
                value={productType}
                onChange={handleChange}
                displayEmpty
                inputProps={{ "aria-label": "Without label" }}
                sx={{ height: 40, width: "25%", borderRadius: 3 }}
                disabled={!productTableRows.length}
              >
                <MenuItem value="">All Types</MenuItem>
                <MenuItem value="PHYSICAL">Physical</MenuItem>
                <MenuItem value="DIGITAL">Digital</MenuItem>
              </Select>

              <Button
                variant="contained"
                sx={{
                  borderRadius: 2,
                  height: 40,
                  fontWeight: 400,
                  width: "60%",
                  maxWidth: 170,
                  lineHeight: 1,
                  boxShadow: "unset",
                }}
                onClick={() => setIsAddingProduct(true)}
              >
                <IoMdAdd color="white" fontSize={13} />
                &nbsp; Add Product
              </Button>
            </Box>
          </Box>
          <TableContainer component={Paper} sx={styles.tableContainer}>
            <Table
              sx={{
                minWidth: 1200,
                margin: "0 3px",
                borderCollapse: "separate",
                borderSpacing: "0 18px",
              }}
              aria-label="product table"
            >
              <TableHead>
                <TableRow>
                  {header.map((header, index) => (
                    <TableCell
                      key={index}
                      align={index > 1 ? "center" : "left"}
                      sx={{
                        ...styles.cell,
                        ...(header === "Status"
                          ? { pl: 5 }
                          : header === "Actions" || header === "Updated On"
                          ? { pl: "3%" }
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
                  slicedRows.map((product) => (
                    <ProductTableRow
                      key={product._id}
                      {...product}
                      setDeleteProductModal={setDeleteProductModal}
                      setIsEditingProduct={setIsEditingProduct}
                      setSelectedMedia={setSelectedMedia}
                      setSelectedProduct={setSelectedProduct}
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
              totalRows={productsData?.data.totalProducts || 0}
              rowsPerPage={rowsPerPage}
              currentPage={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </Box>
        </>
      )}
      <CustomModal
        open={deleteProductModal}
        setOpen={setDeleteProductModal}
        width="25%"
        padding={5}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Typography variant="h5">Delete this Product?</Typography>
          <Typography mt={2} textAlign="center" color="rgba(0, 0, 0, 0.69)">
            Are you sure you want to delete this Product?
          </Typography>
          <Box
            mt={4}
            sx={{
              width: "100%",
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              gap: 3,
            }}
          >
            <Button
              onClick={() => setDeleteProductModal(false)}
              variant="outlined"
              sx={{ paddingX: 8, height: 40, borderRadius: 10 }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleDeleteProduct}
              variant="contained"
              sx={{ paddingX: 8, height: 40, borderRadius: 10 }}
              color="error"
            >
              Delete
            </Button>
          </Box>
        </Box>
      </CustomModal>
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
      justifyContent: "space-between",
      [theme.breakpoints.down("lg")]: {
        justifyContent: "flex-end",
      },
    },
    heading: {
      fontWeight: 600,
      fontSize: 20,
      lineHeight: 2,
      [theme.breakpoints.down("md")]: {
        display: "none",
      },
    },
    actionButtons: {
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      width: "84%",
      justifyContent: "flex-end",
      gap: 2,
      [theme.breakpoints.down(600)]: {
        width: "100%",
        justifyContent: "center",
        gap: 1.5,
        ".MuiInput-root": {
          width: "100%",
        },
      },
    },
    tableContainer: {
      width: "100%",
      marginTop: 1,
      backgroundColor: "transparent",
      boxShadow: "none",
      [theme.breakpoints.down("sm")]: {
        marginLeft: 0,
        overflowX: "auto",
      },
    },
    cell: {
      backgroundColor: "white",
      borderBottom: "none",
      fontWeight: 700,
    },
  });
