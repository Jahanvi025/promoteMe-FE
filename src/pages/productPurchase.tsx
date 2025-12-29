import { Box, Button, CircularProgress, Typography } from "@mui/material";
import { createStyles } from "@mui/styles";
import theme from "../themes";
import PageHeader from "../components/PageHeader";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import AddressCard from "../components/Product/addressCard";
import { ReactComponent as BackIcon } from "../assets/svg/backArrow.svg";
import NewAddressCard from "../components/Product/newAddressCard";
import {
  useGetAddressQuery,
  useGetProductByIdQuery,
  useMakePaymentMutation,
  usePayFromWalletMutation,
  usePlaceOrderMutation,
} from "../services/api";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import ProductDetail from "../components/Product/productDetail";
import CustomModal from "../components/CustomModal";
import ThankYouModal from "../components/ThankYouModal";
import { loadStripe } from "@stripe/stripe-js";
import { RootState, useAppDispatch, useAppSelector } from "../store/store";
import { setWalletBalance } from "../store/reducers/authReducer";

const ProductPurchase = () => {
  const styles = useStyles();
  const [addressList, setAddressList] = useState<Address[]>([]);
  const { productId } = useParams<{ productId?: string }>();
  const [quanity, setQuantity] = useState(1);
  const [totalPrice, setTotalPrice] = useState(0);
  const [isThankModal, setIsThankModal] = useState(false);
  const [selectedAddressId, setSelecteAddressId] = useState("");
  const [isNewAddress, setIsNewAddress] = useState(false);
  const dispatch = useAppDispatch();
  const stripePromise = loadStripe(
    import.meta.env.VITE_APP_STRIPE_PUBLISHABLE_KEY
  );
  const location = useLocation();
  const navigate = useNavigate();

  const {
    data: response,
    isSuccess,
    isError,
    error,
    refetch,
  } = useGetAddressQuery();
  const {
    data: productData,
    isError: isProductError,
    isSuccess: isProductSuccess,
    error: productError,
  } = useGetProductByIdQuery({ id: productId || "" });
  const [makePayment] = useMakePaymentMutation();
  const [isOrderPlacing, setIsOrderPlacing] = useState(false);

  const [
    payFromWallet,
    {
      isSuccess: isPaid,
      isError: isWalletError,
      error: WalletError,
      isLoading,
    },
  ] = usePayFromWalletMutation();
  const [
    placeOrder,
    { isSuccess: orderPlaced, isError: isOrderError, error: orderError },
  ] = usePlaceOrderMutation();

  console.log(stripePromise, makePayment);

  useEffect(() => {
    setAddressList([]);
  }, []);

  useEffect(() => {
    if (isSuccess) {
      setAddressList(response?.data?.addresses || []);
    }
  }, [isSuccess, response]);

  useEffect(() => {
    if (isProductSuccess) {
      setTotalPrice(productData?.data?.product?.price || 0);
      sessionStorage.setItem(
        "unit_price",
        (productData?.data?.product?.price || 0).toString()
      );
      sessionStorage.setItem("quantity", "1");
    }
    if (isProductError) {
      const Error = productError as ApiError;
      toast.error(Error.data.message);
    }
  }, [isProductError, isProductSuccess]);

  const handlePay = async () => {
    if (!selectedAddressId) {
      toast.error("Please select an address");
      return;
    }

    await payFromWallet({
      amount: totalPrice,
      creatorId: productData?.data?.product?.user_id || "",
      description: `payment for ${productData?.data?.product?.name}`,
    });
    // const { data } = await makePayment({
    //   amount: totalPrice * 100,
    //   currency: "aud",
    //   paymentType: "Product",
    //   ownerId: productData?.data?.product?.user_id || "",
    //   redirectEndPoint: `purchase/${productData?.data?.product?._id}`,
    //   quantity: quanity,
    // });

    // if (data?.data?.id) {
    //   const stripe = await stripePromise;
    //   const error = await stripe?.redirectToCheckout({
    //     sessionId: data.data.id,
    //   });
    //   if (error) {
    //     toast.error("Failed to redirect to payment page.");
    //   }
    // }
  };

  const Balance = useAppSelector(
    (state: RootState) => state.auth?.walletBalance
  );
  useEffect(() => {
    if (isPaid) {
      const priceValue = price ? parseInt(price, 10) : 0;
      const remainingAmount = Balance - priceValue;
      dispatch(setWalletBalance({ balance: remainingAmount }));
      handlePlaceOrder();
    }
    if (isWalletError) {
      const Error = WalletError as ApiError;
      toast.error(Error.data?.message);
      setIsOrderPlacing(false);
    }
    if (isLoading) {
      setIsOrderPlacing(true);
    }
  }, [isPaid, isWalletError, isLoading]);

  const selectedQuantity = sessionStorage.getItem("quantity");
  const addressId = sessionStorage.getItem("selectedAddressId");
  const price = sessionStorage.getItem("unit_price");
  const queryParams = new URLSearchParams(location.search);

  useEffect(() => {
    if (queryParams.get("success")) {
      toast.loading("Payment Succeeded, placing your order!");
      handlePlaceOrder();
    } else if (queryParams.get("canceled")) {
      toast.error("Payment was canceled.");
    }
  }, [location.search]);

  const handlePlaceOrder = async () => {
    await placeOrder({
      product_id: [productId || ""],
      quantity: selectedQuantity ? parseInt(selectedQuantity, 10) : 0,
      address_id: addressId || "",
      unit_price: price ? parseInt(price, 10) : 0,
      total_price:
        (price ? parseInt(price, 10) : 0) *
        (selectedQuantity ? parseInt(selectedQuantity, 10) : 0),
    });
  };

  useEffect(() => {
    if (isError) {
      const Error = error as ApiError;
      toast.error(Error.data.message);
    }
  }, [isError]);

  useEffect(() => {
    toast.dismiss();
    setIsOrderPlacing(false);
    if (orderPlaced) {
      toast.success("Order placed successfully!");
      navigate("/feed");
    }
    if (isOrderError) {
      const validationError = orderError as ValidationError;
      const errorMessage = validationError.data.data?.errors?.[0]?.msg;
      if (errorMessage) {
        toast(errorMessage, { type: "error" });
      }
      const apiError = orderError as ApiError;
      if (apiError?.data?.message && !errorMessage) {
        toast(apiError?.data?.message, { type: "error" });
      }
    }
  }, [orderPlaced, isOrderError]);

  const handleClick = () => {
    navigate("/feed");
  };

  return (
    <Box sx={styles.outerContainer}>
      <PageHeader title={`Buy ${productData?.data.product.name}`} />
      <Box sx={styles.container}>
        <Box sx={styles.header}>
          <Button onClick={handleClick} sx={{ textTransform: "initial" }}>
            <BackIcon
              style={{ marginRight: 10 }}
              color="rgba(12, 143, 252, 1)"
            />
            <Typography color="rgba(12, 143, 252, 1)">Back</Typography>
          </Button>
        </Box>
        <ProductDetail
          product={productData?.data?.product}
          quantity={quanity}
          setQuantity={setQuantity}
          setTotalPrice={setTotalPrice}
        />
        <Typography fontSize={18} fontWeight={500} my={2}>
          Shipping Address
        </Typography>
        {addressList.map((address) => (
          <AddressCard
            key={address._id}
            address={address}
            refetch={refetch}
            selectedAddressId={selectedAddressId}
            setSelectedAddressId={setSelecteAddressId}
            setIsNewAddress={setIsNewAddress}
          />
        ))}
        <NewAddressCard
          refetch={refetch}
          setSelecetdAddressId={setSelecteAddressId}
          isNewAddress={isNewAddress}
          setIsNewAddress={setIsNewAddress}
        />
        <Button
          variant="contained"
          sx={{ marginBottom: "50px", boxShadow: "unset" }}
          onClick={handlePay}
          disabled={isOrderPlacing}
          startIcon={isOrderPlacing ? <CircularProgress size={24} /> : null}
        >
          {isOrderPlacing ? "Processing..." : "Proceed to pay"}
        </Button>
      </Box>
      <CustomModal
        open={isThankModal}
        setOpen={setIsThankModal}
        width="25%"
        padding={4}
        paddingHorizontal={true}
      >
        <ThankYouModal
          heading="Order Placed!"
          subHeading="Your order for pink crop top has been placed successfully."
          closeModal={setIsThankModal}
        />
      </CustomModal>
    </Box>
  );
};

export default ProductPurchase;

const useStyles = () =>
  createStyles({
    outerContainer: {
      marginLeft: "22%",
      overflowY: "scroll",
      scrollbarWidth: "none",
      position: "sticky",
      top: "109px",
      marginTop: "105px",
      [theme.breakpoints.down(1150)]: {
        marginLeft: "24%",
      },
      [theme.breakpoints.down(900)]: {
        marginLeft: "5%",
        marginTop: "102px",
      },
      [theme.breakpoints.down(600)]: {
        marginTop: "60px",
        marginLeft: "2%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
      },
    },
    container: {
      width: "70%",
      display: "flex",
      flexDirection: "column",
      marginLeft: "2px",
      marginRight: "20px",
      [theme.breakpoints.down(1150)]: {
        width: "95%",
      },
      [theme.breakpoints.down(600)]: {
        width: "92%",
        flexDirection: "column",
      },
    },
    header: {
      width: "100%",
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    select: {
      height: "48px",
      width: "100%",
      marginTop: "10px",
      padding: "10px",
      marginBottom: "40px",
    },
  });
