import React from "react";
import { Box, Skeleton } from "@mui/material";
import { createStyles } from "@mui/styles";
import theme from "../../themes";

interface Props {
  count: number;
}
export const PostSkeleton: React.FC = () => {
  const styles = useStyles();
  return (
    <Box sx={styles.container}>
      <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
        <Skeleton variant="circular" width={40} height={40} />
        <Box sx={{ ml: 2, flex: 1 }}>
          <Skeleton variant="text" width="60%" />
          <Skeleton variant="text" width="40%" />
        </Box>
      </Box>

      <Box sx={{ mb: 2 }}>
        <Skeleton variant="text" width="90%" height={30} sx={{ my: 1 }} />
        <Skeleton variant="rectangular" width="100%" height={150} />
      </Box>

      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        <Skeleton variant="rectangular" width={150} height={30} />
        <Skeleton variant="rectangular" width={100} height={30} />
      </Box>
    </Box>
  );
};

const PostSkeletonList = (props: Props) => {
  const { count } = props;
  return (
    <Box>
      {[...Array(count)].map((_, index) => (
        <PostSkeleton key={index} />
      ))}
    </Box>
  );
};

export default PostSkeletonList;

const useStyles = () =>
  createStyles({
    container: {
      width: "100%",
      maxWidth: "46vw",
      padding: 2,
      border: "1px solid #ddd",
      borderRadius: "8px",
      boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
      backgroundColor: "#fff",
      mb: 3,
      [theme.breakpoints.down(900)]: {
        maxWidth: "56vw",
      },
      [theme.breakpoints.down(600)]: {
        maxWidth: "85vw",
      },
    },
  });
