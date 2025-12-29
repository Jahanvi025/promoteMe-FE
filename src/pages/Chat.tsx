import {
  Avatar,
  Box,
  Button,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import PageHeader from "../components/PageHeader";
import MessageItem from "../components/MessageItem";
import { ReactComponent as MoreIcon } from "../assets/svg/moreOptions.svg";
// import { ReactComponent as PinIcon } from "../assets/svg/pin.svg";
import { ReactComponent as SendIcon } from "../assets/svg/send.svg";
import { ReactComponent as SearchIcon } from "../assets/svg/search.svg";
import Message from "../components/Message";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { createStyles } from "@mui/styles";
import CustomModal from "../components/CustomModal";
import EmojiPicker from "emoji-picker-react";
import EmojiEmotionsIcon from "@mui/icons-material/EmojiEmotions";
import theme from "../themes";
import { IoArrowBack } from "react-icons/io5";
import {
  useBlockUserMutation,
  useDeleteConversationMutation,
  useGetConversationsQuery,
  useGetMessagesQuery,
  useLazySearchUserQuery,
} from "../services/api";
import InfiniteScroll from "react-infinite-scroll-component";
import { RootState, useAppDispatch, useAppSelector } from "../store/store";
import useDebounce from "../hooks/debounceSearch";
import useSocket from "../hooks/useSocket";
import { setMessageCount } from "../store/reducers/authReducer";

export default function Chat() {
  const [messages, setMessages] = useState<MessageResponse>({
    data: {
      messages: [],
      count: 0,
    },
  });

  const [isOptionsModal, setIsOptionsModal] = useState(false);
  const [selectedChat, setSelectedChat] = useState(-1);
  const [selectedChatId, setSelectedChatId] = useState("");
  const [selectedUserId, setSelectedUserId] = useState("");
  const [selectedUserName, setSelectedUserName] = useState("");
  const [chatAction, setChatAction] = useState("");
  const [chatModal, setChatModal] = useState(false);
  const [message, setMessage] = useState("");
  const [isEmojiOpen, setIsEmojiOpen] = useState(false);
  const chatboxRef = useRef<HTMLDivElement>(null);
  const [remainingUnseenMessages, setRemainingUnseenMessages] = useState(0);

  const [showChats, setShowChats] = useState(true);
  const styles = useStyles(showChats);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedPage, setSelectedPage] = useState(1);
  const [selectedUserImage, setSelectedUserImage] = useState("");
  const userId = useAppSelector((state: RootState) => state.auth.user?.id);
  const [hasMore, setHasMore] = useState(true);
  const [hasMoreMessages, setHasMoreMessages] = useState(false);
  const [searchString, setSearchString] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isBlocking, setIsBlocking] = useState(false);

  const [
    deleteChat,
    {
      isSuccess: isChatDeleted,
      isError: isDeleteError,
      error: deleteChatError,
    },
  ] = useDeleteConversationMutation();

  const [
    blockUser,
    { isSuccess: isBlocked, isError: isNotBlocked, error: blockUserError },
  ] = useBlockUserMutation();

  const {
    data: conversationsData,
    isLoading: queryLoading,
    error,
    refetch,
  } = useGetConversationsQuery({
    page: currentPage,
    limit: 10,
  });

  useEffect(() => {
    setCurrentPage(1);
    refetch();
    setShowChats(true);
  }, [isChatDeleted]);

  useEffect(() => {
    setSearchString("");
  }, [selectedChat]);

  useEffect(() => {
    if (error) {
      console.error("Error fetching conversations:", error);
    }
  }, [error]);

  const fetchNextPage = () => {
    if (!queryLoading && hasMore) {
      setCurrentPage((prev) => prev + 1);
    } else if (conversationsData?.data.users.length === 0) {
      setHasMore(false);
    }
  };

  const {
    data: messagesData,
    isFetching: messageLoading,
    refetch: getMessages,
  } = useGetMessagesQuery({
    id: selectedChatId,
    page: selectedPage,
    limit: 10,
  });

  useEffect(() => {
    if (
      messagesData &&
      selectedPage === 1 &&
      messagesData?.data.messages.length <= messagesData?.data.count
    ) {
      setMessages(messagesData);
      setHasMoreMessages(true);
    } else if (
      messagesData &&
      selectedPage > 1 &&
      messagesData?.data.messages.length !== 0
    ) {
      setMessages((prevMessages) => ({
        data: {
          messages: [
            ...messagesData.data.messages,
            ...prevMessages.data.messages,
          ],
          count: prevMessages.data.count + messagesData.data.count,
        },
      }));
    }
  }, [messagesData]);

  const fetchMessages = () => {
    setSelectedPage(1);
    setHasMoreMessages(false);
    getMessages();
    socket?.emit("join chat", selectedChatId);
  };

  useEffect(() => {
    fetchMessages();
    setSelectedChatCompare(selectedChatId);
  }, [selectedChatId]);

  const { socket, setSelectedChatCompare } = useSocket(
    selectedChatId,
    userId || "",
    refetch,
    setMessages
  );

  const fetchPreviousMessages = () => {
    if (messageLoading || !hasMoreMessages) return;
    if (!messageLoading && hasMoreMessages) {
      setSelectedPage((prevPage) => prevPage + 1);
    }
  };

  const dispatch = useAppDispatch();

  const unseenMessages = useAppSelector(
    (state: RootState) => state.auth?.messageCount
  );

  const handleEmojiContainer = (
    event:
      | React.MouseEvent<HTMLInputElement, MouseEvent>
      | React.MouseEvent<HTMLButtonElement, MouseEvent>,
    value: boolean
  ) => {
    event.stopPropagation();
    setIsEmojiOpen(value);
  };

  const handleSendMessage = async () => {
    if (!message.length) {
      return toast("Please enter a message!", { type: "error" });
    }

    const newMessage: Message = {
      message,
      to: selectedUserId,
      status: "DELIEVERED",
      conversation_id: selectedChatId,
      createdAt: new Date(),
      updatedAt: new Date(),
      from: userId,
    };
    socket?.emit("new message", newMessage);

    setMessages((prevMessages) => ({
      data: {
        messages: [...prevMessages.data.messages, newMessage],
        count: prevMessages.data.count + 1,
      },
    }));

    if (!selectedChatId) {
      refetch();
    }
    setMessage("");
  };

  useEffect(() => {
    if (selectedChatId && selectedUserId) {
      socket?.emit("view conversation", {
        conversationId: selectedChatId,
        userId: userId,
      });

      return () => {
        socket?.off("unseen message count");
      };
    }
  }, [selectedChatId, userId]);

  useEffect(() => {
    refetch();
  }, [selectedChatId]);

  useEffect(() => {
    const unseen = unseenMessages - remainingUnseenMessages;
    dispatch(setMessageCount({ count: unseen }));
  }, [unseenMessages]);

  const handleOptions = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    action: string
  ) => {
    event.stopPropagation();
    setChatAction(action);
  };

  const openOptions = () => {
    if (selectedChat !== -1) setIsOptionsModal(!isOptionsModal);
  };

  useEffect(() => {
    if (selectedChatId) {
      chatboxRef.current?.scrollTo({
        top: chatboxRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, []);

  useEffect(() => {
    if (chatAction.length) setChatModal(true);
  }, [chatAction]);

  const handleChatAction = () => {
    if (chatAction === "Delete") {
      deleteChat(selectedChatId);
    }
    if (chatAction === "Block") {
      setIsBlocking(true);
      blockUser({
        user_id: selectedUserId,
        blocked_by: userId,
      });
    }
  };

  useEffect(() => {
    if (isChatDeleted) {
      toast.success("Chat deleted successfully!");
      setChatAction("");
      setSelectedChat(-1);
      setIsOptionsModal(false);
      setMessages({
        data: {
          messages: [],
          count: 0,
        },
      });
      setChatModal(false);
    } else if (isDeleteError) {
      const error = deleteChatError as ApiError;
      toast.error(error.data.message);
    }
  }, [isChatDeleted, isDeleteError, deleteChatError]);

  useEffect(() => {
    setIsBlocking(false);
    if (isBlocked) {
      toast.success("User blocked successfully!");
      setMessages({
        data: {
          messages: [],
          count: 0,
        },
      });
      setIsOptionsModal(false);
      setChatModal(false);
      setSelectedChat(-1);
      refetch();
    } else if (blockUserError) {
      const error = blockUserError as ApiError;
      toast.error(error.data.message);
    }
  }, [isBlocked, isNotBlocked, blockUserError]);

  const [searchUser] = useLazySearchUserQuery();

  const searchUsers = async (searchString: string) => {
    if (debouncedSearchString) {
      const result = await searchUser({ searchString }).unwrap();
      if (result && result.data && result.data.user) {
        setSearchResults(result.data.user);
      } else {
        setSearchResults([]);
      }
    } else {
      setSearchResults([]);
    }
  };

  const debouncedSearchString = useDebounce(searchString, 500);

  useEffect(() => {
    if (debouncedSearchString) {
      searchUsers(debouncedSearchString);
    } else {
      setSearchResults([]);
    }
  }, [debouncedSearchString]);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchString(event.target.value);
  };

  const scopeModalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!scopeModalRef.current?.contains(e.target as Node)) {
        setIsOptionsModal(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => {
      document.removeEventListener("mousedown", handler);
    };
  });

  return (
    <Box sx={styles.outerContainer} onClick={() => setIsEmojiOpen(false)}>
      <CustomModal
        open={chatModal}
        setOpen={setChatModal}
        width="25%"
        padding={5}
        paddingHorizontal={true}
      >
        <Box sx={styles.actionContainer}>
          <Typography variant="h5" fontWeight={600}>
            {chatAction === "Block"
              ? `Block ${selectedUserName}?`
              : "Delete chat?"}
          </Typography>
          <Typography
            textAlign="center"
            mt={2}
            color="rgba(0, 0, 0, 0.7)"
            variant="body2"
          >
            {chatAction === "Block"
              ? "Are you sure want to block this user?"
              : "Are you sure want to delete this chat?"}
          </Typography>
          <Box mt={4} sx={styles.buttonContainer}>
            <Button
              onClick={() => {
                setChatAction("");
                setIsOptionsModal(false);
                setChatModal(false);
              }}
              sx={styles.button}
              variant="outlined"
              color="primary"
            >
              Cancel
            </Button>
            <Button
              onClick={handleChatAction}
              sx={styles.button}
              variant="contained"
              color={chatAction === "Block" ? "primary" : "error"}
            >
              {chatAction}
            </Button>
          </Box>
        </Box>
      </CustomModal>
      <PageHeader title="Messages" />
      <Box sx={styles.container}>
        <Box sx={styles.leftContainer}>
          <Typography variant="h6" fontSize={16} ml={1}>
            Chat
          </Typography>
          <Box component="div" sx={styles.chats}>
            <TextField
              id="outlined-basic"
              variant="outlined"
              placeholder="Search"
              sx={styles.searchBar}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon style={{ color: "rgba(0, 0, 0, 0.54)" }} />
                  </InputAdornment>
                ),
              }}
              value={searchString}
              onChange={handleChange}
            />

            <InfiniteScroll
              dataLength={conversationsData?.data.users.length ?? 0}
              next={fetchNextPage}
              hasMore={hasMore}
              loader={queryLoading ? <Typography>Loading...</Typography> : null}
              endMessage={<Typography>No more chats</Typography>}
            >
              {searchString
                ? searchResults.map((conversation, index) => (
                    <MessageItem
                      key={index}
                      lastMessage={conversation?.latestMessage?.message}
                      selectedChat={selectedChat}
                      setSelectedChat={setSelectedChat}
                      setSelectedChatId={setSelectedChatId}
                      setShowChats={setShowChats}
                      name={conversation?.displayName}
                      unseen={conversation?.unseenCount}
                      index={index}
                      profilePicture={conversation?.profile_picture}
                      conversationId={conversation?.conversationId}
                      selectedUserImage={setSelectedUserImage}
                      setSelectedUserId={setSelectedUserId}
                      userId={conversation?._id}
                      setSelectedUserName={setSelectedUserName}
                      setRemainingUnseen={setRemainingUnseenMessages}
                    />
                  ))
                : conversationsData?.data?.users?.map((conversation, index) => (
                    <MessageItem
                      key={index}
                      lastMessage={conversation?.latestMessage}
                      selectedChat={selectedChat}
                      setSelectedChat={setSelectedChat}
                      setSelectedChatId={setSelectedChatId}
                      setShowChats={setShowChats}
                      name={conversation?.user?.displayName}
                      unseen={
                        selectedChatId !== conversation?._id
                          ? conversation?.unseenCount
                          : 0
                      }
                      index={index}
                      profilePicture={conversation?.user?.profile_picture}
                      conversationId={conversation?._id}
                      selectedUserImage={setSelectedUserImage}
                      setSelectedUserId={setSelectedUserId}
                      userId={conversation?.user?._id}
                      setSelectedUserName={setSelectedUserName}
                      setRemainingUnseen={setRemainingUnseenMessages}
                    />
                  ))}
            </InfiniteScroll>

            <Typography
              variant="h6"
              color="rgba(136, 151, 173, 1)"
              sx={{ width: "90%", textAlign: "center" }}
            >
              {conversationsData?.data.users.length === 0 &&
              searchResults.length === 0
                ? "No Chats Found"
                : ""}
            </Typography>
          </Box>
        </Box>
        {selectedChat === -1 ? (
          <Box
            sx={{
              ...styles.chatbox,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Typography variant="h4" color="rgba(136, 151, 173, 1)">
              {conversationsData?.data.users.length === 0
                ? "Select Chat to Start"
                : "Please select a chat"}
            </Typography>
          </Box>
        ) : (
          <Box sx={styles.chatbox}>
            <Box pl={5} pb={2.5} sx={styles.upperContainer}>
              <Box sx={styles.userInfo}>
                <Box sx={styles.backIcon}>
                  <IoArrowBack
                    fontSize={25}
                    onClick={() => setShowChats(true)}
                  />
                </Box>
                <Avatar sx={styles.profilePic} src={selectedUserImage} />
                <Typography sx={styles.userName}>{selectedUserName}</Typography>
              </Box>
              <Box ref={scopeModalRef}>
                <IconButton
                  sx={{ position: "relative" }}
                  onClick={openOptions}
                  size="large"
                >
                  <MoreIcon height={25} width={35} color="rgba(0, 0, 0, 0.7)" />
                  {isOptionsModal && (
                    <Box sx={styles.chatOptions}>
                      <Button
                        fullWidth
                        onClick={(e) => handleOptions(e, "Delete")}
                        sx={styles.scopeButton}
                      >
                        Delete Chat
                      </Button>
                      <Button
                        fullWidth
                        onClick={(e) => handleOptions(e, "Block")}
                        disabled={isBlocking}
                        sx={styles.scopeButton}
                      >
                        Block User
                      </Button>
                    </Box>
                  )}
                </IconButton>
              </Box>
            </Box>
            <Box
              component="div"
              ref={chatboxRef}
              sx={styles.messageBox}
              id="messageContainer"
            >
              <InfiniteScroll
                dataLength={messages.data.count}
                next={fetchPreviousMessages}
                hasMore={messages.data.messages.length < messages.data.count}
                inverse={true}
                loader={""}
                scrollableTarget="messageContainer"
                style={{ overflow: "hidden" }}
              >
                {messages.data.messages.map((item) => (
                  <Message
                    key={item._id}
                    from={item.from}
                    message={item.message}
                    img={selectedUserImage}
                    time={item.updatedAt}
                    images={item.images || []}
                    isLoading={messageLoading && selectedPage === 1}
                  />
                ))}
              </InfiniteScroll>
            </Box>
            <Box px={0} sx={styles.footer}>
              <EmojiPicker
                searchDisabled
                onEmojiClick={(e) => setMessage(message + e.emoji)}
                open={isEmojiOpen}
                lazyLoadEmojis
                style={{
                  position: "absolute",
                  bottom: "55px",
                  right: "30px",
                  zIndex: 999999,
                  fontSize: "24px",
                }}
                height={305}
                previewConfig={{ showPreview: false }}
              />
              <Box sx={styles.input}>
                <Box
                  component="input"
                  sx={{ border: "none", height: "100%", width: "100%" }}
                  type="text"
                  fontSize={16}
                  color="#969696"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleSendMessage();
                  }}
                  placeholder="Type a message"
                  onClick={(e) => handleEmojiContainer(e, false)}
                />
                <IconButton
                  onClick={(e) => {
                    handleEmojiContainer(e, !isEmojiOpen);
                  }}
                >
                  <EmojiEmotionsIcon
                    sx={{
                      color: isEmojiOpen
                        ? "rgba(12, 143, 252, 1)"
                        : "rgba(184, 180, 180, 1)",
                    }}
                  />
                </IconButton>
                {/* <IconButton size="large" sx={{ position: "relative" }}>
                  <Box component="input" type="file" sx={styles.fileSelector} />
                  <PinIcon />
                </IconButton> */}
                <Button
                  onClick={handleSendMessage}
                  sx={styles.sendButton}
                  variant="contained"
                  color="primary"
                >
                  <SendIcon height={25} width={25} />
                </Button>
              </Box>
            </Box>
          </Box>
        )}
      </Box>
    </Box>
  );
}

const useStyles = (showChats: boolean) =>
  createStyles({
    container: {
      width: "99%",
      display: "flex",
      flexDirection: "row",
      height: "100%",
    },
    chats: {
      height: "95%",
      maxHeight: "100vh",
      overflowY: "auto",
      overflowX: "hidden",
      marginLeft: "5px",
    },
    chatbox: {
      width: "70%",
      position: "relative",
      maxHeight: "100vh",
      [theme.breakpoints.down(900)]: {
        maxHeight: "100%",
      },
      [theme.breakpoints.down(600)]: {
        maxHeight: "100%",
        width: "100%",
        display: showChats ? "none" : "block",
      },
    },
    upperContainer: {
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      borderBottom: "1px solid rgba(0, 0, 0, 0.1)",
      [theme.breakpoints.down(600)]: {
        padding: "unset",
      },
    },
    userInfo: {
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      fontSize: "16px",
    },
    profilePic: {
      height: 50,
      width: 50,
      borderRadius: "50%",
      marginRight: 1.5,
      [theme.breakpoints.down(1000)]: {
        height: 40,
        width: 40,
      },
      [theme.breakpoints.down(600)]: {
        marginLeft: 2,
      },
    },
    messageBox: {
      paddingX: 5,
      paddingTop: 1,
      height: "100%",
      maxHeight: "65%",
      overflowY: "auto",
      scrollbarWidth: "none",
      marginBottom: 2,
      display: "flex",
      flexDirection: "column-reverse",
      [theme.breakpoints.down(600)]: {
        maxHeight: "75%",
        paddingX: 1,
      },
    },
    footer: {
      position: "sticky",
      bottom: 0,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    input: {
      border: "1px solid rgba(217, 217, 217, 1)",
      height: 50,
      width: "80%",
      borderRadius: 3,
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      px: 1,
      [theme.breakpoints.down(600)]: {
        width: "91%",
      },
    },
    sendButton: {
      marginLeft: 2,
      height: 40,
      width: 40,
      minWidth: 40,
      padding: 1.2,
      borderRadius: 2,
    },
    fileSelector: {
      display: "block",
      height: "100%",
      width: "100%",
      position: "absolute",
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
      opacity: 0,
      cursor: "pointer",
    },
    scopeButton: {
      justifyContent: "flex-start",
      textTransform: "initial",
      fontSize: 15,
      fontWeight: 400,
      color: "rgba(51, 51, 51, 1)",
      padding: "2px 10px",
    },
    chatOptions: {
      position: "absolute",
      width: "120px",
      minWidth: "10vw",
      backgroundColor: "white",
      top: 0,
      right: 45,
      boxShadow: "10",
      borderRadius: 3,
    },
    button: {
      marginX: 2,
      width: "40%",
      height: 40,
      borderRadius: 8,
      padding: "0 23%",
    },
    actionContainer: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
    },
    buttonContainer: {
      width: "100%",
      display: "flex",
      flexDirection: "row",
      justifyContent: "center",
    },
    userName: {
      fontSize: 20,
      fontWeight: 500,
      [theme.breakpoints.down(1000)]: {
        fontSize: 16,
      },
    },
    outerContainer: {
      marginLeft: "24%",
      position: "sticky",
      top: "109px",
      marginTop: "110px",
      height: "80vh",
      [theme.breakpoints.down(1000)]: {
        marginLeft: "25%",
      },
      [theme.breakpoints.down(900)]: {
        marginLeft: "5%",
      },
      [theme.breakpoints.down(600)]: {
        marginLeft: "2%",
        marginTop: "65px",
        height: showChats ? "85vh" : "88vh",
      },
    },

    leftContainer: {
      borderRight: "1px solid rgba(0, 0, 0, 0.1)",
      width: "30%",
      [theme.breakpoints.down(700)]: {
        width: "35%",
      },
      [theme.breakpoints.down(600)]: {
        display: showChats ? "block" : "none",
        width: "100vw",
        borderRight: "none",
      },
    },
    searchBar: {
      "& .MuiOutlinedInput-root": {
        borderRadius: 3,
        height: 50,
      },
      margin: 2,
      marginLeft: 0,
      width: "95%",

      [theme.breakpoints.down(600)]: {
        width: "98%",
      },
    },
    backIcon: {
      display: "none",
      [theme.breakpoints.down(600)]: {
        display: "block",
      },
    },
    emojiPicker: {
      "& .emoji-mart-emoji": {
        fontSize: "24px",
      },
    },
  });
