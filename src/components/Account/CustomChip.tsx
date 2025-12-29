import { Box, Typography } from "@mui/material";
import { createStyles } from "@mui/styles";

interface CustomChipProps {
  name: string;
  backgroundColor?: string;
  width?: string;
  align?: string;
  color?: string;
}

export const CustomChip = (props: CustomChipProps) => {
  const {
    name,
    backgroundColor = "white",
    width = "100px",
    color = "black",
  } = props;

  const styles = useStyles(backgroundColor, width, color);
  return (
    <Box sx={styles.container}>
      <Typography fontSize={14} sx={{ textTransform: "capitalize" }}>
        {name}
      </Typography>
    </Box>
  );
};

const useStyles = (backgroundColor: string, width: string, color: string) =>
  createStyles({
    container: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "10px",
      padding: "0px 20px",
      width: width,
      borderRadius: 2,
      backgroundColor: backgroundColor,
      color: color,
      fontSize: 12,
      fontWeight: 400,
    },
  });
