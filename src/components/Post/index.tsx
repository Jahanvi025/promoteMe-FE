import { Box } from "@mui/material";
import PostHeader from "./PostHeader";
import { createStyles } from "@mui/styles";
import PostContent from "./PostContent";
import PostButton from "./PostButton";
import { ReactComponent as LikeIcon } from "../../assets/svg/like.svg";
import { ReactComponent as CommentIcon } from "../../assets/svg/comment.svg";
import { ReactComponent as ShareIcon } from "../../assets/svg/share.svg";
import { ReactComponent as TipIcon } from "../../assets/svg/tipIcon.svg";
import { memo } from "react";
import theme from "../../themes";
import EditPost from "../EditPost";
import ProductContent from "../../components/Product/ProductContent";
import { useAppSelector } from "../../store/store";

interface Props extends Post {
  setPostType?: (value: PostContentType) => void;
  setIsEditingPost?: (value: boolean) => void;
  onDelete?: (postId: string) => void;
  onEdit?: (postId: string) => void;
  onNotInterested?: (postId: string) => void;
  onShare?: (postId: string) => void;
  isEditingPost?: boolean;
  selectedPostId?: string;
  setSelectedPostId?: (postId: string) => void;
  setSelectedUserId?: (userId: string) => void;
  onPostUpdate?: (updatedPost: Post) => void;
  setTipModal?: (value: boolean) => void;
  name?: string;
  isProduct?: boolean;
  isBookmark?: boolean;
  access_identifier?: string;
  onReport?: (userId: string) => void;
  isSubscribed?: boolean;
}

const Post = memo((props: Props) => {
  const {
    isPreview,
    description,
    user_id,
    images,
    video_url,
    audio_url,
    createdAt,
    type,
    isLiked,
    likes,
    comments,
    tip,
    _id,
    setCommentModal,
    setTipModal,
    onDelete,
    thumbnail_url,
    teaser_url,
    isEditingPost,
    setIsEditingPost,
    setPostType,
    onEdit,
    selectedPostId,
    setSelectedPostId,
    onPostUpdate,
    name,
    price,
    isProduct,
    isBookmark,
    isPurchased,
    access_identifier,
    username,
    onReport,
    onNotInterested,
    setSelectedUserId,
    onShare,
    isSubscribed,
  } = props;

  const { _id: userId, displayName = "", profile_picture = "" } = user_id || {};

  const styles = useStyles(type, isPreview, isProduct, isBookmark);
  const role = useAppSelector((state) => state.auth.user?.lastActiveRole);

  return (
    <>
      {isEditingPost && _id === selectedPostId ? (
        <EditPost
          postType={type}
          description={description}
          setPostType={setPostType || (() => {})}
          setIsEditingPost={setIsEditingPost || (() => {})}
          selectedMedia={type === "IMAGE" ? images : [video_url]}
          selectedAudio={audio_url}
          thumbnail={[thumbnail_url]}
          teaser={[teaser_url]}
          selectedPostId={_id}
          setSelectedPostId={setSelectedPostId}
          onPostUpdate={onPostUpdate}
          access_identifier={access_identifier || ""}
        />
      ) : (
        <Box p={2} mb={isPreview ? 0 : 2} sx={styles.container}>
          <PostHeader
            username={displayName}
            profilePicture={profile_picture}
            createdAt={createdAt}
            isPreview={isPreview}
            _id={_id}
            onDelete={onDelete}
            onEdit={onEdit}
            isBookmarked={isBookmark}
            isProduct={isProduct}
            userId={userId}
            onReport={onReport}
            onNotInterested={onNotInterested}
          />
          {!isProduct && (
            <PostContent
              media={images}
              video={video_url}
              audio={audio_url}
              text={description}
              isPreview={isPreview}
              type={type}
              thumbnail_url={thumbnail_url}
              teaser_url={teaser_url}
              access_identifier={access_identifier}
              isPurchased={isPurchased}
              user={user_id}
              postId={_id}
              username={username}
              price={price || ""}
              isSubscribed={isSubscribed}
            />
          )}
          {isProduct && (
            <ProductContent
              name={name || ""}
              description={description || ""}
              images={images || []}
              price={price}
              _id={_id}
            />
          )}
          <Box sx={styles.buttonContainer} mt={2}>
            {!isProduct && (
              <Box sx={styles.buttonContainerLeft} paddingX={1}>
                <PostButton
                  Icon={LikeIcon}
                  title="Like"
                  isLiked={isLiked}
                  isPreview={isPreview}
                  count={likes}
                  _id={_id}
                />
                <PostButton
                  Icon={CommentIcon}
                  title="Comment"
                  isComment
                  isPreview={isPreview}
                  count={comments}
                  setCommentsModal={setCommentModal}
                  _id={_id}
                />
                <PostButton
                  Icon={TipIcon}
                  title={role === "FAN" ? "Send tip" : "Tip"}
                  isTip
                  isPreview={isPreview}
                  setTipModal={setTipModal}
                  tip={tip}
                  _id={_id}
                  setSelectedUserId={setSelectedUserId}
                  userId={user_id?._id}
                />
              </Box>
            )}
            <Box sx={styles.shareButton}>
              <PostButton
                Icon={ShareIcon}
                title="Share"
                isShare
                isPreview={isPreview}
                _id={_id}
                onShare={onShare}
              />
            </Box>
          </Box>
        </Box>
      )}
    </>
  );
});

export default Post;

const useStyles = (
  type: string,
  isPreview: boolean,
  isProduct: boolean | undefined,
  isBookmark: boolean | undefined
) => {
  const resolvePostBackground = (): string => {
    if (isProduct) return "rgba(223, 255, 249, 1)";
    else if (type === "TEXT") return "rgba(255, 246, 223, 1)";
    else if (type === "VIDEO") return "rgba(255, 223, 223, 1)";
    else if (type === "AUDIO") return "rgba(223, 255, 230, 1)";
    else return "rgba(223, 235, 255, 1)";
  };

  return createStyles({
    container: {
      width: isPreview ? "100%" : isBookmark ? "70%" : "90%",
      // boxShadow: "0px 1.5px 75.23px 0px #0000001A",
      borderRadius: 5,
      backgroundColor: resolvePostBackground(),
      position: "relative",
    },
    buttonContainer: {
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    buttonContainerLeft: {
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-evenly",
      [theme.breakpoints.down(900)]: {
        padding: 0,
      },
    },
    shareButton: {
      position: "absolute",
      right: 10,
      bottom: isProduct ? 10 : 15,
    },
  });
};
