import { IconButton } from "@mui/material";
import { createStyles } from "@mui/styles";

interface Props {
  Icon: React.FC<React.SVGProps<SVGSVGElement>>;
  borderColor: string;
}

export default function SocialShareLink(props: Props) {
  const { Icon, borderColor } = props;
  const styles = useStyles(borderColor);

  return (
    <IconButton sx={styles.button}>
      <Icon />
    </IconButton>
  );
}

const useStyles = (borderColor: string) =>
  createStyles({
    button: {
      border: `1px solid ${borderColor}`,
      height: 50,
      width: 50,
    },
  });
