import { Box, Tab, Tabs } from "@mui/material";
import CustomTabPanel from "./CustomTabPanel";
import { a11yProps } from "../utils/helper";
import { useState } from "react";
import EditProfileTab from "./EditProfileTab";
import BlackListTab from "./BlacklistTab";
import BankingDetailsTab from "./BankingDetailsTab";
import MyFeedsTab from "./MyFeedsTab";
import MyProductsTab from "./MyProductsTab";
import OrderHistoryTab from "./OrderHistoryTab";
import EarningHistoryTab from "./EarningHistoryTab";
import PayoutRequestTab from "./PayoutRequestTab";
export default function AccountTabs() {
  const [value, setValue] = useState(0);

  const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Box
        sx={{
          borderBottom: 1,
          borderColor: "divider",
          "& .MuiTabs-scroller": {
            overflow: "scroll !important",
            scrollbarWidth: "none",
          },
          "& .MuiTabs-indicator": {
            height: "3px",
            borderRadius: "4px 4px 0 0",
          },
        }}
      >
        <Tabs
          sx={{
            "& .MuiTab-root": {
              marginRight: "3%",
              textTransform: "initial",
              "&.Mui-selected": {
                fontWeight: "bold",
                color: "black",
              },
            },
          }}
          value={value}
          onChange={handleChange}
          aria-label="basic tabs example"
        >
          <Tab
            label="Edit Profile"
            iconPosition="start"
            {...a11yProps(0)}
            sx={{ paddingX: 0, minWidth: "auto", fontWeight: "400" }}
          />
          <Tab
            label="Blacklist"
            iconPosition="start"
            {...a11yProps(1)}
            sx={{ paddingX: 0, minWidth: "auto", fontWeight: "400" }}
          />
          <Tab
            label="Banking"
            iconPosition="start"
            {...a11yProps(2)}
            sx={{ paddingX: 0, minWidth: "auto", fontWeight: "400" }}
          />
          <Tab
            label="My Feeds"
            iconPosition="start"
            {...a11yProps(3)}
            sx={{ paddingX: 0, minWidth: "auto", fontWeight: "400" }}
          />
          <Tab
            label="My Products"
            iconPosition="start"
            {...a11yProps(4)}
            sx={{ paddingX: 0, minWidth: "auto", fontWeight: "400" }}
          />
          <Tab
            label="Order History"
            iconPosition="start"
            {...a11yProps(5)}
            sx={{ paddingX: 0, minWidth: "auto", fontWeight: "400" }}
          />
          <Tab
            label="Earning History"
            iconPosition="start"
            {...a11yProps(6)}
            sx={{ paddingX: 0, minWidth: "auto", fontWeight: "400" }}
          />
          <Tab
            label="Payout Request"
            iconPosition="start"
            {...a11yProps(7)}
            sx={{ paddingX: 0, minWidth: "auto", fontWeight: "400" }}
          />
        </Tabs>
      </Box>
      <CustomTabPanel value={value} index={0} height="70vh">
        <EditProfileTab />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        <BlackListTab />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={2} height="75vh">
        <BankingDetailsTab />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={3}>
        <MyFeedsTab />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={4}>
        <MyProductsTab />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={5}>
        <OrderHistoryTab />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={6}>
        <EarningHistoryTab />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={7}>
        <PayoutRequestTab />
      </CustomTabPanel>
    </Box>
  );
}
