import { Box, IconButton, Typography } from "@mui/material";
import RecordActionButton from "./RecordActionButton";
import { useEffect, useRef, useState } from "react";
import RecordButton from "./RecordButton";
import { ReactComponent as AttachRecordingIcon } from "../assets/svg/attachRecording.svg";
import { ReactComponent as DeleteRecordingIcon } from "../assets/svg/deleteRecording.svg";
import { ReactComponent as AudioPlayIcon } from "../assets/svg/audioPlay.svg";
import { ReactComponent as PauseIcon } from "../assets/svg/pause.svg";
import { createStyles } from "@mui/styles";
import { useAudioRecorder } from "react-audio-voice-recorder";
import { toast } from "react-toastify";
import WaveSurfer from "wavesurfer.js";
import theme from "../themes";
import { formatTime } from "../utils/helper";
import { CiMicrophoneOn } from "react-icons/ci";
import { IoPauseOutline } from "react-icons/io5";
import { RxResume } from "react-icons/rx";
import { MdUpload } from "react-icons/md";

interface Props {
  audio?: Blob | string;
  setAudio: (value?: Blob | string) => void;
}

export default function PostAudio(props: Props) {
  const { audio, setAudio } = props;
  const [hasMicrophone, setHasMicrophone] = useState(false);
  const [audioDuration, setAudioDuration] = useState(0);
  const [isRecordingOn, setIsRecordingOn] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [isAttached, setIsAttached] = useState(false);
  const waveformRef = useRef<HTMLDivElement | null>(null);
  const [waveSurfer, setWaveSurfer] = useState<WaveSurfer | null>(null);
  const styles = useStyles(isRecordingOn);
  const [currentPlayTime, setCurrentPlayTime] = useState(0);

  const {
    startRecording,
    stopRecording,
    togglePauseResume,
    recordingBlob,
    isRecording,
    isPaused,
    recordingTime,
  } = useAudioRecorder();

  const handleRecording = () => {
    if (!hasMicrophone) {
      toast("Microphone not connected! After connecting please refresh", {
        type: "error",
      });
      return;
    }

    if (isRecording) {
      togglePauseResume();
    } else if (isPaused) {
      startRecording();
    } else {
      startRecording();
    }
  };

  const handleAudioPlayPause = () => {
    if (waveSurfer) {
      setIsPlayingAudio(!isPlayingAudio);
      waveSurfer.playPause();
    }
  };

  const handleDeleteAudioFile = () => {
    if (waveSurfer) {
      waveSurfer.stop();
    }
    stopRecording();
    setAudio(undefined);
    setIsAttached(false);
    setAudioDuration(0);
  };

  const handleAttachment = () => {
    setIsAttached(true);
    stopRecording();
  };

  useEffect(() => {
    if (recordingBlob) {
      setAudio(recordingBlob);
    }
  }, [recordingBlob]);

  useEffect(() => {
    if (isRecording || isPaused) {
      setIsRecordingOn(isRecording);
    } else {
      setIsRecordingOn(false);
    }
  }, [isRecording, isPaused]);

  useEffect(() => {
    const checkMicrophone = async () => {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const hasMic = devices.some((device) => device.kind === "audioinput");
        setHasMicrophone(hasMic);
      } catch (error) {
        console.error("Error checking microphone:", error);
      }
    };

    checkMicrophone();
  }, []);

  useEffect(() => {
    if (waveSurfer) {
      waveSurfer.on("ready", () => {
        setAudioDuration(Math.floor(waveSurfer.getDuration()));
      });

      waveSurfer.on("finish", () => {
        setIsPlayingAudio(false);
        setCurrentPlayTime(0);
        waveSurfer.seekTo(0);
      });

      waveSurfer.on("audioprocess", () => {
        setCurrentPlayTime(Math.floor(waveSurfer.getCurrentTime()));
      });
    }
  }, [waveSurfer]);

  useEffect(() => {
    if (audio && !waveformRef.current?.childElementCount) {
      const ws = WaveSurfer.create({
        container: waveformRef.current as HTMLElement,
        waveColor: "rgba(0, 0, 0, 1)",
        progressColor: theme.palette.primary.main,
        barGap: 5,
        barWidth: 5,
        barRadius: 10,
        cursorColor: "transparent",
      });
      if (typeof audio === "string") ws.load(audio);
      else ws.loadBlob(audio);
      setWaveSurfer(ws);
      setIsAttached(true);
    }

    return () => {
      if (waveSurfer) {
        waveSurfer.destroy();
      }
    };
  }, [audio]);

  return (
    <Box sx={{ display: "flex", flexDirection: "column" }}>
      <Box
        sx={{ display: "flex", flexDirection: "row", alignItems: "center" }}
        mt={4}
      >
        <RecordActionButton
          title={isRecordingOn ? (isPaused ? "Resume" : "Pause") : "Start"}
          onClick={handleRecording}
          icon={
            isRecordingOn
              ? isPaused
                ? RxResume
                : IoPauseOutline
              : CiMicrophoneOn
          }
        />
        <RecordActionButton
          title="Upload"
          setAudio={setAudio}
          audio={audio}
          setIsAttached={setIsAttached}
          icon={MdUpload}
        />
      </Box>
      <Box sx={styles.recorder}>
        {!audio || !isAttached ? (
          <Box sx={styles.recordingIndicator}></Box>
        ) : (
          <IconButton size="large" onClick={handleAudioPlayPause}>
            {isPlayingAudio ? (
              <PauseIcon height={15} width={15} />
            ) : (
              <AudioPlayIcon height={15} width={15} />
            )}
          </IconButton>
        )}
        <Box sx={{ minWidth: 50 }} mr={1}>
          <Typography>
            {formatTime(
              isRecordingOn
                ? recordingTime
                : isPlayingAudio
                ? currentPlayTime
                : audioDuration
            )}
          </Typography>
        </Box>
        <div
          ref={waveformRef}
          style={{
            width: "25%",
            display: audio && isAttached ? "block" : "none",
          }}
        />
        {!isAttached && (
          <RecordButton
            title="Attach"
            color={"rgba(12, 143, 252, 1)"}
            Icon={AttachRecordingIcon}
            onClick={handleAttachment}
            disabled={!isRecording}
          />
        )}
        {isAttached && (
          <RecordButton
            title="Delete"
            color={"rgba(187, 44, 36, 1)"}
            Icon={DeleteRecordingIcon}
            onClick={handleDeleteAudioFile}
          />
        )}
      </Box>
    </Box>
  );
}

const useStyles = (isRecordingOn: boolean) =>
  createStyles({
    recordingIndicator: {
      height: 10,
      width: 10,
      backgroundColor: isRecordingOn ? "red" : "gray",
      borderRadius: "50%",
      marginRight: 1,
    },
    recorder: {
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      height: 130,
      marginLeft: 1,
    },
  });
