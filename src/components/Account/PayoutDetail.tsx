import {
  Box,
  Button,
  MenuItem,
  Select,
  SelectChangeEvent,
  Typography,
} from "@mui/material";
import { ReactComponent as BackIcon } from "../../assets/svg/backArrow.svg";
import { ReactComponent as EarnIcon } from "../../assets/svg/earnIcon.svg";
import { createStyles } from "@mui/styles";
import { CustomCard } from "./CustomCard";
import { useEffect, useState } from "react";
import { CustomChip } from "./CustomChip";
import theme from "../../themes";
import {
  useGetBalanceQuery,
  useRequestPayoutMutation,
} from "../../services/api";
import { useForm, Controller } from "react-hook-form";
import CustomInput from "../CustomInput";
import { toast } from "react-toastify";

interface Props {
  setIsViewingPayout: (value: boolean) => void;
  isViewOnly: boolean;
  payout?: Payout;
}

export default function PayoutDetail(props: Props) {
  const { setIsViewingPayout, isViewOnly, payout } = props;
  const styles = useStyles();
  const [paymentMethod, setPaymentMethod] = useState("Banking");
  const { control, handleSubmit, reset, register } = useForm({
    defaultValues: {
      amount: payout?.amount || "",
      note: payout?.note || "",
    },
  });

  const [requestPayout, { isSuccess, isError, error }] =
    useRequestPayoutMutation();

  const { data, refetch } = useGetBalanceQuery();

  useEffect(() => {
    refetch();
  }, []);

  useEffect(() => {
    reset({
      amount: payout?.amount || "",
      note: payout?.note || "",
    });
  }, [isViewOnly, payout, reset]);

  useEffect(() => {
    if (isSuccess) {
      setIsViewingPayout(false);
      toast.success("Payout requested successfully");
    }
    if (isError) {
      const Error = error as ApiError;
      toast.error(Error?.data?.message);
    }
  }, [isSuccess, isError]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Paid":
        return "#0C8FFC";
      case "Pending":
        return "#128912";
      case "Cancelled":
        return "#E00000";
      default:
        return "#0C8FFC";
    }
  };

  const getStatusBgColor = (status: string) => {
    switch (status) {
      case "Paid":
        return "#0C8FFC40";
      case "Pending":
        return "#12891240";
      case "Cancelled":
        return "#E0000040";
      default:
        return "#0C8FFC40";
    }
  };

  const handleChange = (event: SelectChangeEvent) => {
    setPaymentMethod(event.target.value as string);
  };

  const onSubmit = async (data: { amount: string | number; note: string }) => {
    await requestPayout({ amount: data.amount, currency: "USD" });
  };

  const getTotalAmount = (response?: BalanceResponse): number => {
    if (response) {
      return response.balance.reduce((total, entry) => total + entry.amount, 0);
    }
    return 0;
  };

  const totalAmount = getTotalAmount(data);

  return (
    <Box sx={styles.container}>
      <Box sx={styles.subContainer}>
        <Button
          onClick={() => setIsViewingPayout(false)}
          sx={{ textTransform: "initial" }}
        >
          <BackIcon style={{ marginRight: 10 }} color="rgba(12, 143, 252, 1)" />
          <Typography color="rgba(12, 143, 252, 1)">Back</Typography>
        </Button>
      </Box>

      <Box sx={styles.cardContainer}>
        <CustomCard
          heading="Current Balance"
          subheading={`$${totalAmount}`}
          icon={EarnIcon}
          align="left"
          isborder
        />
      </Box>

      <Box sx={styles.inputContainer}>
        {isViewOnly ? (
          <>
            <Typography fontWeight="bold">Requested Amount</Typography>
            <Typography variant="body1">{payout?.amount || "N/A"}</Typography>
            <Typography fontWeight="bold" mt={2}>
              Note to Admin
            </Typography>
            <Typography variant="body1">{payout?.note || "N/A"}</Typography>
          </>
        ) : (
          <>
            <CustomInput
              title="Requested Amount"
              name="amount"
              type="number"
              customWidth="100%"
              customSize={true}
              isPlain={true}
              readOnly={isViewOnly}
              register={register}
            />

            <Controller
              name="note"
              control={control}
              render={({ field }) => (
                <CustomInput
                  title="Note to Admin"
                  {...field}
                  customWidth="100%"
                  customSize={true}
                  isPlain={true}
                  readOnly={isViewOnly}
                />
              )}
            />
          </>
        )}
      </Box>

      {isViewOnly && (
        <Box>
          <Typography fontSize={14} mt={2} color={"#77767A"}>
            Status
          </Typography>
          <CustomChip
            name={payout?.status || "Pending"}
            color={getStatusColor(payout?.status || "Pending")}
            backgroundColor={getStatusBgColor(payout?.status || "Pending")}
            width="50px"
          />
        </Box>
      )}

      <Box sx={{ width: "200px" }}>
        <Typography fontSize={14} mt={2} color={"#77767A"}>
          Payment Method
        </Typography>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={paymentMethod}
          onChange={handleChange}
          sx={styles.select}
          disabled={isViewOnly}
        >
          <MenuItem value={"Banking"}>Banking</MenuItem>
          {/* <MenuItem value={"Stripe"}>Stripe</MenuItem> */}
        </Select>
      </Box>

      {!isViewOnly && (
        <Button
          variant="contained"
          sx={styles.Button}
          onClick={handleSubmit(onSubmit)}
        >
          Submit
        </Button>
      )}
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
    subContainer: {
      width: "89%",
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    cardContainer: {
      marginTop: "20px",
      width: "80%",
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      flexWrap: "wrap",
      gap: "20px",

      [theme.breakpoints.down(900)]: {
        width: "90%",
      },
      [theme.breakpoints.down(600)]: {
        width: "100%",
      },
    },
    inputContainer: {
      marginTop: "20px",
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
      width: "40%",
      [theme.breakpoints.down(900)]: {
        width: "60%",
      },
      [theme.breakpoints.down(700)]: {
        width: "100%",
      },
    },
    Button: {
      marginTop: "20px",
      width: "175px",

      [theme.breakpoints.down(700)]: {
        width: "100%",
      },
    },
    select: {
      height: 50,
      width: "29vw",
      borderRadius: 2,
      [theme.breakpoints.down(900)]: {
        width: "55vw",
      },
      [theme.breakpoints.down(700)]: {
        width: "92vw",
      },
    },
  });
