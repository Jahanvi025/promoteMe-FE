import { Box, Modal } from "@mui/material";
import { createStyles } from "@mui/styles";
import { PropsWithChildren } from "react";
import theme from "../themes";

interface Props extends PropsWithChildren {
  noPadding?: boolean;
  width: string;
  open: boolean;
  padding?: number;
  setOpen: (value: boolean) => void;
  paddingHorizontal?: boolean;
  isShare?: boolean;
}

export default function CustomModal(props: Props) {
  const {
    children,
    noPadding,
    width,
    open,
    setOpen,
    padding,
    paddingHorizontal,
    isShare,
  } = props;
  const styles = useStyles(
    noPadding,
    width,
    padding,
    paddingHorizontal,
    isShare
  );

  return (
    <Modal
      open={open}
      onClose={() => setOpen(!open)}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={styles.container}>{children}</Box>
    </Modal>
  );
}

const useStyles = (
  noPadding: boolean | undefined,
  width: string,
  padding: number | undefined,
  paddingHorizontal: boolean | undefined,
  isShare: boolean | undefined
) =>
  createStyles({
    container: {
      position: "absolute",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      width,
      bgcolor: "background.paper",
      boxShadow: "24px",
      borderRadius: 5,
      p: noPadding ? 0 : padding ?? 1,
      paddingLeft: paddingHorizontal ? "60px" : "",
      paddingRight: paddingHorizontal ? "60px" : "",
      [theme.breakpoints.down(600)]: {
        width: isShare ? "80%" : paddingHorizontal ? "65%" : "90%",
        left: noPadding ? "46%" : "50%",
      },
    },
  });
