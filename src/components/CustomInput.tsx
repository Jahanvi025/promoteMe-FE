import {
  Box,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import { UseFormRegister } from "react-hook-form";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { useState } from "react";
import { createStyles } from "@mui/styles";

interface Props {
  title?: string;
  error?: string;
  name: string;
  type?: string;
  isEye?: boolean;
  isPlain?: boolean;
  isAuth?: boolean;
  register?: UseFormRegister<any>;
  customWidth?: string;
  customSize?: boolean;
  customLabel?: boolean;
  editProfile?: boolean;
  readOnly?: boolean;
  fontWeight?: number | string;
  fontSize?: number | string;
  placeholder?: string;
}

export default function CustomInput(props: Props) {
  const {
    title,
    error,
    name,
    type,
    isEye,
    isPlain,
    register,
    customWidth,
    customSize,
    customLabel,
    editProfile,
    readOnly,
    fontWeight = 400,
    fontSize = 14,
    placeholder,
    isAuth,
  } = props;
  const styles = useStyles(fontWeight, fontSize, isAuth);
  const [showPassword, setShowPassword] = useState(false);

  const resolvePlaceholder = () => {
    switch (title) {
      case "Email":
        return "Enter Email Address";
      case "Name":
        return "Your Name";
      case "Username":
        return "Username";
      case "Phone Number":
        return "Contact Number";
      case "Confirm Password":
        return "Re-enter password";
      case "New Password":
        return "Enter password";
      case "Product":
        return "Product name";
      case "Price":
        return "Price";
      case "Description":
        return "Description of product";
      case "Stock":
        return "No.of products";
      default:
        return "Enter " + title;
    }
  };

  return (
    <Box mt={1} sx={{ minWidth: customWidth ?? "60%" }}>
      <Typography variant={customLabel ? "body2" : "body1"} sx={styles.heading}>
        {title}
      </Typography>
      <TextField
        size={customSize || editProfile ? "small" : "medium"}
        placeholder={placeholder ? placeholder : resolvePlaceholder()}
        type={!type ? "text" : showPassword ? "text" : type}
        fullWidth
        sx={{
          backgroundColor: isPlain ? "white" : "rgba(247, 248, 255, 1)",
          '& input[type="number"]::-webkit-outer-spin-button, & input[type="number"]::-webkit-inner-spin-button':
            {
              "-webkit-appearance": "none",
              margin: 0,
            },
          '& input[type="number"]': {
            "-moz-appearance": "textfield",
          },
        }}
        {...(register && { ...register(name) })}
        inputProps={{
          style: customLabel
            ? { fontSize: "0.875rem" }
            : editProfile
            ? { fontSize: 14, paddingRight: 11.5 }
            : {},
          readOnly: readOnly,
        }}
        InputProps={
          isEye
            ? {
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={() => setShowPassword(!showPassword)}
                      sx={{ padding: 0 }}
                    >
                      {showPassword ? (
                        <VisibilityIcon sx={{ height: "20px" }} />
                      ) : (
                        <VisibilityOffIcon sx={{ height: "20px" }} />
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
              }
            : {}
        }
      />
      <Typography sx={{ color: "red", minHeight: 6, fontSize: "12px" }}>
        {error}
      </Typography>
    </Box>
  );
}

const useStyles = (
  fontWeight: number | string,
  fontSize: number | string,
  isAuth: boolean | undefined
) =>
  createStyles({
    heading: {
      fontFamily: "Inter",
      fontSize: fontSize || "14px",
      fontWeight: fontWeight || 400,
      lineHeight: "16.94px",
      textAlign: "left",
      color: isAuth ? "black" : "#77767A",
      marginBottom: 1,
    },
  });
