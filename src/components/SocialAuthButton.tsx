import { Button, Typography } from "@mui/material";
import { createStyles } from "@mui/styles";

interface Props {
  Icon: React.FC<React.SVGProps<SVGSVGElement>>;
  title: string;
  onClick?: () => void;
  disabled: boolean;
}

export default function SocialAuthButton(props: Props) {
  const { Icon, title, onClick, disabled } = props;
  const styles = useStyles();

  return (
    <Button onClick={onClick} sx={styles.button} fullWidth disabled={disabled}>
      <Icon height={25} width={25} style={{ marginRight: 20 }} />
      <Typography
        sx={{
          textTransform: "initial",
          color: "black",
          fontSize: "12px ",
          width: "125px",
        }}
      >
        Sign in with {title}
      </Typography>
    </Button>
  );
}

const useStyles = () =>
  createStyles({
    button: {
      border: "1px solid rgba(226, 226, 236, 1)",
      marginY: 0.5,
      borderRadius: 1,
      backgroundColor: "rgba(247, 248, 255, 1)",
    },
  });
