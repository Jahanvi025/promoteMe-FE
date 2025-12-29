import { Box, Typography } from "@mui/material";
import { createStyles } from "@mui/styles";

interface Props {
  title: string;
  value: string | undefined;
  color: string;
}

export default function ProfileFooterCard(props: Props) {
  const { title, value, color } = props;
  const styles = useStyles(color);
  return (
    <Box sx={styles.container} p={1}>
      <Typography fontWeight={500} fontSize={10}>
        {title}:&nbsp;
      </Typography>
      <Typography
        fontSize={11}
        overflow={"hidden"}
        maxWidth={120}
        textOverflow={"ellipsis"}
      >
        {value}
      </Typography>
    </Box>
  );
}

const useStyles = (color: string) =>
  createStyles({
    container: {
      backgroundColor: color,
      height: 15,
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      borderRadius: 2,
      justifyContent: "center",
      minWidth: "40%",
      maxWidth: "100%",
    },
  });
