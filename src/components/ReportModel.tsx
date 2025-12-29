import {
  Box,
  Button,
  FormControlLabel,
  Radio,
  TextField,
  Typography,
} from "@mui/material";
import { createStyles } from "@mui/styles";
import { useEffect, useState } from "react";
import { useReportUserMutation } from "../services/api";
import { toast } from "react-toastify";

interface Props {
  closeModal: (value: boolean) => void;
  userId: string;
}

const ReportModel = (props: Props) => {
  const { closeModal } = props;
  const [selectedItem, setSelectedItem] = useState("");
  const [text, setText] = useState("");
  const styles = useStyles();

  const options = [
    "Sexual Content",
    "Voilent or Repulsive Content",
    "Abusive Content",
    "Harmful or Dangerous Content",
    "Spam or Misleading",
    "Child Abuse",
    "Other",
  ];

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedItem(event.target.value);
  };

  const handleInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    setText(event.target.value);
  };

  const [reportUser, { isSuccess, isError, error }] = useReportUserMutation();

  const handleSubmit = async () => {
    if (selectedItem === "" && text === "") {
      toast.error("Please select or enter a reason");
      return;
    }
    await reportUser({
      userId: props.userId,
      reason: selectedItem !== "Other" ? selectedItem : text,
    });
  };

  useEffect(() => {
    if (isSuccess) {
      toast.success("User Reported successfully!");
      closeModal(false);
    }
    if (isError) {
      const err = error as ApiError;
      toast.error(err.data.message);
    }
  }, [isSuccess, isError]);

  return (
    <Box sx={styles.container}>
      <Box sx={{ borderBottom: "1px solid gray", width: "100%" }}>
        <Typography fontSize={28} fontWeight={600} sx={styles.heading}>
          Report
        </Typography>
      </Box>
      <Box sx={styles.innerContainer}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
          }}
        >
          {options.map((option) => (
            <FormControlLabel
              key={option}
              control={
                <Radio
                  checked={selectedItem === option}
                  onChange={handleChange}
                  value={option}
                />
              }
              label={option}
            />
          ))}
        </Box>

        {selectedItem === "Other" && (
          <TextField sx={styles.textField} onChange={handleInput} />
        )}
      </Box>
      <Box sx={styles.buttonContainer}>
        <Button
          sx={{ color: "rgba(206, 19, 35, 1)", ...styles.button }}
          onClick={() => closeModal(false)}
        >
          Cancel
        </Button>
        <Button
          sx={{
            backgroundColor: "rgba(206, 19, 35, 1)",
            color: "white",
            ...styles.button,
            ": hover": {
              backgroundColor: "rgba(206, 19, 35, 0.8)",
              color: "white",
            },
          }}
          onClick={handleSubmit}
        >
          Report
        </Button>
      </Box>
    </Box>
  );
};

export default ReportModel;

const useStyles = () =>
  createStyles({
    container: {
      width: "100%",
    },
    heading: {
      fontSize: 25,
      fontWeight: 600,
      padding: "20px 30px",
    },
    innerContainer: {
      padding: "20px 30px",
    },
    textField: {
      width: "100%",
      marginTop: "10px",
      "& .MuiInputBase-input": {
        height: "10px",
        border: "1px solid black",
        borderRadius: "5px",
      },
    },
    buttonContainer: {
      borderTop: "1px solid gray",
      display: "flex",
      justifyContent: "space-between",
      padding: "20px",
    },
    button: {
      width: "40%",
      border: "1px solid rgba(206, 19, 35, 1)",
      boxShadow: "unset",
      borderRadius: "24px",
      marginLeft: "10px",
      padding: "10px",
    },
  });
