import { Box, Typography } from "@mui/material";
import { createStyles } from "@mui/styles";
import { useEffect } from "react";
import { ReactComponent as IncreaseIcon } from "../../assets/svg/increaseIcon.svg";
import { ReactComponent as DecreaseIcon } from "../../assets/svg/decreaseIcon.svg";

interface Props {
  product?: Product;
  quantity: number;
  setQuantity: (value: number) => void;
  setTotalPrice: (value: number) => void;
}
const ProductDetail = (props: Props) => {
  const { product, quantity, setQuantity, setTotalPrice } = props;
  const styles = useStyles();

  const handleIncrement = () => {
    if (product?.stock && quantity < product?.stock) {
      setQuantity(quantity + 1);
      sessionStorage.setItem("quantity", (quantity + 1).toString());
    }
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
      sessionStorage.setItem("quantity", (quantity - 1).toString());
    }
  };

  useEffect(() => {
    setTotalPrice(quantity * (product?.price || 0));
  }, [quantity]);

  return (
    <Box sx={styles.container}>
      <Box sx={styles.leftContainer}>
        <Typography
          component="img"
          src={product?.images[0]}
          sx={styles.productImage}
        ></Typography>
        <Box>
          <Typography mb={1} fontSize={17}>
            {product?.name}
          </Typography>
          <Typography fontSize={14} color={"rgba(119, 118, 122, 1)"}>
            Quantity: {quantity}
          </Typography>
          <Typography fontSize={14} color={"rgba(119, 118, 122, 1)"}>
            Total Price: ${quantity * (product?.price ?? 0)}
          </Typography>
        </Box>
      </Box>
      <Box sx={styles.quantityPicker}>
        <DecreaseIcon onClick={handleDecrement} />
        <Typography>{quantity}</Typography>
        <IncreaseIcon onClick={handleIncrement} />
      </Box>
    </Box>
  );
};

export default ProductDetail;

const useStyles = () =>
  createStyles({
    container: {
      width: "94%",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      border: "1px solid rgba(211, 216, 223, 1)",
      borderRadius: 2,
      padding: "10px 20px",
      marginY: "15px",
    },
    leftContainer: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      gap: "20px",
    },
    productImage: {
      width: 100,
      height: 100,
      borderRadius: "50%",
    },
    quantityPicker: {
      width: 100,
      height: 40,
      borderRadius: 2,
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginLeft: "10px",
      padding: "0 10px",
      backgroundColor: "#ffffff",
      border: "1px solid rgba(12, 143, 252, 1)",
    },
  });
