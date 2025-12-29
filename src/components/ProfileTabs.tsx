import { Box, Tab, Tabs } from "@mui/material";
import { useState } from "react";
import { ReactComponent as ImageIcon } from "../assets/svg/addImage.svg";
import { ReactComponent as VideoIcon } from "../assets/svg/addVideo.svg";
import { ReactComponent as AudioIcon } from "../assets/svg/addAudio.svg";
import { ReactComponent as TextIcon } from "../assets/svg/text.svg";
import CustomTabPanel from "./CustomTabPanel";
import ProfileImageTab from "./ProfileImageTab";
import ProfileVideoTab from "./ProfileVideoTab";
import ProfileAudioTab from "./ProfileAudioTab";
import ProfileTextTab from "./ProfileTextTab";
import { a11yProps } from "../utils/helper";
import theme from "../themes";
import { createStyles } from "@mui/styles";

export default function ProfileTabs() {
  const [value, setValue] = useState(0);

  const styles = useStyles();

  const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Box
        sx={{
          borderBottom: 1,
          borderColor: "divider",
        }}
      >
        <Tabs
          sx={styles.Tabbar}
          value={value}
          onChange={handleChange}
          aria-label="basic tabs example"
        >
          <Tab
            sx={{
              minHeight: 40,
              height: 40,
            }}
            label="Image"
            icon={<ImageIcon />}
            iconPosition="start"
            {...a11yProps(0)}
          />
          <Tab
            sx={{
              minHeight: 40,
              height: 40,
            }}
            label="Video"
            icon={<VideoIcon />}
            iconPosition="start"
            {...a11yProps(1)}
          />
          <Tab
            sx={{
              minHeight: 40,
              height: 40,
            }}
            label="Audio"
            icon={<AudioIcon />}
            iconPosition="start"
            {...a11yProps(2)}
          />
          <Tab
            sx={{
              minHeight: 40,
              height: 40,
            }}
            label="Text"
            icon={<TextIcon />}
            iconPosition="start"
            {...a11yProps(3)}
          />
        </Tabs>
      </Box>
      <CustomTabPanel value={value} index={0}>
        <ProfileImageTab />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        <ProfileVideoTab />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={2}>
        <ProfileAudioTab />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={3}>
        <ProfileTextTab />
      </CustomTabPanel>
    </Box>
  );
}

const useStyles = () =>
  createStyles({
    Tabbar: {
      "& .MuiTab-root": {
        marginRight: "5%",
        textTransform: "initial",

        [theme.breakpoints.down(1000)]: {
          marginRight: "0%",
        },
      },
      "& .MuiTabs-scroller": {
        maxWidth: "100%",
        overflow: "scroll !important",
        scrollbarWidth: "none",
      },
    },
  });
