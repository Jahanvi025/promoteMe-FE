import { Box, Button, IconButton, Typography } from "@mui/material";
import { ReactComponent as CancelIcon } from "../assets/svg/cancel.svg";
import SocialShareLink from "../components/SocialShareLink";
import { ReactComponent as FacebookSocialIcon } from "../assets/svg/socialfacebook.svg";
import { ReactComponent as TwitterSocialIcon } from "../assets/svg/socialTwitter.svg";
import { ReactComponent as LinkedinSocialIcon } from "../assets/svg/socialLinkedin.svg";
import { ReactComponent as WhatsappSocialIcon } from "../assets/svg/socialWhatsapp.svg";
import {
  FacebookShareButton,
  TwitterShareButton,
  LinkedinShareButton,
  WhatsappShareButton,
} from "react-share";
import { ReactComponent as LinkIcon } from "../assets/svg/link.svg";
import { toast } from "react-toastify";
import { createStyles } from "@mui/styles";
import theme from "../themes";

interface Props {
  setShareModal: (value: boolean) => void;
  postId?: string;
  refetch?: (value: Post) => void;
  isProfile?: boolean;
  userId?: string;
}

export default function ShareModal(props: Props) {
  const { setShareModal, postId, isProfile, userId } = props;
  const styles = useStyles();

  const url = isProfile
    ? `https://marketplace.valuegivr.com/profile/${userId}`
    : `https://marketplace.valuegivr.com/feed/${postId}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(url);
    toast("Link copied!!", { type: "info" });
  };

  return (
    <>
      <Box sx={styles.container}>
        <Typography fontSize={25}>Share</Typography>
        <IconButton onClick={() => setShareModal(false)} size="large">
          <CancelIcon color="black" />
        </IconButton>
      </Box>
      <Box mt={3}>
        <Typography>Share this link via</Typography>
        <Box
          my={2}
          sx={{ display: "flex", gap: "20px", justifyContent: "center" }}
        >
          <FacebookShareButton url={url}>
            <SocialShareLink
              Icon={FacebookSocialIcon}
              borderColor="rgba(8, 102, 255, 1)"
            />
          </FacebookShareButton>
          <TwitterShareButton url={url}>
            <SocialShareLink
              Icon={TwitterSocialIcon}
              borderColor="rgba(0, 0, 0, 1)"
            />
          </TwitterShareButton>
          <LinkedinShareButton url={url}>
            <SocialShareLink
              Icon={LinkedinSocialIcon}
              borderColor="rgba(10, 102, 194, 1)"
            />
          </LinkedinShareButton>
          <WhatsappShareButton url={url}>
            <SocialShareLink
              Icon={WhatsappSocialIcon}
              borderColor="rgba(37, 211, 102, 1)"
            />
          </WhatsappShareButton>
        </Box>
      </Box>
      <Box mt={1}>
        <Typography>Or copy link</Typography>
        <Box mt={2} sx={styles.bottomContainer}>
          <Box sx={{ display: "flex", flexDirection: "row" }}>
            <LinkIcon style={{ marginLeft: 10 }} />
            <Typography mx={2} sx={styles.link}>
              {url}
            </Typography>
          </Box>
          <Button onClick={handleCopyLink} variant="contained" color="primary">
            Copy
          </Button>
        </Box>
      </Box>
    </>
  );
}

const useStyles = () =>
  createStyles({
    bottomContainer: {
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      border: "1px solid rgba(211, 216, 223, 1)",
      padding: 1,
      borderRadius: 2,
      justifyContent: "space-between",
    },
    container: {
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-between",
    },
    link: {
      maxWidth: "200px",
      overflow: "hidden",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap",
      color: "rgba(0, 0, 0, 0.6)",
      [theme.breakpoints.down(600)]: {
        maxWidth: "145px",
      },
    },
  });
