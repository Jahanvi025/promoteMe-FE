import { Box, Typography } from "@mui/material";
import { createStyles } from "@mui/styles";
import { toast } from "react-toastify";
import { IconType } from "react-icons";

interface Props {
  title: string;
  audio?: Blob | string;
  onClick?: () => void;
  setAudio?: (value: Blob) => void;
  setIsAttached?: (value: boolean) => void;
  icon: IconType;
}

export default function RecordActionButton(props: Props) {
  const { title, audio, onClick, setAudio, setIsAttached, icon: Icon } = props;
  const styles = useStyles();

  const handleAudioChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.stopPropagation();
    if (audio) {
      toast("Audio file already exists, please delete it first", {
        type: "info",
      });
    }
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const arrayBuffer = reader.result as ArrayBuffer;
        const blob = new Blob([arrayBuffer], { type: file.type });
        setAudio && setAudio(blob);
        setIsAttached && setIsAttached(true);
      };
      reader.readAsArrayBuffer(file);
    }
  };

  return (
    <Box component="div" onClick={onClick} sx={styles.container}>
      <Box sx={styles.iconContainer}>
        <Icon size={20} />
      </Box>
      <Typography sx={styles.title}>{title} Recording</Typography>
      {setAudio && (
        <Box
          component="input"
          type="file"
          accept="audio/mp3"
          sx={styles.input}
          onChange={handleAudioChange}
        />
      )}
    </Box>
  );
}

const useStyles = () =>
  createStyles({
    container: {
      paddingY: 0.5,
      paddingX: 1,
      marginRight: 4,
      border: "1px solid gray",
      backgroundColor: "white",
      borderRadius: 3,
      cursor: "pointer",
      position: "relative",
      display: "flex",
      alignItems: "center",
    },
    iconContainer: {
      marginTop: 0.5,
      marginRight: 1,
    },
    title: {
      marginRight: 2,
    },
    input: {
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
  });
