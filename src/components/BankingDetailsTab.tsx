import { Box, Button, Typography } from "@mui/material";
import CustomInput from "./CustomInput";
import { SubmitHandler, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { bankDetailsSchmea } from "../utils/validations";
import { createStyles } from "@mui/styles";
import { useEffect, useState } from "react";
import CustomModal from "./CustomModal";
import theme from "../themes";
import { useSaveBankDetailMutation } from "../services/api";
import { toast } from "react-toastify";
import Select from "react-select";
import countryList from "react-select-country-list";
import { countryCurrencyMap } from "../utils/countryCurrency";

interface CountryOption {
  label: string;
  value: string;
}

export default function BankingDetailsTab() {
  const styles = useStyles();
  const [changesSavedModal, setChangesSavedModal] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState<CountryOption | null>(
    null
  );
  const [currency, setCurrency] = useState("");
  const countries = countryList().getData();

  const [saveAccount, { isSuccess, isError, error }] =
    useSaveBankDetailMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<BankDetailsForm>({ resolver: yupResolver(bankDetailsSchmea) });
  const onSubmit: SubmitHandler<BankDetailsForm> = async (data) => {
    data.country = selectedCountry?.value || "";
    data.currency = currency;
    await saveAccount(data);
  };

  useEffect(() => {
    if (isSuccess) {
      setChangesSavedModal(true);
      toast.success("Account saved");
    }
    if (isError) {
      const Error = error as ApiError;
      toast.error(Error?.data?.message);
    }
  }, [isSuccess, isError]);

  const onCountryChange = (country: CountryOption | null) => {
    setSelectedCountry(country);
    setCurrency(country ? countryCurrencyMap[country.value] : "");
  };

  return (
    <Box sx={styles.container}>
      <Box sx={styles.tabHeader}>
        <Typography variant="h6">Bank Details</Typography>
      </Box>
      <form style={{ width: "100%" }} onSubmit={handleSubmit(onSubmit)}>
        <Box sx={styles.column}>
          <Box sx={styles.row}>
            <Box sx={styles.inputContainer}>
              <CustomInput
                register={register}
                name="firstName"
                title="First Name"
                error={errors.firstName?.message}
                isPlain
                customSize={true}
              />
            </Box>
            <Box sx={styles.inputContainer}>
              <CustomInput
                register={register}
                name="lastName"
                title="Last Name"
                error={errors.lastName?.message}
                isPlain
                customSize={true}
              />
            </Box>
          </Box>
          <Box sx={styles.row}>
            <Box sx={styles.inputContainer}>
              <CustomInput
                register={register}
                name="bankName"
                title="Bank Name"
                error={errors.bankName?.message}
                isPlain
                customSize={true}
              />
            </Box>
            <Box sx={styles.inputContainer}>
              <CustomInput
                register={register}
                name="accountNumber"
                title="Bank Account No."
                error={errors.accountNumber?.message}
                isPlain
                customSize={true}
                type="number"
              />
            </Box>
          </Box>
          <Box sx={styles.row}>
            <Box sx={styles.inputContainer}>
              <Typography variant="subtitle1" fontSize={14} color={"#77767A"}>
                Country
              </Typography>
              <Select
                options={countries}
                value={selectedCountry}
                onChange={(country) => onCountryChange(country)}
                getOptionLabel={(option) => option?.label || ""}
                getOptionValue={(option) => option?.value || ""}
                name="country"
                styles={{
                  control: (provided) => ({
                    ...provided,
                    height: "40px",
                    fontFamily: "Inter",
                  }),
                  menu: (provided) => ({
                    ...provided,
                    fontFamily: "Inter",
                  }),
                }}
              />
              {errors.country && (
                <Typography color="error">{errors.country.message}</Typography>
              )}
            </Box>
            <Box sx={styles.inputContainer}>
              <CustomInput
                register={register}
                name="state"
                title="State"
                error={errors.state?.message}
                isPlain
                customSize={true}
              />
            </Box>
          </Box>
          <Box sx={styles.row}>
            <Box sx={styles.inputContainer}>
              <CustomInput
                register={register}
                name="city"
                title="City"
                error={errors.city?.message}
                isPlain
                customSize={true}
              />
            </Box>
            <Box sx={styles.inputContainer}>
              <CustomInput
                register={register}
                name="address"
                title="Address"
                error={errors.address?.message}
                isPlain
                customSize={true}
              />
            </Box>
          </Box>
          <Box sx={styles.row}>
            <Box sx={styles.inputContainer}>
              <CustomInput
                register={register}
                name="bankRouting"
                title="Bank Routing"
                error={errors.bankRouting?.message}
                isPlain
                customSize={true}
              />
            </Box>
            <Box sx={styles.inputContainer}>
              <CustomInput
                register={register}
                name="bankSwiftCode"
                title="Bank Swift Code"
                error={errors.bankSwiftCode?.message}
                isPlain
                customSize={true}
              />
            </Box>
          </Box>
          <Button type="submit" variant="contained" sx={styles.saveButton}>
            Save Changes
          </Button>
        </Box>
      </form>
      <CustomModal
        open={changesSavedModal}
        setOpen={setChangesSavedModal}
        width="25%"
        padding={5}
      >
        <Box sx={styles.modal}>
          <Typography variant="h5">Changes saved</Typography>
          <Typography textAlign="center" color="rgba(0, 0, 0, 0.7)" mt={2}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna.
          </Typography>
          <Button
            onClick={() => setChangesSavedModal(false)}
            variant="contained"
            sx={{ height: 40, paddingX: 8, borderRadius: 5, marginTop: 4 }}
          >
            Ok, Thanks!
          </Button>
        </Box>
      </CustomModal>
    </Box>
  );
}

const useStyles = () =>
  createStyles({
    row: {
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      gap: 5,
      width: "-webkit-fill-available",
      [theme.breakpoints.down(600)]: {
        flexDirection: "column",
        gap: 0,
        padding: 0,
      },
    },
    column: {
      width: "-webkit-fill-available",
      backgroundColor: "rgba(247, 247, 247, 1)",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      paddingY: 4,
      paddingX: 5,
      borderRadius: 5,
    },
    container: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      width: "100%",
      marginTop: 0,
    },
    tabHeader: {
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      width: "100%",
      marginBottom: 3,
    },
    saveButton: {
      height: 40,
      borderRadius: 2,
      textTransform: "initial",
      paddingX: 5,
      mt: 2,
    },
    modal: {
      display: "flex",
      alignItems: "center",
      flexDirection: "column",
    },
    inputContainer: {
      width: "50%",
      [theme.breakpoints.down(600)]: {
        width: "100%",
      },
    },
  });
