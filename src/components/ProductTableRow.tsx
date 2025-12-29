import {
  TableCell,
  TableRow,
  IconButton,
  Typography,
  Box,
} from "@mui/material";
import CustomSwitch from "./CustomSwitch";
import { ReactComponent as EditIcon } from "../assets/svg/tableEdit.svg";
import { ReactComponent as DeleteIcon } from "../assets/svg/tableDelete.svg";
import { createStyles } from "@mui/styles";
import { formatDate } from "../utils/helper";

interface Props extends Product {
  setDeleteProductModal: (value: boolean) => void;
  setIsEditingProduct: (value: boolean) => void;
  setSelectedMedia: (value: (File | string)[]) => void;
  setSelectedProduct: (value: Product) => void;
}

export default function ProductTableRow(props: Props) {
  const {
    images,
    name,
    price,
    stock,
    type,
    status,
    updatedAt,
    setDeleteProductModal,
    setIsEditingProduct,
    setSelectedMedia,
    setSelectedProduct,
    description,
    _id,
  } = props;
  const styles = useStyles();

  const selectedProduct = {
    _id,
    images,
    name,
    price,
    stock,
    type,
    status,
    description,
  };
  const handleEditProduct = () => {
    setIsEditingProduct(true);
    setSelectedMedia(images);
    setSelectedProduct(selectedProduct);
  };

  const handleDeleteProduct = async () => {
    setDeleteProductModal(true);
    setSelectedProduct(selectedProduct);
  };

  const ProductImage =
    images[0] ||
    "https://t4.ftcdn.net/jpg/04/73/25/49/360_F_473254957_bxG9yf4ly7OBO5I0O5KABlN930GwaMQz.jpg";

  return (
    <TableRow sx={styles.row}>
      <TableCell sx={styles.cell}>
        <Box
          component="img"
          src={ProductImage}
          height={58}
          width={85}
          borderRadius={4}
          sx={{ objectFit: "cover" }}
        />
      </TableCell>
      <TableCell sx={styles.cell} align="left">
        <Typography noWrap>{name}</Typography>
      </TableCell>
      <TableCell sx={styles.cell} align="left">
        <Typography noWrap>${price}</Typography>
      </TableCell>
      <TableCell sx={styles.cell} align="left">
        <Typography noWrap>{stock}</Typography>
      </TableCell>
      <TableCell sx={styles.cell} align="left">
        <Typography noWrap>
          {type ? type.charAt(0) + type.slice(1).toLowerCase() : ""}
        </Typography>
      </TableCell>
      <TableCell sx={styles.cell} align="left">
        <CustomSwitch isActive={status === "ACTIVE"} productId={_id} />
      </TableCell>
      <TableCell sx={styles.cell} align="center">
        <Typography>{formatDate(updatedAt)}</Typography>
      </TableCell>
      <TableCell sx={styles.cell} align="center">
        <IconButton onClick={handleEditProduct}>
          <EditIcon height={20} width={20} />
        </IconButton>
        <IconButton onClick={handleDeleteProduct}>
          <DeleteIcon height={20} width={20} />
        </IconButton>
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
      padding: "8px 16px 5px 16px",
    },
    row: {
      boxShadow: "0px 1px 10px rgba(0, 0, 0, 0.1)",
      borderRadius: 5,
      marginBottom: 8,
    },
  });
