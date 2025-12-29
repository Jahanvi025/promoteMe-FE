import { Box, Typography } from "@mui/material";
import { createStyles } from "@mui/styles";
import React from "react";
import theme from "../../themes";

interface CustomCardProps {
  heading: string;
  subheading: string;
  icon?: React.FC<React.SVGProps<SVGSVGElement>>;
  backgroundColor?: string;
  width?: string;
  align?: string;
  isborder?: boolean;
}

export const CustomCard = (props: CustomCardProps) => {
  const { heading, subheading, icon, backgroundColor, align, width, isborder } =
    props;
  const styles = useStyles(isborder, width, align, icon);
  return (
    <Box sx={{ ...styles.earningTabs, backgroundColor: backgroundColor }}>
      {icon && <Box sx={styles.Icon}>{React.createElement(icon)}</Box>}
      <Box sx={styles.cardContent}>
        <Typography fontSize={14} color={"#00000080"}>
          {heading}
        </Typography>
        <Typography variant="h6" fontSize={20}>
          {subheading}
        </Typography>
      </Box>
    </Box>
  );
};

const useStyles = (
  isborder: boolean | undefined,
  width: string | undefined,
  align: string | undefined,
  icon?: React.FC<React.SVGProps<SVGSVGElement>>
) =>
  createStyles({
    earningTabs: {
      minWidth: "150px",
      width: width ? width : "auto",
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: align ? `${align}` : "center",
      padding: "10px 30px",
      borderRadius: 4,
      gap: "20px",
      border: isborder ? "1px solid #E1E1E1" : "none",

      [theme.breakpoints.down(1250)]: {
        minWidth: "unset",
      },
      [theme.breakpoints.down(600)]: {
        padding: icon ? "10px" : "10px 15px",
        gap: icon ? "5px" : "20px",
        minWidth: "130px",
      },
    },
    cardContent: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
    },
    Icon: {
      height: "45px",
      width: "45px",
      backgroundColor: "#0C8FFC",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      borderRadius: "16px",
      boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
      color: "white",
      gap: "10px",
    },
  });
