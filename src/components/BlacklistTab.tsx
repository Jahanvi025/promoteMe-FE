import { Box, Button, CircularProgress, Typography } from "@mui/material";
import BlockedUser from "./BlockedUser";
import CustomModal from "./CustomModal";
import { useEffect, useState } from "react";
import { createStyles } from "@mui/styles";
import theme from "../themes";
import { useGetBlockListQuery, useUnBlockUserMutation } from "../services/api";
import { toast } from "react-toastify";

export default function BlackListTab() {
  const [confirmationModal, setConfirmationModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState("");
  const [selectedUserId, setSelectedUserId] = useState("");
  const [blockedUsers, setBlockedUsers] = useState<
    BlockListData["data"]["blockedUsers"]
  >([]);
  const styles = useStyles();

  const { data, error, isError, isSuccess, refetch, isLoading, isFetching } =
    useGetBlockListQuery();

  const [
    unBlockUser,
    { isSuccess: isUnblocked, isError: isNotUnblocked, error: unblockError },
  ] = useUnBlockUserMutation();

  const handleUnblock = () => {
    unBlockUser(selectedUserId).then(() => {
      setBlockedUsers((prevBlockedUsers) =>
        prevBlockedUsers.filter((user) => user.user_id._id !== selectedUserId)
      );
      setSelectedUser("");
      setSelectedUserId("");
      setConfirmationModal(false);
    });
  };

  useEffect(() => {
    if (isUnblocked) {
      toast.success("User Unblocked successfully!");
    }
    if (isNotUnblocked) {
      const Error = unblockError as ApiError;
      toast.error(Error.data.message);
    }
  }, [isNotUnblocked, isUnblocked, unblockError]);

  useEffect(() => {
    refetch();
  }, []);

  useEffect(() => {
    if (isSuccess && data) {
      setBlockedUsers(data.data.blockedUsers);
    }
    if (isError) {
      const Error = error as ApiError;
      toast.error(Error.data.message);
    }
  }, [isSuccess, isError, data]);

  useEffect(() => {
    if (selectedUserId) setConfirmationModal(true);
  }, [selectedUserId]);

  return (
    <Box sx={styles.container}>
      <Box mb={1} sx={styles.header}>
        <Typography variant="body1" fontWeight={500}>
          People you block
        </Typography>
      </Box>
      <Box sx={styles.userContainer}>
        {isLoading || isFetching ? (
          <CircularProgress />
        ) : blockedUsers.length === 0 && !isLoading && !isFetching ? (
          <Typography variant="body2">No blocked users.</Typography>
        ) : (
          blockedUsers.map((user) => (
            <BlockedUser
              key={user?._id}
              id={user?.user_id?._id}
              name={user?.user_id?.displayName}
              userName={user.user_id.username}
              profilePicture={user?.user_id?.profile_picture}
              setSelectedUser={setSelectedUser}
              setSelectedUserId={setSelectedUserId}
            />
          ))
        )}
      </Box>

      <CustomModal
        open={confirmationModal}
        setOpen={setConfirmationModal}
        width="25%"
        padding={5}
        paddingHorizontal={true}
      >
        <Box sx={styles.modal}>
          <Typography variant="h5" fontWeight={600}>
            Unblock {selectedUser}?
          </Typography>
          <Typography
            textAlign="center"
            color="rgba(0, 0, 0, 0.7)"
            mt={2}
            variant="body2"
          >
            {`Are you sure you want to unblock ${selectedUser}`}
          </Typography>
          <Box mt={4} sx={styles.buttonGroup}>
            <Button
              onClick={() => {
                setSelectedUserId("");
                setConfirmationModal(false);
              }}
              variant="outlined"
              sx={{
                marginX: 2,
                width: "40%",
                height: 40,
                borderRadius: 8,
                padding: "0 23%",
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleUnblock}
              variant="contained"
              sx={{
                marginX: 2,
                width: "40%",
                height: 40,
                borderRadius: 8,
                padding: "0 23%",
              }}
            >
              Unblock
            </Button>
          </Box>
        </Box>
      </CustomModal>
    </Box>
  );
}

const useStyles = () =>
  createStyles({
    container: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      width: "100%",
    },
    header: {
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      width: "100%",
      [theme.breakpoints.down(600)]: {
        marginBottom: 0,
      },
    },
    userContainer: {
      display: "flex",
      flexDirection: "column",
      alignItems: "flex-start",
      width: "100%",
    },
    modal: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
    },
    buttonGroup: {
      width: "100%",
      display: "flex",
      flexDirection: "row",
      justifyContent: "center",
    },
  });
