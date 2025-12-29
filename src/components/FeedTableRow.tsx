import { TableCell, TableRow, IconButton, Typography } from "@mui/material";
import CustomSwitch from "./CustomSwitch";
import { ReactComponent as EditIcon } from "../assets/svg/tableEdit.svg";
import { ReactComponent as DeleteIcon } from "../assets/svg/tableDelete.svg";
import { ReactComponent as AudioIcon } from "../assets/svg/addAudio.svg";
import { ReactComponent as ImageIcon } from "../assets/svg/addImage.svg";
import { ReactComponent as VideoIcon } from "../assets/svg/addVideo.svg";
import { ReactComponent as TextIcon } from "../assets/svg/text.svg";
import { createStyles } from "@mui/styles";
import { formatDate } from "../utils/helper";

interface Props extends Post {
  setDeletePostModal: (value: boolean) => void;
  setIsEditingPost: (value: boolean) => void;
  setPostType: (value: PostContentType) => void;
  setDescription: (value?: string) => void;
  setSelectedMedia: (value?: (string | File)[]) => void;
  setSelectedAudio: (value?: string | Blob) => void;
  setSelectedPostId: (value: string) => void;
  setAccessIdentifier: (value: string) => void;
  setThumbnail: (value?: (string | File)[]) => void;
  setTeaser: (value?: (string | File)[]) => void;
}

export default function FeedTableRow(props: Props) {
  const {
    type,
    description,
    status,
    updatedAt,
    audio_url,
    setDeletePostModal,
    setIsEditingPost,
    setPostType,
    setDescription,
    setSelectedAudio,
    setSelectedPostId,
    setSelectedMedia,
    _id,
    images,
    video_url,
    thumbnail_url,
    teaser_url,
    access_identifier,
    setAccessIdentifier,
    setThumbnail,
    setTeaser,
  } = props;
  const styles = useStyles();

  const resolvePostTypeIcon = () => {
    if (type === "AUDIO")
      return (
        <AudioIcon style={{ marginRight: 10 }} color="rgba(12, 143, 252, 1)" />
      );
    else if (type === "VIDEO")
      return (
        <VideoIcon style={{ marginRight: 10 }} color="rgba(12, 143, 252, 1)" />
      );
    else if (type === "TEXT")
      return (
        <TextIcon style={{ marginRight: 10 }} color="rgba(12, 143, 252, 1)" />
      );
    else if (type === "IMAGE")
      return (
        <ImageIcon style={{ marginRight: 10 }} color="rgba(12, 143, 252, 1)" />
      );
  };

  const handleEditPost = () => {
    if (type === "AUDIO") setSelectedAudio(audio_url);
    else if (type === "IMAGE") setSelectedMedia(images);
    else if (type === "VIDEO") {
      setSelectedMedia([video_url]);
      if (thumbnail_url != undefined) {
        setThumbnail([thumbnail_url]);
      }
      if (teaser_url != undefined) {
        setTeaser([teaser_url]);
      }
    }
    setDescription(description);
    setIsEditingPost(true);
    setPostType(type);
    setSelectedPostId(_id);
    setAccessIdentifier(access_identifier || "");
  };

  const handleDeletePost = () => {
    setSelectedPostId(_id);
    setDeletePostModal(true);
  };

  return (
    <TableRow sx={styles.row}>
      <TableCell
        sx={{
          ...styles.cell,
          display: "flex",
          alignItems: "center",
          padding: 2,
        }}
        align="left"
      >
        {resolvePostTypeIcon()}
        <Typography color="rgba(12, 143, 252, 1)">
          {type.charAt(0) + type.slice(1).toLowerCase()}
        </Typography>
      </TableCell>
      <TableCell sx={styles.cell} align="left">
        <Typography noWrap sx={{ color: "black" }}>
          {description || "-"}
        </Typography>
      </TableCell>
      <TableCell sx={{ ...styles.cell, minWidth: 110 }} align="left">
        <CustomSwitch isActive={status === "ACTIVE"} postId={_id} isPost />
      </TableCell>
      <TableCell sx={styles.cell} align="left">
        <Typography>{formatDate(updatedAt)}</Typography>
      </TableCell>
      <TableCell sx={styles.cell} align="center">
        <IconButton onClick={handleEditPost}>
          <EditIcon height={20} width={20} />
        </IconButton>
        <IconButton onClick={handleDeletePost}>
          <DeleteIcon height={20} width={20} />
        </IconButton>
      </TableCell>
    </TableRow>
  );
}

const useStyles = () =>
  createStyles({
    cell: {
      fontSize: 14,
      whiteSpace: "nowrap",
      maxWidth: "150px",
      overflow: "hidden",
      textOverflow: "ellipsis",
      borderBottom: "none",
      padding: "8px 16px",
    },
    row: {
      boxShadow: "0px 1px 10px rgba(0, 0, 0, 0.1)",
      borderRadius: 5,
      marginBottom: 8,
    },
  });
