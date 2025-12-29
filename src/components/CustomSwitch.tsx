import { Box, Switch, Typography, styled } from "@mui/material";
import { useEffect, useState } from "react";
import {
  useUpdatePostMutation,
  useUpdateProductMutation,
} from "../services/api";
import { toast } from "react-toastify";

interface Props {
  isActive: boolean;
  postId?: string;
  productId?: string;
  isPost?: boolean;
}

const IOSSwitch = styled(Switch)(() => ({
  width: 42,
  height: 26,
  padding: 0,
  "& .MuiSwitch-switchBase": {
    padding: 2,
    "&.Mui-checked": {
      transform: "translateX(16px)",
      color: "#fff",
      "& + .MuiSwitch-track": {
        backgroundColor: "rgba(12, 143, 252, 1)",
        opacity: 1,
      },
    },
  },
  "& .MuiSwitch-thumb": {
    width: 22,
    height: 22,
    borderRadius: "50%",
    backgroundColor: "#fff",
    boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.2)",
  },
  "& .MuiSwitch-track": {
    borderRadius: 26 / 2,
    backgroundColor: "#ccc",
    opacity: 1,
  },
}));

export default function CustomSwitch(props: Props) {
  const { isActive, postId, isPost, productId } = props;
  const [active, setActive] = useState(isActive);

  const [updatePostStatus, { isError, error }] = useUpdatePostMutation();

  const [
    updateProduct,
    { isError: isUpdateProductError, error: updateProductError },
  ] = useUpdateProductMutation();

  const handleClick = async () => {
    if (isPost) {
      await updatePostStatus({
        id: postId || "",
        body: active ? { status: "INACTIVE" } : { status: "ACTIVE" },
      });
    } else {
      await updateProduct({
        id: productId || "",
        body: active ? { status: "INACTIVE" } : { status: "ACTIVE" },
      });
    }

    setActive(!active);
  };

  useEffect(() => {
    if (isError) {
      const Error = error as ApiError;
      toast.error(Error?.data?.message);
    }
  }, [isError, error]);

  useEffect(() => {
    if (isUpdateProductError) {
      const Error = updateProductError as ApiError;
      toast.error(Error?.data?.message);
    }
  }, [isUpdateProductError, updateProductError]);

  return (
    <Box sx={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
      <IOSSwitch checked={active} onChange={handleClick} />
      <Typography
        color="rgba(12, 143, 252, 1)"
        sx={{ width: "80px", paddingLeft: "10px" }}
      >
        {active ? "Active" : "Inactive"}
      </Typography>
    </Box>
  );
}
