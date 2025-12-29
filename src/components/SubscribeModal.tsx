import { Box, Button, Typography } from "@mui/material";
import { ReactComponent as CloseIcon } from "../assets/svg/cancel.svg";
import { createStyles } from "@mui/styles";
import { ReactComponent as CorrectIcon } from "../assets/svg/tickIcon.svg";
import theme from "../themes";
import { useMakePaymentMutation } from "../services/api";
import { toast } from "react-toastify";
import { loadStripe } from "@stripe/stripe-js";

interface Props {
  name?: string;
  username?: string;
  profile_picture?: string;
  creatorId?: string;
  selectedPlan: {
    type: string;
    price: number;
  };
  closeModal: (value: boolean) => void;
}

const SubscribeModal = (props: Props) => {
  const {
    name,
    username,
    profile_picture,
    creatorId,
    selectedPlan,
    closeModal,
  } = props;
  const styles = useStyles();
  // const [paymentOption, setPaymentOption] = useState("");
  const stripePromise = loadStripe(
    import.meta.env.VITE_APP_STRIPE_PUBLISHABLE_KEY
  );
  const [makePayment] = useMakePaymentMutation();

  const benefits = [
    "Full access to this creator's exclusive content",
    "Direct message with this creator",
    "Requested personalised Pay Per View content",
    "Cancel your subscription at any time",
  ];

  const handleSubscribe = async () => {
    const { data } = await makePayment({
      amount: selectedPlan?.price * 100,
      currency: "aud",
      paymentType: 'Subscription',
      subscriptionType: selectedPlan?.type.toUpperCase(),
      ownerId: creatorId || "",
      redirectEndPoint: `profile/${creatorId}`,
      quantity: 1,
    });
    if (data?.data?.id) {
      const stripe = await stripePromise;
      const error = await stripe?.redirectToCheckout({
        sessionId: data.data.id,
      });

      if (error) {
        toast.error("Failed to redirect to payment page.");
      }
    } else {
      toast.error("Connected account of the user is invalid or not found");
    }
  };

  return (
    <Box sx={styles.container}>
      <Box sx={styles.header}>
        <Typography>Subscribe</Typography>
        <CloseIcon
          onClick={() => closeModal(false)}
          style={{ cursor: "pointer" }}
        />
      </Box>
      <Box sx={styles.contentSection}>
        <Box sx={styles.leftContainer}>
          <Box
            component="img"
            src={profile_picture || "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"}
            sx={styles.profilePicture}
          ></Box>
          <Typography fontSize={16} fontWeight={500}>
            {name}
          </Typography>
          <Typography fontSize={12} color={"rgba(0, 0, 0, 0.5)"}>
            @{username}
          </Typography>
        </Box>
        <Box sx={styles.rightContainer}>
          <Box sx={{ display: "flex", gap: "10px", flexDirection: "column" }}>
            {benefits.map((benefit, index) => (
              <Box
                key={index}
                sx={{ display: "flex", alignItems: "center", gap: "5px" }}
              >
                <CorrectIcon height={20} width={20} />
                <Typography fontSize={14}>{benefit}</Typography>
              </Box>
            ))}
            <Typography
              fontSize={14}
              color={"rgba(119, 118, 122, 1)"}
              mt={"5px"}
            >
              Selected Plan
            </Typography>
            <Box sx={styles.planContainer}>
              <Typography fontSize={20} fontWeight={300}>
                {selectedPlan.type}
              </Typography>
              <Typography fontSize={20} fontWeight={500}>
                ${selectedPlan.price}
              </Typography>
            </Box>

            {/* <Typography
              fontSize={14}
              color={"rgba(119, 118, 122, 1)"}
              mt={"5px"}
            >
              Select Payment Option
            </Typography>
            <Select
              value={paymentOption}
              onChange={(e) => setPaymentOption(e.target.value)}
              displayEmpty
              inputProps={{ "aria-label": "Without label" }}
              sx={styles.select}
            >
              <MenuItem value="">Select</MenuItem>
              <MenuItem value="AUDIO">Audio</MenuItem>
              <MenuItem value="VIDEO">Video</MenuItem>
              <MenuItem value="IMAGE">Image</MenuItem>
              <MenuItem value="TEXT">Text</MenuItem>
            </Select> */}

            <Button
              variant="contained"
              sx={styles.button}
              onClick={handleSubscribe}
            >
              Make Payment
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default SubscribeModal;

const useStyles = () =>
  createStyles({
    container: {
      width: "100%",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
    },
    header: {
      display: "flex",
      width: `95%`,
      justifyContent: "space-between",
      alignItems: "center",
    },
    contentSection: {
      width: "95%",
      display: "flex",
      justifyContent: "space-between",
      marginTop: 3,
    },
    leftContainer: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
    },
    rightContainer: {
      width: "70%",
    },
    profilePicture: {
      height: 100,
      width: 100,
      borderRadius: "50%",
      objectFit: "cover",
    },
    planContainer: {
      backgroundColor: "rgba(12, 143, 252, 1)",
      borderRadius: "8px",
      width: "120px",
      height: "100px",
      display: "flex",
      flexDirection: "column",
      padding: "10px",
      justifyContent: "center",
      alignItems: "center",
      color: "white",
    },
    select: {
      height: 40,
      borderRadius: 2,
      [theme.breakpoints.down(900)]: {
        width: 150,
      },
      [theme.breakpoints.down(900)]: {
        width: 160,
      },
    },
    button: {
      boxShadow: "unset",
      borderRadius: "10px",
      marginTop: "10px",
    },
  });
