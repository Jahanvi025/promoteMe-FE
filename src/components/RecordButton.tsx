import { Button, Typography } from "@mui/material";
import { createStyles } from "@mui/styles";

interface Props {
  title: string;
  color: string;
  Icon: React.FC<React.SVGProps<SVGSVGElement>>;
  onClick: () => void;
  disabled?: boolean;
}

export default function RecordButton(props: Props) {
  const { title, color, Icon, onClick, disabled } = props;
  const styles = useStyles(color);

  return (
    <Button
      variant="contained"
      onClick={onClick}
      sx={styles.button}
      disabled={disabled}
    >
      <Icon style={{ marginRight: 5 }} color="white" height={15} width={15} />
      <Typography sx={{ fontWeight: 400 }}>{title}</Typography>
    </Button>
  );
}

const useStyles = (color: string) =>
  createStyles({
    button: {
      marginX: 1,
      minWidth: "12vw",
      backgroundColor: color,
      borderRadius: 5,
      textTransform: "initial",
      height: 40,
      paddingX: 2,
    },
  });
