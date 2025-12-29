import { Box, Button, Typography } from "@mui/material";
import { createStyles } from "@mui/styles";
import { useNavigate } from "react-router-dom";
import theme from "../../themes";

interface Props {
  name: string;
  description: string;
  images: string[];
  price?: string;
  _id: string;
}

export default function ProductContent(props: Props) {
  const { name, description, images, price, _id } = props;

  const styles = useStyles();
  const navigate = useNavigate();

  const handlePurchase = (productId: string) => {
    navigate(`/purchase/${productId}`);
  };

  return (
    <Box mt={2} sx={styles.container}>
      <Typography fontSize={17} fontWeight={400} width={"95%"}>
        {name}
      </Typography>
      <Typography sx={styles.productDescription}>{description}</Typography>

      <Box sx={styles.imageContainer}>
        <Box component="img" src={images[0]} sx={styles.productImage}></Box>
        <Box sx={{ width: "100%" }}>
          <Typography
            fontSize={28}
            fontWeight={600}
            color={"#0C8FFC"}
            mb={1}
          >{`$${price}`}</Typography>
          <Button
            variant="contained"
            sx={styles.Button}
            onClick={() => handlePurchase(_id)}
          >
            Buy Now
          </Button>
        </Box>
      </Box>
    </Box>
  );
}

const useStyles = () =>
  createStyles({
    container: {
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
    },
    productDescription: {
      fontSize: 14.5,
      marginBottom: 2,
      maxWidth: "100%",
      wordWrap: "break-word",
      overflowWrap: "break-word",
      width: "95%",
      alignItems: "center",
      color: "#77767A",
      maxHeight: 45,
      overflow: "hidden",
    },
    imageContainer: {
      width: "95%",
      display: "flex",
      alignItems: "center",
      gap: "40px",
    },
    productImage: {
      height: 220,
      width: 220,
      borderRadius: 4,
      objectFit: "cover",
      [theme.breakpoints.down(600)]: {
        width: 150,
        height: 150,
      },
    },
    Button: {
      height: 40,
      width: "70%",
      borderRadius: 2,
      boxShadow: "unset",
    },
  });
