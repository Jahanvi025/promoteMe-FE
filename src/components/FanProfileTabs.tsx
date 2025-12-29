import { Box, Tab, Tabs } from "@mui/material";
import CustomTabPanel from "./CustomTabPanel";
import { a11yProps } from "../utils/helper";
import { useState } from "react";
import EditProfile from "./FanProfileTabs/EditProfile";
import AddCard from "./FanProfileTabs/AddCard";
import SubscriptionTab from "./FanProfileTabs/SubscriptionTab";
import BookmarkTab from "./FanProfileTabs/BookmarkTab";
import OrderHistoryTab from "./OrderHistoryTab";
import PaymentHistoryTab from "./FanProfileTabs/PaymentHistoryTab";
import WalletTransaction from "./FanProfileTabs/WalletTransaction";

export default function FanProfileTabs() {
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
          aria-label="profile-tabs"
        >
          <Tab
            label="Edit Profile"
            iconPosition="start"
            {...a11yProps(0)}
            sx={{ paddingX: 0, minWidth: "auto", fontWeight: "400" }}
          />
          <Tab
            label="Add Card"
            iconPosition="start"
            {...a11yProps(1)}
            sx={{ paddingX: 0, minWidth: "auto", fontWeight: "400" }}
          />
          <Tab
            label="Bookmarks"
            iconPosition="start"
            {...a11yProps(2)}
            sx={{ paddingX: 0, minWidth: "auto", fontWeight: "400" }}
          />
          <Tab
            label="Subscriptions"
            iconPosition="start"
            {...a11yProps(3)}
            sx={{ paddingX: 0, minWidth: "auto", fontWeight: "400" }}
          />
          <Tab
            label="Order History"
            iconPosition="start"
            {...a11yProps(4)}
            sx={{ paddingX: 0, minWidth: "auto", fontWeight: "400" }}
          />
          <Tab
            label="Payment History"
            iconPosition="start"
            {...a11yProps(5)}
            sx={{ paddingX: 0, minWidth: "auto", fontWeight: "400" }}
          />
          <Tab
            label="Wallet Transaction"
            iconPosition="start"
            {...a11yProps(6)}
            sx={{
              paddingX: 0,
              minWidth: "auto",
              fontWeight: "400",
            }}
          />
        </Tabs>
      </Box>
      <CustomTabPanel value={value} index={0} height="70vh">
        <EditProfile />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        <AddCard />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={2} height="75vh">
        <BookmarkTab />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={3}>
        <SubscriptionTab />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={4}>
        <OrderHistoryTab />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={5}>
        <PaymentHistoryTab />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={6}>
        <WalletTransaction />
      </CustomTabPanel>
    </Box>
  );
}
