import { Box } from "@mui/material";
import { createStyles } from "@mui/styles";
import { ReactComponent as SelectedPointerIcon } from "../../assets/svg/selectedPage.svg";

interface Props {
  index: number;
  selectedPage: number;
}

export default function PaginationPointer(props: Props) {
  const { index, selectedPage } = props;
  const styles = useStyles(index, selectedPage);

  if (index === selectedPage)
    return <SelectedPointerIcon style={{ marginLeft: 10, marginRight: 10 }} />;
  else return <Box sx={styles.pointer} marginX={1}></Box>;
}

const useStyles = (index: number, selectedPage: number) => {
  const isSelected = index === selectedPage;
  return createStyles({
    pointer: {
      height: 7,
      width: 7,
      borderRadius: "50%",
      backgroundColor: isSelected ? "white" : "rgba(217, 217, 217, 1)",
      padding: isSelected ? 0.5 : 0,
      border: isSelected ? "1px solid black" : "none",
    },
  });
};
