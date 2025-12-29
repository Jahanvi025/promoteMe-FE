import { Box, Button, TextField, Typography } from "@mui/material";
import { createStyles } from "@mui/styles";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import AddPostButton from "../components/AddPostButton";
import { ReactComponent as AddImageIcon } from "../assets/svg/addImage.svg";
import { ReactComponent as AddTextIcon } from "../assets/svg/text.svg";
import { ReactComponent as AddAudioIcon } from "../assets/svg/addAudio.svg";
import { ReactComponent as AddVideoIcon } from "../assets/svg/addVideo.svg";
import { ReactComponent as GlobeIcon } from "../assets/svg/scopeGlobe.svg";
import { ReactComponent as ArrowDownIcon } from "../assets/svg/arrowDown.svg";
import AddPostInput from "../components/AddPostInput";
import PostImage from "../components/PostImage";
import PostVideo from "../components/PostVideo";
import PostAudio from "../components/PostAudio";
import CustomModal from "../components/CustomModal";
import theme from "../themes";
import Post from "../components/Post";
import { resolveContentLink } from "../utils/helper";
import { useAppSelector } from "../store/store";
import {
  useCreatePostMutation,
  useUpdatePostMutation,
  useUploadMediaMutation,
} from "../services/api";
import { toast } from "react-toastify";
import ThankYouModal from "./ThankYouModal";

interface Props {
  postType: PostContentType;
  isEmojiOpen: boolean;
  isEditPost?: boolean;
  description?: string;
  selectedAudio?: string | Blob;
  selectedThumbnail?: (string | File)[];
  selectedTeaser?: (string | File)[];
  selectedMedia?: (string | File)[];
  setPostType: (value: PostContentType) => void;
  setIsEmojiOpen: (value: boolean) => void;
  selectedPostId?: string;
  setSelectedPostId?: (value: string) => void;
  onPostUpdate?: (updatedPost: Post) => void;
  access_identifier?: string;
  emojiPickerRef?: React.RefObject<HTMLDivElement>;
}

export default function AddPostCard(props: Props) {
  const {
    postType,
    isEmojiOpen,
    isEditPost,
    description,
    selectedAudio,
    selectedMedia,
    setPostType,
    setIsEmojiOpen,
    selectedThumbnail,
    selectedTeaser,
    selectedPostId,
    setSelectedPostId,
    onPostUpdate,
    access_identifier,
    emojiPickerRef,
  } = props;
  const [media, setMedia] = useState<(string | File)[]>(
    selectedMedia ? selectedMedia : []
  );
  const [audio, setAudio] = useState<Blob | string | undefined>(
    selectedAudio ? selectedAudio : undefined
  );
  const [isScopeModal, setIsScopeModal] = useState(false);
  const [isPreviewModal, setIsPreviewModal] = useState(false);
  const [selectedScope, setSelectedScope] = useState<ScopeType>(0);
  const [isPublishModal, setIsPublishModal] = useState(false);
  const [postText, setPostText] = useState(description ? description : "");
  const [isChanged, setIsChanged] = useState(false);
  const [price, setPrice] = useState(0);

  const [
    uploadMedia,
    { isLoading: uploading, isError: isUploadError, error: uploadError },
  ] = useUploadMediaMutation();

  const [createPost, { isLoading, isSuccess, isError, error }] =
    useCreatePostMutation();

  const [
    updatePost,
    {
      isSuccess: isUpdated,
      isError: isUpdateError,
      error: updateError,
      data: updatedPost,
    },
  ] = useUpdatePostMutation();

  const scopeModalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!scopeModalRef.current?.contains(e.target as Node)) {
        setIsScopeModal(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => {
      document.removeEventListener("mousedown", handler);
    };
  });

  const [thumbnail, setThumbnail] = useState<(File | string)[]>(
    selectedThumbnail ? selectedThumbnail : []
  );
  const [teaser, setTeaser] = useState<(File | string)[]>(
    selectedTeaser ? selectedTeaser : []
  );
  const styles = useStyles(isScopeModal);
  const primary = theme.palette.primary;

  const user = useAppSelector((state) => state.auth.user);

  const [isPublishDisabled, setIsPublishDisabled] = useState(true);
  const areAllFieldsFilled = (): boolean => {
    if (postType === "TEXT" && postText.length === 0) return false;
    if ((postType === "IMAGE" || postType === "VIDEO") && media.length === 0)
      return false;
    if (postType === "AUDIO" && !audio) return false;
    return true;
  };

  useEffect(() => {
    setIsPublishDisabled(!areAllFieldsFilled());
  }, [postType, postText, media, audio, thumbnail, teaser]);

  const user_id = {
    _id: user?.id || "",
    displayName: user?.displayName || "",
    profile_picture: user?.profile_picture || "",
  };

  const resolveScope = (): { value: string; title: string } => {
    if (selectedScope === 0)
      return { value: "Free", title: "Free for everyone" };
    else if (selectedScope === 1)
      return { value: "Subscription", title: "Only Fans" };
    else if (selectedScope === 2) return { value: "Paid", title: "Exclusive" };
    else return { value: "", title: "" };
  };

  const resolvePostType = (): PostContentType => {
    if (postType === "TEXT" && media.length) return "TEXT";
    else if (postType === "IMAGE") return "IMAGE";
    else if (postType === "VIDEO") return "VIDEO";
    else if (postType === "AUDIO") return "AUDIO";
    else return "TEXT";
  };

  const resolveMedia = (): string[] => {
    if (postType === "IMAGE") {
      const mediaUrls = media?.map((item) => {
        if (typeof item === "string") return item;
        else return URL?.createObjectURL(item);
      });
      return mediaUrls;
    }
    return [];
  };

  const handlePreviewDisabled = (): boolean => {
    if (postType === "TEXT" && postText.length) return false;
    else if ((postType === "IMAGE" || postType === "VIDEO") && media.length)
      return false;
    else if (postType === "AUDIO" && audio) return false;
    else return true;
  };

  const handleChangeScope = (scope: ScopeType) => {
    setIsChanged(true);
    setSelectedScope(scope);
    setTimeout(() => {
      setIsScopeModal(false);
    }, 200);
  };

  const handleSubmitPost = async () => {
    setIsPublishDisabled(true);
    let mediaUrls: string[] = [];
    let thumbnailUrls: string[] = [];
    let teaserUrls: string[] = [];

    const formData = new FormData();
    if (postType !== "TEXT") {
      media.forEach((file) => {
        if (file instanceof File) {
          formData.append("files", file);
        }
      });
    }

    if (isEditPost) {
      const previousMediaUrls = media.filter(
        (item) => typeof item === "string"
      ) as string[];
      mediaUrls = previousMediaUrls;
    }

    if (audio instanceof Blob) {
      formData.append("files", audio);
    }

    if (postType !== "TEXT") {
      const uploadResponse = await uploadMedia(formData).unwrap();
      mediaUrls = [...mediaUrls, ...uploadResponse.data];
    }

    if (postType === "VIDEO") {
      const thumbnailFormData = new FormData();
      const teaserFormData = new FormData();

      thumbnail.forEach((file) => {
        if (file instanceof File) {
          thumbnailFormData.append("files", file);
        }
      });

      teaser.forEach((file) => {
        if (file instanceof File) {
          teaserFormData.append("files", file);
        }
      });

      const thumbnailResponse = await uploadMedia(thumbnailFormData).unwrap();
      thumbnailUrls = thumbnailResponse.data;

      const teaserResponse = await uploadMedia(teaserFormData).unwrap();
      teaserUrls = teaserResponse.data;
    }

    const newPost: NewPost = {
      user_id: user?.id,
      type: resolvePostType(),
      description: postText,
      access_identifier: resolveScope().value.toUpperCase(),
      price: price,
    };

    if (postType === "IMAGE") {
      if (mediaUrls.length > 0) {
        newPost.images = mediaUrls;
      }
    } else if (postType === "VIDEO") {
      if (mediaUrls.length > 0) {
        newPost.video_url = mediaUrls[0];
      }
      if (thumbnailUrls.length > 0) {
        newPost.thumbnail_url = thumbnailUrls[0];
      }
      if (teaserUrls.length > 0) {
        newPost.teaser_url = teaserUrls[0];
      }
    } else if (postType === "AUDIO") {
      if (mediaUrls.length > 0) {
        newPost.audio_url = mediaUrls[0];
      }
    }

    const updateData: Partial<NewPost> = {};
    if (isEditPost) {
      if (newPost.video_url) updateData.video_url = newPost.video_url;
      if (newPost.thumbnail_url)
        updateData.thumbnail_url = newPost.thumbnail_url;
      if (newPost.teaser_url) updateData.teaser_url = newPost.teaser_url;
      if (newPost.audio_url) updateData.audio_url = newPost.audio_url;
      if (newPost.images) updateData.images = newPost.images;

      await updatePost({
        id: selectedPostId || "",
        body: { ...newPost, ...updateData },
      }).unwrap();
    } else {
      await createPost(newPost).unwrap();
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === "" || parseInt(value, 10) >= 0) {
      setPrice(value === "" ? 0 : parseInt(value, 10));
    }
  };

  useEffect(() => {
    if (uploading) {
      toast("Uploading...", { autoClose: false, isLoading: true });
    } else if (uploadError) {
      setIsPublishDisabled(false);
      toast.dismiss();
      const error = uploadError as ApiError;
      toast.error(error?.data?.message);
    }
    return () => {
      toast.dismiss();
    };
  }, [uploading, isUploadError]);

  useEffect(() => {
    if (isLoading) {
      toast.loading(`Posting...`);
    } else if (isSuccess) {
      toast.dismiss();
      setPostText("");
      setMedia([]);
      setAudio(undefined);
      setThumbnail([]);
      setTeaser([]);
      setIsPublishModal(true);
      setIsPublishDisabled(false);
    } else if (isError) {
      setIsPublishDisabled(false);
      const validationError = error as ValidationError;
      const errorMessage = validationError.data.data?.errors?.[0]?.msg;
      if (errorMessage) {
        toast(errorMessage, { type: "error" });
      }
      const apiError = error as ApiError;
      if (apiError?.data?.message && !errorMessage) {
        toast(apiError?.data?.message, { type: "error" });
      }
    }
  }, [isSuccess, isError, isLoading]);

  const resolveAccessIdentifier = (access_identifier: string) => {
    if (access_identifier === "FREE") return "Free for everyone";
    else if (access_identifier === "SUBSCRIPTION") return "Only Fans";
    else if (access_identifier === "PAID") return "Exclusive";
    else return "";
  };

  useEffect(() => {
    if (isUpdated) {
      toast.dismiss();
      toast.success("updated successfully");
      onPostUpdate ? onPostUpdate(updatedPost.data?.post) : () => {};
      setSelectedPostId ? setSelectedPostId("") : () => {};
    } else if (isUpdateError) {
      const validationError = updateError as ValidationError;
      const errorMessage = validationError.data.data?.errors?.[0]?.msg;
      if (errorMessage) {
        toast(errorMessage, { type: "error" });
      }
      const apiError = updateError as ApiError;
      if (apiError?.data?.message && !errorMessage) {
        toast(apiError?.data?.message, { type: "error" });
      }
    }
  }, [isUpdated, isUpdateError]);

  return (
    <Box component="div" sx={styles.upperContainer} padding={4} mb={2}>
      <AddPostInput
        postText={postText}
        postType={postType}
        setPostText={setPostText}
        isEmojiOpen={isEmojiOpen}
        setIsEmojiOpen={setIsEmojiOpen}
        emojiPickerRef={emojiPickerRef}
      />
      {postType === "IMAGE" && <PostImage media={media} setMedia={setMedia} />}
      {postType === "VIDEO" && (
        <PostVideo
          media={media}
          setMedia={setMedia}
          setThumbnail={setThumbnail}
          thumbnail={thumbnail}
          teaser={teaser}
          setTeaser={setTeaser}
        />
      )}
      {postType === "AUDIO" && <PostAudio audio={audio} setAudio={setAudio} />}
      <Box sx={styles.buttonContainer} mt={3}>
        <Box>
          {isEditPost ? (
            postType === "TEXT" && (
              <AddPostButton
                title="Text"
                type={"TEXT"}
                postType={postType}
                Icon={AddTextIcon}
                setPostType={setPostType}
                setMedia={setMedia}
                setIsEmojiOpen={setIsEmojiOpen}
                isEditPost={isEditPost}
              />
            )
          ) : (
            <AddPostButton
              title="Text"
              type={"TEXT"}
              postType={postType}
              Icon={AddTextIcon}
              setPostType={setPostType}
              setMedia={setMedia}
              setIsEmojiOpen={setIsEmojiOpen}
              isEditPost={isEditPost}
            />
          )}
          {isEditPost ? (
            postType === "IMAGE" && (
              <AddPostButton
                title="Image"
                type={"IMAGE"}
                postType={postType}
                Icon={AddImageIcon}
                setPostType={setPostType}
                setMedia={setMedia}
                setIsEmojiOpen={setIsEmojiOpen}
                isEditPost={isEditPost}
              />
            )
          ) : (
            <AddPostButton
              title="Image"
              type={"IMAGE"}
              postType={postType}
              Icon={AddImageIcon}
              setPostType={setPostType}
              setMedia={setMedia}
              setIsEmojiOpen={setIsEmojiOpen}
              isEditPost={isEditPost}
            />
          )}
          {isEditPost ? (
            postType === "VIDEO" && (
              <AddPostButton
                title="Video"
                type={"VIDEO"}
                postType={postType}
                Icon={AddVideoIcon}
                setPostType={setPostType}
                setMedia={setMedia}
                setIsEmojiOpen={setIsEmojiOpen}
                isEditPost={isEditPost}
              />
            )
          ) : (
            <AddPostButton
              title="Video"
              type={"VIDEO"}
              postType={postType}
              Icon={AddVideoIcon}
              setPostType={setPostType}
              setMedia={setMedia}
              setIsEmojiOpen={setIsEmojiOpen}
              isEditPost={isEditPost}
            />
          )}
          {isEditPost ? (
            postType === "AUDIO" && (
              <AddPostButton
                title="Audio"
                type={"AUDIO"}
                postType={postType}
                Icon={AddAudioIcon}
                setPostType={setPostType}
                setMedia={setMedia}
                setIsEmojiOpen={setIsEmojiOpen}
                isEditPost={isEditPost}
              />
            )
          ) : (
            <AddPostButton
              title="Audio"
              type={"AUDIO"}
              postType={postType}
              Icon={AddAudioIcon}
              setPostType={setPostType}
              setMedia={setMedia}
              setIsEmojiOpen={setIsEmojiOpen}
              isEditPost={isEditPost}
            />
          )}
        </Box>
        <Box sx={styles.buttonBar}>
          <Box sx={{ position: "relative" }}>
            <Button
              onClick={() => setIsScopeModal(!isScopeModal)}
              sx={{ marginRight: 2 }}
            >
              <GlobeIcon />
              <Typography mx={1} sx={styles.text}>
                {access_identifier && !isChanged
                  ? resolveAccessIdentifier(access_identifier)
                  : resolveScope().title}
              </Typography>
              <ArrowDownIcon />
            </Button>
            <Box sx={styles.scopeModalContainer} ref={scopeModalRef}>
              <Button
                fullWidth
                onClick={() => handleChangeScope(0)}
                sx={{
                  ...styles.scopeButton,
                  color: "rgba(51, 51, 51, 1)",
                  textWrap: "nowrap",
                  fontSize: "12px",
                }}
              >
                Free for everyone
              </Button>
              <Button
                fullWidth
                onClick={() => handleChangeScope(1)}
                sx={{
                  ...styles.scopeButton,
                  color:
                    selectedScope === 1 ? primary.main : "rgba(51, 51, 51, 1)",
                  fontSize: "12px",
                }}
              >
                Only Fans
              </Button>
              <Button
                fullWidth
                onClick={() => handleChangeScope(2)}
                sx={{
                  ...styles.scopeButton,
                  color:
                    selectedScope === 2 ? primary.main : "rgba(51, 51, 51, 1)",
                  fontSize: "12px",
                }}
              >
                Exclusive
              </Button>
            </Box>
          </Box>
          {selectedScope === 2 && (
            <TextField
              name="price"
              placeholder="Price"
              value={price === 0 ? "" : price}
              sx={styles.priceInput}
              onChange={handleChange}
              inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
            />
          )}
          <Button
            disabled={handlePreviewDisabled()}
            onClick={() => setIsPreviewModal(true)}
            sx={{
              textTransform: "initial",
              marginRight: 2,
              fontSize: "12px",
              height: "40px",
              color: "",
              [theme.breakpoints.down(400)]: {
                marginRight: 0,
              },
            }}
          >
            Preview
          </Button>
          <CustomModal
            open={isPreviewModal}
            setOpen={setIsPreviewModal}
            width="50%"
            noPadding
          >
            <Post
              _id={""}
              isPreview
              description={postText}
              isLiked={false}
              type={resolvePostType()}
              createdAt={new Date().toISOString()}
              updatedAt={new Date().toISOString()}
              user_id={user_id}
              username={user?.username || ""}
              images={resolveMedia()}
              video_url={resolveContentLink(media[0])}
              audio_url={audio ? resolveContentLink(audio) : undefined}
              thumbnail_url={thumbnail[0] as string}
              teaser_url={teaser[0] as string}
            />
          </CustomModal>
          <Button
            onClick={handleSubmitPost}
            variant="contained"
            sx={styles.publishButton}
            disabled={isPublishDisabled || (selectedScope === 2 && price === 0)}
          >
            Publish
          </Button>
          <CustomModal
            open={isPublishModal}
            setOpen={setIsPublishModal}
            width="25%"
            padding={3}
            paddingHorizontal={true}
          >
            <ThankYouModal
              heading="Successfully Published!"
              subHeading="Your post has been published successfully. You can see it in
                your profile."
              closeModal={setIsPublishModal}
            />
          </CustomModal>
        </Box>
      </Box>
    </Box>
  );
}

const useStyles = (isScopeModal: boolean) => {
  return createStyles({
    upperContainer: {
      backgroundColor: "rgba(243, 241, 241, 1)",
      width: "85%",
      borderRadius: 4,
      display: "flex",
      flexDirection: "column",
      [theme.breakpoints.down(600)]: {
        width: "83%",
      },
      [theme.breakpoints.down(400)]: {
        width: "91%",
        padding: 2,
      },
    },
    textBox: {
      display: "flex",
      flexDirection: "row",
      backgroundColor: "rgba(255, 255, 255, 1)",
      borderRadius: 10,
      position: "relative",
    },
    buttonContainer: {
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-between",
      // alignItems: "center",
      [theme.breakpoints.down(600)]: {
        flexDirection: "column",
      },
    },
    publishButton: {
      borderRadius: 5,
      paddingLeft: 3,
      paddingRight: 3,
      paddingTop: 0.5,
      paddingBottom: 0.5,
      textTransform: "initial",
      height: "40px",
      fontSize: "12px",
      [theme.breakpoints.down(600)]: {
        height: "30px",
      },
    },
    scopeButton: {
      justifyContent: "flex-start",
      textTransform: "initial",
      fontSize: 15,
    },
    scopeModalContainer: {
      position: "absolute",
      display: isScopeModal ? "flex" : "none",
      flexDirection: "column",
      alignItems: "flex-start",
      justifyContent: "center",
      backgroundColor: "white",
      borderRadius: "13px",
      width: "80%",
      boxShadow: "10",
      left: "15%",
    },
    confirm: {
      marginTop: 4,
      borderRadius: 10,
      width: "50%",
      height: 40,
    },
    publishModal: {
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
    },
    buttonBar: {
      alignItems: "center",
      display: "flex",
      flexDirection: "row",
      [theme.breakpoints.down(600)]: {
        marginTop: "30px",
      },
      zIndex: 999,
    },
    priceInput: {
      width: "100px",
      "& .MuiInputBase-input": {
        height: "5px",
        [theme.breakpoints.down(600)]: {
          height: 0,
        },
      },
      '& input[type="number"]::-webkit-outer-spin-button, & input[type="number"]::-webkit-inner-spin-button':
        {
          "-webkit-appearance": "none",
          margin: 0,
        },
      '& input[type="number"]': {
        "-moz-appearance": "textfield",
      },
      [theme.breakpoints.down(600)]: {
        width: "100%",
        minWidth: "60px",
      },
    },
    text: {
      textTransform: "initial",
      color: "black",
      fontSize: "12px",
      maxWidth: "75px",
      paddingLeft: "10px",
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis",
    },
  });
};
