import { Box } from "@mui/material";
import TrendingCard from "./TrendingCard";
import { createStyles } from "@mui/styles";
import PaginationPointer from "./PaginationPointer";
import { useEffect, useState } from "react";
import { useAppSelector } from "../../store/store";
import { useGetTrendingUsersQuery } from "../../services/api";

interface Props {
  selectedPage: number;
  setTrendingUserCount: (value: number) => void;
}

export default function Trending(props: Props) {
  const { selectedPage, setTrendingUserCount } = props;
  const styles = useStyles();
  const [trendingInView, setTrendingInView] = useState<any[]>([]);
  const role = useAppSelector((state) => state.auth?.user?.lastActiveRole);

  const { data } = useGetTrendingUsersQuery();

  useEffect(() => {
    setTrendingUserCount(data?.data?.users?.length || 0);
  });

  useEffect(() => {
    const itemsPerPage = role === "CREATOR" ? 3 : 2;

    const startingIndex = selectedPage * itemsPerPage;
    const endingIndex = startingIndex + itemsPerPage;

    const trendingresults = (data?.data?.users || []).slice(
      startingIndex,
      endingIndex
    );

    setTrendingInView(trendingresults);
  }, [selectedPage, data, role]);

  return (
    <Box sx={styles.container}>
      <Box>
        {trendingInView.map((trending) => (
          <TrendingCard key={trending._id} {...trending} />
        ))}
      </Box>
      <Box sx={styles.pointerContainer}>
        {data &&
          data.data?.users &&
          Array.from(
            {
              length: Math.ceil(
                data.data.users.length / (role === "CREATOR" ? 3 : 2)
              ),
            },
            (_, index) => (
              <PaginationPointer
                key={index}
                index={index}
                selectedPage={selectedPage}
              />
            )
          )}
      </Box>
    </Box>
  );
}

const useStyles = () =>
  createStyles({
    container: {
      width: "100%",
    },
    pointerContainer: {
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
    },
  });
