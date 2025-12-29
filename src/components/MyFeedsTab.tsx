import {
  Box,
  Button,
  InputAdornment,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import { createStyles } from "@mui/styles";
import SearchIcon from "@mui/icons-material/Search";
import { useEffect, useState } from "react";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
// import { ReactComponent as SortIcon } from "../assets/svg/sort.svg";
import FeedTableRow from "./FeedTableRow";
import CustomModal from "./CustomModal";
import EditPost from "./EditPost";
import Paginator from "./Account/TablePaginator";
import theme from "../themes";
import { useDeletePostMutation, useGetPostsQuery } from "../services/api";
import { toast } from "react-toastify";
import dayjs, { Dayjs } from "dayjs";
import TableSkeleton from "./Account/TableSkeleton";
import { RootState, useAppSelector } from "../store/store";

export default function MyFeedsTab() {
  const [age, setAge] = useState("");
  const [deletePostModal, setDeletePostModal] = useState(false);
  const [isEditingPost, setIsEditingPost] = useState(false);
  const [postType, setPostType] = useState<PostContentType>();
  const [description, setDescription] = useState<string>();
  const [selectedMedia, setSelectedMedia] = useState<(File | string)[]>();
  const [thumbnail, setThumbnail] = useState<(File | string)[]>();
  const [teaser, setTeaser] = useState<(File | string)[]>();
  const [selectedAudio, setSelectedAudio] = useState<Blob | string>();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [selectedPostId, setSelectedPostId] = useState<string>("");
  const styles = useStyles();
  const [selectedPage, setSelectedPage] = useState(1);
  const [feedTableRows, setPosts] = useState<Post[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [fromDate, setFromDate] = useState<Dayjs | null>(null);
  const [toDate, setToDate] = useState<dayjs.Dayjs | null>(dayjs());
  const [searchValue, setSearchValue] = useState<string>("");
  const [access_identifier, setAccessIdentifier] = useState<string>();
  const maxDate = dayjs();
  const role = useAppSelector(
    (state: RootState) => state?.auth?.user?.lastActiveRole
  );

  const {
    data: postsData,
    isLoading,
    isFetching,
    refetch,
  } = useGetPostsQuery({
    page: selectedPage,
    limit: rowsPerPage,
    fromDate: fromDate ? fromDate.toDate() : undefined,
    toDate: toDate ? toDate.toDate() : undefined,
    type: age,
    role: role,
    searchString: searchValue,
  });

  const [
    deletePost,
    { isSuccess: deletePostSuccess, isError: deletePostError, error },
  ] = useDeletePostMutation();

  useEffect(() => {
    refetch();
  }, [isEditingPost, deletePostSuccess]);

  useEffect(() => {
    if (postsData) {
      if (postsData.data.posts.length > 0) {
        const newPosts =
          selectedPage === 1
            ? postsData.data.posts
            : postsData.data.posts.filter(
                (newPost) =>
                  !feedTableRows.some(
                    (existingPost) => existingPost._id === newPost._id
                  )
              );
        setPosts((prevPosts) =>
          selectedPage === 1 ? newPosts : [...prevPosts, ...newPosts]
        );
        setHasMore(true);
      } else {
        if (selectedPage === 1) {
          setPosts([]);
        }
        setHasMore(false);
      }
    }
  }, [postsData, selectedPage]);

  const handleDeletePost = async () => {
    await deletePost(selectedPostId);
    setDeletePostModal(false);
  };

  const header = [
    "Post Type",
    "Description",
    "Status",
    "Updated On",
    "Actions",
  ];

  useEffect(() => {
    if (deletePostSuccess) {
      toast.success("Post deleted successfully!");
    }

    if (deletePostError) {
      const Error = error as ApiError;
      toast.error("Error deleting post: " + Error?.data?.message);
    }
  }, [deletePostSuccess, deletePostError]);

  const handleChange = (event: SelectChangeEvent) => {
    setSelectedPage(1);
    setAge(event.target.value as string);
  };

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
    if (hasMore && newPage > page) {
      setSelectedPage(selectedPage + 1);
    }
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleFromDateChange = (date: Dayjs | null) => {
    setFromDate(date);
  };

  const handleToDateChange = (date: Dayjs | null) => {
    setToDate(date);
  };

  useEffect(() => {
    if (searchValue === "") {
      setSelectedPage(1);
      refetch();
    }
  }, [searchValue]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedPage(1);
    setSearchValue(event.target.value);
  };

  const slicedRows = feedTableRows.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <Box sx={styles.container}>
      {isEditingPost ? (
        <EditPost
          postType={postType || "TEXT"}
          description={description}
          setPostType={setPostType}
          setIsEditingPost={setIsEditingPost}
          selectedMedia={selectedMedia}
          selectedAudio={selectedAudio}
          thumbnail={thumbnail}
          teaser={teaser}
          selectedPostId={selectedPostId}
          access_identifier={access_identifier || ""}
        />
      ) : (
        <>
          <Box sx={styles.tabHeader}>
            <Typography variant="h6" sx={styles.heading}>
              My Feeds
            </Typography>
            <Box sx={styles.actionButtons}>
              <TextField
                id="outlined-basic"
                variant="outlined"
                placeholder="Search"
                value={searchValue}
                onChange={handleSearchChange}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 3,
                    height: 40,
                  },
                  width: 500,
                  maxWidth: "44%",
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon style={{ color: "rgba(0, 0, 0, 0.54)" }} />
                    </InputAdornment>
                  ),
                }}
                disabled={postsData?.data.count === 0}
              />
              <Select
                value={age}
                onChange={handleChange}
                displayEmpty
                inputProps={{ "aria-label": "Without label" }}
                sx={styles.select}
                disabled={postsData?.data.count === 0}
              >
                <MenuItem value="">All Types</MenuItem>
                <MenuItem value="AUDIO">Audio</MenuItem>
                <MenuItem value="VIDEO">Video</MenuItem>
                <MenuItem value="IMAGE">Image</MenuItem>
                <MenuItem value="TEXT">Text</MenuItem>
              </Select>
              <DatePicker
                label="From"
                value={fromDate}
                onChange={handleFromDateChange}
                sx={styles.datePicker}
                maxDate={maxDate}
                disabled={postsData?.data.count === 0}
              />
              <DatePicker
                label="To"
                value={toDate}
                onChange={handleToDateChange}
                sx={styles.datePicker}
                maxDate={maxDate}
                disabled={postsData?.data.count === 0}
              />
            </Box>
          </Box>
          <TableContainer component={Paper} sx={styles.tableContainer}>
            <Table sx={styles.table} aria-label="feeds table">
              <TableHead>
                <TableRow>
                  {header.map((header, index) => (
                    <TableCell
                      key={index}
                      align={index > 0 ? "center" : "left"}
                      sx={{
                        ...styles.cell,
                        ...(header === "Status"
                          ? { pl: 3 }
                          : header === "Actions"
                          ? { pl: "5%" }
                          : {}),
                      }}
                    >
                      <Box display="flex" alignItems="center" gap={2}>
                        <Typography
                          sx={{ fontSize: 14, color: "rgba(0, 0, 0, 0.5)" }}
                        >
                          {header}
                        </Typography>
                        {/* <SortIcon height={14} width={14} /> */}
                      </Box>
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {isFetching || isLoading ? (
                  <>
                    {Array.from({ length: 4 }).map((_, index) => (
                      <TableSkeleton key={index} cellCount={5} />
                    ))}
                  </>
                ) : slicedRows.length > 0 ? (
                  slicedRows.map((row, index) => (
                    <FeedTableRow
                      key={index}
                      {...row}
                      setDeletePostModal={setDeletePostModal}
                      setIsEditingPost={setIsEditingPost}
                      setPostType={setPostType}
                      setDescription={setDescription}
                      setSelectedMedia={setSelectedMedia}
                      setSelectedAudio={setSelectedAudio}
                      setSelectedPostId={setSelectedPostId}
                      setThumbnail={setThumbnail}
                      setTeaser={setTeaser}
                      setAccessIdentifier={setAccessIdentifier}
                    />
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={8} align="center">
                      <Typography variant="body1">No data found</Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <Box
            sx={{ width: "100%", display: "flex", justifyContent: "center" }}
          >
            <Paginator
              totalRows={postsData?.data.count || 0}
              rowsPerPage={rowsPerPage}
              currentPage={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </Box>
        </>
      )}
      <CustomModal
        open={deletePostModal}
        setOpen={setDeletePostModal}
        width="25%"
        padding={5}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Typography variant="h5">Delete this Post?</Typography>
          <Typography mt={2} textAlign="center" color="rgba(0, 0, 0, 0.69)">
            Are you sure you want to delete this post?
          </Typography>
          <Box
            mt={4}
            sx={{
              width: "100%",
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              gap: 3,
            }}
          >
            <Button
              onClick={() => setDeletePostModal(false)}
              variant="outlined"
              sx={{ paddingX: 8, height: 40, borderRadius: 10 }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleDeletePost}
              variant="contained"
              sx={{ paddingX: 8, height: 40, borderRadius: 10 }}
              color="error"
            >
              Delete
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
    tabHeader: {
      display: "flex",
      flexDirection: "row",
      width: "99%",
      marginBottom: 4,
      justifyContent: "space-between",
      [theme.breakpoints.down(600)]: {
        marginBottom: 0,
        marginTop: 0,
      },
    },
    actionButtons: {
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      width: "65%",
      justifyContent: "flex-end",
      gap: 2,
      [theme.breakpoints.down(900)]: {
        width: "75%",
      },
      [theme.breakpoints.down(600)]: {
        width: "100%",
        flexWrap: "wrap",
        justifyContent: "center",
      },
    },
    datePicker: {
      "& .MuiOutlinedInput-root": {
        borderRadius: "10px",
        height: "40px",
      },
      "& .MuiInputLabel-root": {
        lineHeight: 0.5,
        overflow: "visible",
      },
      maxWidth: "160px",
    },
    tableContainer: {
      width: "100%",
      overflowX: "auto",
      border: "none",
      boxShadow: "none",
      scrollbarWidth: "thin",
      [theme.breakpoints.down(600)]: {
        scrollbarWidth: "none",
      },
    },
    cell: {
      fontSize: 14,
      fontWeight: 500,
      color: "#6B7280",
      whiteSpace: "nowrap",
      maxWidth: 150,
      overflow: "hidden",
      textOverflow: "ellipsis",
      borderBottom: "none",
    },
    marginLeft: {
      marginLeft: "40px",
    },
    row: {
      height: 60,
      "&:not(:last-child)": {
        marginBottom: 16,
      },
    },
    table: {
      margin: "0 3px",
      borderCollapse: "separate",
      borderSpacing: "0 18px",
      maxWidth: "99%",
    },
    select: {
      height: 40,
      width: 200,
      borderRadius: 3,
      [theme.breakpoints.down(900)]: {
        width: 150,
      },
      [theme.breakpoints.down(900)]: {
        width: 160,
      },
    },
    heading: {
      [theme.breakpoints.down(600)]: {
        display: "none",
      },
    },
  });
