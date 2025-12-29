import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  Typography,
} from "@mui/material";
import { createStyles } from "@mui/styles";
import { SubmitHandler, useForm } from "react-hook-form";
import CustomInput from "../CustomInput";
import { yupResolver } from "@hookform/resolvers/yup";
import { addCardSchema } from "../../utils/validations";
import PaymentCard from "../PaymentCard";
import theme from "../../themes";
import { useAddCardMutation, useGetCardsQuery } from "../../services/api";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";

const AddCard = () => {
  const styles = useStyles();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<AddCardFormInput>({
    resolver: yupResolver(addCardSchema),
  });

  const { data: cards, refetch } = useGetCardsQuery();

  const [addCard, { isSuccess, isError, error }] = useAddCardMutation();
  const [isDefault, setDefault] = useState(false);
  const onSubmit: SubmitHandler<AddCardFormInput> = async (data) => {
    await addCard({ ...data, isDefault: isDefault });
  };

  useEffect(() => {
    if (isSuccess) {
      toast.success("Card added successfully");
      reset();
      refetch();
    }
    if (isError) {
      const validationError = error as ValidationError;
      const errorMessage = validationError.data.data?.errors?.[0]?.msg;
      if (errorMessage) {
        toast(errorMessage, { type: "error" });
      }
      const apiError = error as ApiError;
      if (apiError?.data?.message && !errorMessage) {
        toast(apiError?.data?.message, { type: "error" });
      }
    }
  }, [isSuccess, isError]);

  return (
    <Box sx={styles.container}>
      <Box sx={styles.leftContainer}>
        <Typography fontSize={18} fontWeight={500} mb={2}>
          Your Existing Cards
        </Typography>
        {cards?.data?.cards?.length ? (
            cards.data.cards.map((card) => (
                <PaymentCard
                    key={card._id}
                    name={card.name}
                    type={card.type}
                    expiry={card.expiryDate}
                    cardNumber={card.number}
                    id={card._id}
                    refetch={refetch}
                />
            ))
        ) : (
            <PaymentCard
                name="John Doe"
                type="Visa"
                expiry="12/34"
                cardNumber="**** **** **** 1234"
                id="dummy"
                refetch={refetch}
            />
        )}
      </Box>
      <Box sx={styles.rightContainer}>
        <Typography fontSize={18} fontWeight={500} mb={2}>
          Add new card
        </Typography>
        <form onSubmit={handleSubmit(onSubmit)}>
          <CustomInput
            name="name"
            register={register}
            title="Card Holder Name"
            error={errors.name?.message}
            customSize
            customWidth="100%"
            isPlain
            isAuth
            placeholder="Full Name"
          />
          <CustomInput
            name="number"
            register={register}
            title="Card Number"
            customSize
            customWidth="100%"
            error={errors.number?.message}
            isPlain
            isAuth
            placeholder="Enter your card number"
            type="number"
          />
          <CustomInput
            name="expiryDate"
            register={register}
            title="Expiry Date"
            customSize
            customWidth="100%"
            error={errors.expiryDate?.message}
            isPlain
            isAuth
            placeholder="MM/YY"
          />
          <CustomInput
            name="CVV"
            register={register}
            title="CVV"
            customSize
            customWidth="100%"
            error={errors.CVV?.message}
            isPlain
            isAuth
            placeholder="Enter 3 digits CVV"
          />
          <FormControlLabel
            control={<Checkbox />}
            label="Set as default payment card"
            onClick={() => setDefault(!isDefault)}
          />
          <Button
            fullWidth
            variant="contained"
            sx={styles.button}
            type="submit"
          >
            Add
          </Button>
        </form>
      </Box>
    </Box>
  );
};

export default AddCard;

const useStyles = () =>
  createStyles({
    container: {
      width: "75%",
      backgroundColor: "white",
      borderRadius: 4,
      display: "flex",
      justifyContent: "space-between",
      [theme.breakpoints.down(1200)]: {
        width: "90%",
      },
      [theme.breakpoints.down(900)]: {
        width: "90%",
      },
      [theme.breakpoints.down(600)]: {
        width: "100%",
        flexDirection: "column",
      },
    },
    rightContainer: {
      width: "40%",
      [theme.breakpoints.down(600)]: {
        width: "100%",
      },
    },
    leftContainer: {
      width: "40%",
      [theme.breakpoints.down(600)]: {
        width: "100%",
      },
    },
    button: { marginTop: "20px", boxShadow: "unset", borderRadius: "10px" },
  });
