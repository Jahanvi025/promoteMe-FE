import { Avatar } from "@mui/material";
import { createStyles } from "@mui/styles";

const UserAvatar = ({ type, image }: AvatarProps) => {
  const styles = useStyles();
  const class_sidebar = type == "sidebar" ? styles.avatarSidebar : {};
  return <Avatar alt="profile picture" src={image} sx={class_sidebar} />;
};

export default UserAvatar;

const useStyles = () =>
  createStyles({
    avatarSidebar: {
      width: "82px",
      height: "82px",
      top: "132.41px",
    },
  });
