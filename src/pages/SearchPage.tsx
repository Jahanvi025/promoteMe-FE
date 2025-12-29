import {
  Box,
  InputAdornment,
  MenuItem,
  Select,
  SelectChangeEvent,
  Skeleton,
  TextField,
  Typography,
} from "@mui/material";
import { createStyles } from "@mui/styles";
import PageHeader from "../components/PageHeader";
import theme from "../themes";
import { LuSearch } from "react-icons/lu";
import { useEffect, useState } from "react";
import ProfileCard from "../components/profileCard";
import {
  useGetCategoriesQuery,
  useGetSearchedUsersQuery,
} from "../services/api";
import useDebounce from "../hooks/debounceSearch";

export default function SearchPage() {
  const [category, setCategory] = useState("");
  const [users, setUsers] = useState<SearchedUser[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [searchString, setSearchString] = useState("");

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchString(event.target.value);
  };

  const handleChange = (event: SelectChangeEvent) => {
    setCategory(event.target.value);
  };

  const debouncedSearchString = useDebounce(searchString, 1000);

  const {
    data: userData,
    refetch,
    isLoading,
  } = useGetSearchedUsersQuery({
    searchString: debouncedSearchString,
    category,
  });

  const { data: categoriesData } = useGetCategoriesQuery();

  useEffect(() => {
    refetch();
  }, [debouncedSearchString, category]);

  useEffect(() => {
    if (userData && userData.data.users.length > 0) {
      setUsers(userData?.data?.users);
      setHasMore(true);
    } else if (userData && userData.data?.users.length === 0) {
      setUsers([]);
      setHasMore(false);
    }
  }, [userData]);

  const styles = useStyles();

  return (
    <Box sx={styles.outerContainer}>
      <PageHeader title="Search" />
      <Box sx={styles.container}>
        <Box
          sx={{
            width: "100%",
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <TextField
            placeholder="Search"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LuSearch color="black" />
                </InputAdornment>
              ),
            }}
            onChange={handleSearch}
            sx={styles.searchBar}
          />
          <Select
            value={category}
            sx={styles.select}
            onChange={handleChange}
            displayEmpty
          >
            <MenuItem value="">All Categories</MenuItem>
            {categoriesData?.data?.categories?.map((category) => (
              <MenuItem key={category._id} value={category._id}>
                {category.name}
              </MenuItem>
            ))}
          </Select>
        </Box>
        <Box sx={styles.contentSection} id="scrollableDiv">
        {isLoading
            ? 
              Array.from(new Array(4)).map((_, index) => (
                <Skeleton
                  key={index}
                  variant="rectangular"
                  width={180}
                  height={200}
                  sx={{ borderRadius: "10px" }}
                />
              ))
            : 
              users.map((user, index) => (
                <ProfileCard
                  key={index}
                  name={user?.displayName}
                  username={user?.username}
                  profile_image={user?.profile_picture}
                  cover_picture={user?.cover_image}
                  userId={user?._id}
                />
              ))
          }
        </Box>
        {!hasMore && !isLoading && (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
              }}
            >
              <Typography variant="h6">
                {userData?.data?.count === 0 ? "No Users" : "No more Users"}
              </Typography>
            </Box>
          )}
      </Box>
    </Box>
  );
}

const useStyles = () =>
  createStyles({
    outerContainer: {
      marginLeft: "22%",
      overflowY: "scroll",
      scrollbarWidth: "none",
      position: "sticky",
      top: "109px",
      marginTop: "105px",
      [theme.breakpoints.down(1150)]: {
        marginLeft: "24%",
      },
      [theme.breakpoints.down(900)]: {
        marginLeft: "5%",
        marginTop: "102px",
      },
      [theme.breakpoints.down(600)]: {
        marginTop: "58px",
        marginLeft: "2%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
      },
    },
    container: {
      width: "92%",
      display: "flex",
      flexDirection: "column",
      marginLeft: "2px",
      marginRight: "20px",
      [theme.breakpoints.down(1150)]: {
        width: "95%",
      },
      [theme.breakpoints.down(600)]: {
        width: "92%",
        flexDirection: "column",
      },
    },
    searchBar: {
      width: "70%",
      "& .MuiOutlinedInput-root": {
        width: "100%",
        height: 40,
        borderRadius: 5,
      },
      [theme.breakpoints.down(600)]: {
        marginLeft: "10px",
        width: "50%",
      },
    },
    select: {
      height: 40,
      width: "25%",
      borderRadius: 5,
      paddingLeft: "10px",
      [theme.breakpoints.down(900)]: {
        width: 150,
      },
      [theme.breakpoints.down(900)]: {
        width: 160,
      },
    },
    contentSection: {
      width: "100%",
      height: "auto",
      display: "grid",
      gridTemplateColumns: "repeat(auto-fill, minmax(190px, 1fr))",
      gap: "2vw",
      paddingTop: "30px",
      boxSizing: "border-box",
      justifyContent: "start",
      overflowY: "scroll",
      scrollbarWidth: "none",
      [theme.breakpoints.down(700)]: {
        gridTemplateColumns: "repeat(auto-fill, minmax(190px, 1fr))",
      },
      [theme.breakpoints.down(600)]: {
        gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
        marginLeft: "10px",
      },
      [theme.breakpoints.down(400)]: {
        gridTemplateColumns: "repeat(auto-fill, minmax(165px, 1fr))",
      },
    },
  });
