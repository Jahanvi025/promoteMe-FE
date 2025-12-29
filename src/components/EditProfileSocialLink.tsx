import { Box, TextField } from "@mui/material";
import { createStyles } from "@mui/styles";
import { useState, useRef, useEffect } from "react";
import { UseFormRegister } from "react-hook-form";

interface Props {
  Icon: React.FC<React.SVGProps<SVGSVGElement>>;
  size?: number;
  register: UseFormRegister<any>;
  fieldName: string;
}

export default function EditProfileSocialLink(props: Props) {
  const { Icon, size, register, fieldName } = props;
  const styles = useStyles();
  const inputRef = useRef<HTMLInputElement | null>(null);

  const [isEditing, setIsEditing] = useState(false);

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  return (
    <Box sx={styles.container}>
      <div style={{ cursor: "pointer" }} onClick={handleEditToggle}>
        <Icon
          color="black"
          height={size ?? 25}
          width={size ?? 25}
          style={{ marginRight: 10 }}
        />
      </div>
      <TextField
        {...(register && { ...register(fieldName) })}
        onBlur={handleEditToggle}
        variant="standard"
        sx={styles.input}
        InputProps={{ disableUnderline: true }}
        inputRef={inputRef}
      />
    </Box>
  );
}

const useStyles = () =>
  createStyles({
    container: {
      border: "1px solid rgba(211, 216, 223, 1)",
      backgroundColor: "white",
      display: "flex",
      flexDirection: "row",
      height: 50,
      alignItems: "center",
      justifyContent: "center",
      borderRadius: 3,
      width: "-webkit-fill-available",
    },
    input: {
      fontSize: 14,
      width: "80%",
      minWidth: "60%",
      overflow: "hidden",

      "& .MuiInput-root": {
        fontSize: 14,
      },
    },
  });
