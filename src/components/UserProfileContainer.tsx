import React, { useState } from "react";
import { Avatar, Box, Button, IconButton, Typography } from "@mui/material";
import { ReactComponent as ShareIcon } from "../assets/svg/shareProfile.svg";
import { ReactComponent as WalletIcon } from "../assets/svg/wallet.svg";
import { ReactComponent as StarsIcon } from "../assets/svg/stars.svg";
import { ReactComponent as FacebookIcon } from "../assets/svg/profileFacebookLogo.svg";
import { ReactComponent as LinkedinIcon } from "../assets/svg/profileLinkedinLogo.svg";
import { ReactComponent as InstagramIcon } from "../assets/svg/profileInstagramIcon.svg";
import ProfileFooterCard from "../components/ProfileFooterCard";
import { createStyles } from "@mui/styles";
import { formatDate, resolveContentLink } from "../utils/helper";
import CustomModal from "../components/CustomModal";
import SubscribeModal from "../components/SubscribeModal";
import theme from "../themes";
import ShareModal from "./ShareModal";
import { useGetBalanceQuery } from "../services/api";

interface UserProfileContainerProps {
  user: GetUserResponse["data"]["user"] | null;
  role: string;
  width: string;
}

const UserProfileContainer: React.FC<UserProfileContainerProps> = ({
  user,
  role,
  width,
}) => {
  const [isImageModal, setIsImageModal] = useState(false);
  const [isSubscribeModal, setIsSubscribeModal] = useState(false);
  const [isShareModal, setIsShareModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState({ type: "", price: 0 });

  const styles = useStyles(
    resolveContentLink(user?.profile_picture || ""),
    role || "",
    user?.cover_image
  );

  const { data } = useGetBalanceQuery();

  const handleSubscribe = (type: string, price: number) => {
    setSelectedPlan({ type, price: Number(price) });
    setIsSubscribeModal(true);
  };

  const handleIconClick = (url: string) => {
    window.open(url, "_blank");
  };

  return (
    <Box sx={styles.profileCardContainer} mb={2}>
      <Box sx={{ width: width }}>
        <Box px={2} sx={styles.cover}>
          <IconButton
            size="medium"
            sx={styles.shareProfile}
            onClick={() => setIsShareModal(true)}
          >
            <ShareIcon />
          </IconButton>
          <Avatar
            onClick={() => setIsImageModal(true)}
            sx={styles.profilePicture}
            src={user?.profile_picture}
          />
        </Box>
        <CustomModal open={isImageModal} setOpen={setIsImageModal} width="30%">
          <Box sx={styles.image}></Box>
        </CustomModal>
        <Box sx={styles.infoContainer}>
          <Box sx={styles.mainText}>
            <Typography variant="h5">{user?.displayName}</Typography>
            <Typography color="rgba(119, 118, 122, 1)">
              {user?.username}
            </Typography>
          </Box>
          <Box sx={styles.userInfoContainer} px={1} mt={3}>
            {role === "CREATOR" && (
              <Box sx={styles.userInfo}>
                <WalletIcon height={20} width={20} style={{ marginRight: 7 }} />
                <Typography mr={0.5} variant="body2" fontWeight={300}>
                  Balance
                </Typography>
                <Typography fontWeight="500" variant="body2" mr={2}>
                  ${data?.balance[0]?.amount || 0}
                </Typography>
              </Box>
            )}
            {role === "FAN" && (
              <Box sx={styles.userInfo}>
                <WalletIcon height={20} width={20} style={{ marginRight: 7 }} />
                <Typography mr={0.5} variant="body2" fontWeight={300}>
                  Posts :
                </Typography>
                <Typography fontWeight="500" variant="body2" mr={2}>
                  {user?.postCount}
                </Typography>
              </Box>
            )}
            <Box sx={{ minWidth: "100px", ...styles.userInfo }}>
              <StarsIcon height={20} width={20} style={{ marginRight: 5 }} />
              <Typography mr={0.5} variant="body2" fontWeight={300}>
                Fans
              </Typography>
              <Typography fontWeight="500" variant="body2">
                {user?.total_subscribers || 0}
              </Typography>
            </Box>
          </Box>
          <Typography
            mt={3}
            px={1}
            color={"#77767A"}
            fontSize={"13px"}
            width={"85%"}
          >
            {user?.bio}
          </Typography>
          <Box
            sx={{ display: "flex", flexDirection: "row", gap: 1, width: "85%" }}
            mt={1}
            mb={2}
          >
            <Box sx={styles.subscriptionCard}>
              <Typography variant="h6">${user?.yearly_Price}</Typography>
              <Typography
                color="rgba(119, 118, 122, 1)"
                fontSize={12}
                fontWeight={500}
              >
                Yearly
              </Typography>
              {role === "FAN" && !user?.isSubscribed && (
                <Button
                  variant="contained"
                  onClick={() =>
                    handleSubscribe("Yearly", user?.yearly_Price || 0)
                  }
                  sx={styles.button}
                >
                  Subscribe
                </Button>
              )}
            </Box>
            <Box sx={styles.subscriptionCard}>
              <Typography variant="h6">${user?.monthly_Price}</Typography>
              <Typography
                color="rgba(119, 118, 122, 1)"
                fontSize={12}
                fontWeight={500}
              >
                Monthly
              </Typography>
              {role === "FAN" && !user?.isSubscribed && (
                <Button
                  variant="contained"
                  onClick={() =>
                    handleSubscribe("Monthly", user?.monthly_Price || 0)
                  }
                  sx={styles.button}
                >
                  Subscribe
                </Button>
              )}
            </Box>
          </Box>
          <Box width={"85%"}>
            <ProfileFooterCard
              title="Joined on"
              value={formatDate(user?.createdAt)}
              color="rgba(223, 235, 255, 1)"
            />
          </Box>
          <Box mt={1} sx={styles.footerContainer}>
            {user?.date_of_birth && (
              <ProfileFooterCard
                title="DOB"
                value={formatDate(user?.date_of_birth)}
                color="rgba(255, 223, 223, 1)"
              />
            )}
            {user?.gender && (
              <ProfileFooterCard
                title="Gender"
                value={user?.gender}
                color="rgba(252, 255, 223, 1)"
              />
            )}
          </Box>
          <Box mt={1.5} width={"85%"}>
            {user?.category_id && (
              <ProfileFooterCard
                title="Category"
                value={user?.category_id?.name}
                color="rgba(223, 255, 226, 1)"
              />
            )}
          </Box>
          <Box
            sx={{ display: "flex", flexDirection: "row", gap: 1, width: "85%" }}
            my={2}
          >
            {user?.facebook_url && (
              <FacebookIcon
                height={40}
                width={40}
                color="white"
                cursor={"pointer"}
                onClick={() => handleIconClick(user?.facebook_url || "")}
              />
            )}
            {user?.linkedin_url && (
              <LinkedinIcon
                height={40}
                width={40}
                color="white"
                cursor={"pointer"}
                onClick={() => handleIconClick(user?.linkedin_url || "")}
              />
            )}
            {user?.instagram_url && (
              <InstagramIcon
                height={40}
                width={40}
                color="white"
                cursor={"pointer"}
                onClick={() => handleIconClick(user?.instagram_url || "")}
              />
            )}
          </Box>
        </Box>
      </Box>
      <CustomModal
        open={isSubscribeModal}
        setOpen={setIsSubscribeModal}
        width="500px"
        padding={3}
        isShare
        paddingHorizontal={false}
      >
        <SubscribeModal
          name={user?.displayName}
          username={user?.username}
          profile_picture={user?.profile_picture}
          creatorId={user?._id}
          selectedPlan={selectedPlan}
          closeModal={setIsSubscribeModal}
        />
      </CustomModal>
      <CustomModal
        open={isShareModal}
        setOpen={setIsShareModal}
        width="auto"
        padding={3}
        isShare
      >
        <ShareModal
          setShareModal={setIsShareModal}
          userId={user?._id}
          isProfile
        />
      </CustomModal>
    </Box>
  );
};

const useStyles = (url: string, role: string, coverImage: string | undefined) =>
  createStyles({
    profileCardContainer: {
      width: "100%",
      display: "flex",
      justifyContent: "center",
      alignItems: "flex-start",
    },
    cover: {
      backgroundColor: "#cccccc",
      backgroundImage: coverImage
        ? `url(${coverImage})`
        : `url('https://cdn.pixabay.com/photo/2015/12/01/20/28/road-1072821_640.jpg')`,
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat",
      backgroundSize: "cover",
      height: 110,
      borderTopLeftRadius: 10,
      borderTopRightRadius: 10,
      position: "relative",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    },
    shareProfile: {
      border: "1px solid white",
      position: "absolute",
      right: 16,
      top: 10,
    },
    profilePicture: {
      position: "absolute",
      height: 90,
      width: 90,
      borderRadius: "50%",
      bottom: "-35%",
      border: "5px solid white",
    },
    mainText: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      marginTop: 7,
    },
    userInfo: {
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
    },
    subscriptionCard: {
      height: 120,
      width: "50%",
      backgroundColor:
        role === "CREATOR" ? "rgba(12, 143, 252, 0.08)" : "transparent",
      display: "flex",
      border:
        role === "CREATOR" ? "none" : "1px solid rgba(119, 118, 122, 0.5)",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      borderRadius: 2,
    },
    button: {
      width: "90%",
      height: 32,
      marginTop: 1,
      boxShadow: "unset",
      borderRadius: "8px",
    },
    userInfoContainer: {
      display: "flex",
      width: "85%",
      gap: "10px",
      [theme.breakpoints.down(1200)]: {
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      },
    },
    footerContainer: {
      display: "flex",
      flexDirection: "row",
      [theme.breakpoints.down(1200)]: {
        flexDirection: "column",
        gap: "5px",
      },
      gap: 1,
      width: "85%",
      justifyContent: "space-between",
    },
    image: {
      backgroundImage: `url(${url})`,
      backgroundSize: "cover",
      width: 300,
      height: 300,
      overflow: "hidden",
    },
    infoContainer: {
      border: "1px solid rgba(172, 184, 205, 1)",
      borderTop: "1px solid white",
      borderBottomLeftRadius: 9,
      borderBottomRightRadius: 9,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
    },
  });

export default UserProfileContainer;
