import React from "react";
import {
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { Button, Grid, TextField, Typography } from "@mui/material";

interface StripePaymentFormProps {
  sessionId: string;
  depositAmount: number;
  onSuccess: () => void;
  onError: (error: any) => void;
}

const StripePaymentForm: React.FC<StripePaymentFormProps> = ({
  sessionId,
  depositAmount,
  onSuccess,
  onError,
}) => {
  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!stripe || !elements) {
      return;
    }

    const cardNumberElement = elements.getElement(CardNumberElement);

    if (cardNumberElement) {
      const { error, paymentIntent } = await stripe.confirmCardPayment(
        sessionId,
        {
          payment_method: {
            card: cardNumberElement,
          },
        }
      );

      if (error) {
        onError(error);
      } else if (paymentIntent?.status === "succeeded") {
        onSuccess();
      }
    }
  };

  return (
    <Grid
      container
      spacing={3}
      component="form"
      onSubmit={handleSubmit}
      sx={{ padding: 4, borderRadius: 2, boxShadow: 3 }}
    >
      <Grid item xs={12} sm={6}>
        <Typography variant="h6" gutterBottom>
          Card Information
        </Typography>
        <TextField
          fullWidth
          label="Card Number"
          InputProps={{ inputComponent: CardNumberElement as any }}
          variant="outlined"
          margin="normal"
        />
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Expiry Date"
              InputProps={{ inputComponent: CardExpiryElement as any }}
              variant="outlined"
              margin="normal"
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="CVC"
              InputProps={{ inputComponent: CardCvcElement as any }}
              variant="outlined"
              margin="normal"
            />
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={12} sm={6}>
        <Typography variant="h6" gutterBottom>
          Summary
        </Typography>
        <Typography variant="body1" gutterBottom>
          Amount to be Deposited: ${depositAmount} USD
        </Typography>
        <Typography variant="body2" gutterBottom>
          Product Details...
        </Typography>{" "}
        {/* Add product details as needed */}
        <Button
          fullWidth
          type="submit"
          variant="contained"
          color="primary"
          sx={{ mt: 4 }}
        >
          Pay ${depositAmount} USD
        </Button>
      </Grid>
    </Grid>
  );
};

export default StripePaymentForm;
