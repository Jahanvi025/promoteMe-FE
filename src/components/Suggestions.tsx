import { Box, Typography } from "@mui/material";
import { createStyles } from "@mui/styles";
import SuggestionCard from "./SuggestionCard";
import { useGetSuggestionsQuery } from "../services/api";

const Suggestions = () => {
  const styles = useStyles();

  const { data } = useGetSuggestionsQuery();

  return (
    <Box sx={styles.container}>
      <Typography sx={styles.heading} mb={2}>
        Suggestions
      </Typography>
      {data?.data?.users.map((suggestion) => (
        <SuggestionCard
          key={suggestion.username}
          profilePicture={suggestion.profile_picture}
          name={suggestion.displayName}
          username={suggestion.username}
          userId={suggestion._id}
        />
      ))}
    </Box>
  );
};

export default Suggestions;

const useStyles = () =>
  createStyles({
    container: {
      width: "100%",
    },
    heading: {
      fontSize: 25,
      fontWeight: 600,
    },
  });
