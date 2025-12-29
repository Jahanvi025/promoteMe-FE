import { Box } from "@mui/material";
import theme from "../themes";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
  height?: string;
}

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, height, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box
          sx={{
            pt: 3,
            pb: 3,
            maxHeight: "60vh",
            overflowY: "scroll",
            scrollbarWidth: "none",
            [theme.breakpoints.down(600)]: {
              maxHeight: height ? "75vh" : "70vh",
            },
          }}
        >
          {children}
        </Box>
      )}
    </div>
  );
}

export default CustomTabPanel;
