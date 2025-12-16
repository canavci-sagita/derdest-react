"use client";

import { useReactMediaRecorder } from "react-media-recorder";
import { useState, useEffect, useRef } from "react";
import { Spin } from "antd";
import { toBase64 } from "@/lib/utils/file.utils";
import AppIcon from "../../common/ui/AppIcon";
import { twMerge } from "tailwind-merge";
import Button from "../../common/ui/Button";
import { formatTime } from "@/lib/utils/date.utils";
import { useTranslation } from "@/stores/TranslationContext";
import { transcribeAudioFileAction } from "@/actions/cases.actions";
import { v4 as uuidv4 } from "uuid";
import { FileUploadRequest } from "@/services/common/FileUploadRequest";

interface CaseAudioRecorderProps {
  onProcess: (transcribedText: string, fileName: string) => void;
}

const CaseAudioRecorder: React.FC<CaseAudioRecorderProps> = ({ onProcess }) => {
  const { t } = useTranslation();

  const audioRef = useRef<HTMLAudioElement>(null);

  const {
    status,
    startRecording,
    stopRecording,
    pauseRecording,
    resumeRecording,
    mediaBlobUrl,
    clearBlobUrl,
  } = useReactMediaRecorder({
    audio: true,
    blobPropertyBag: { type: "audio/webm" },
  });

  const [isProcessing, setIsProcessing] = useState(false);
  const [duration, setDuration] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const handleStart = () => {
    setError(null);
    setDuration(0);
    setProgress(0);

    if (status === "stopped") {
      clearBlobUrl();
    } else {
      startRecording();
    }
  };

  const handleStop = () => {
    stopRecording();
    setIsPlaying(false);
  };

  const handleProcessAudio = async () => {
    if (!mediaBlobUrl) return;
    setIsProcessing(true);
    try {
      const response = await fetch(mediaBlobUrl);
      const blob = await response.blob();
      const file = new File([blob], `${uuidv4()}.webm`, { type: "audio/webm" });

      const maxFileSize = 10 * 1024 * 1024;
      if (file.size > maxFileSize) {
        setError(t("maxFileSize", { "0": 10 }));
        return;
      }

      const base64Audio = await toBase64(file);

      const request: FileUploadRequest = {
        fileContent: base64Audio,
        fileName: file.name,
        fileSize: file.size,
      };
      const apiResponse = await transcribeAudioFileAction(request);
      if (apiResponse.isSuccess && apiResponse.result) {
        onProcess(apiResponse.result, request.fileName);
      } else {
        setError(apiResponse.messages[0]);
      }
    } catch {
      setError("An unexpected error occurred.");
      setIsProcessing(false);
    }
  };

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (status === "recording") {
      interval = setInterval(() => {
        setDuration((prev) => prev + 1);
      }, 1000);
    }

    if (status !== "recording") {
      clearInterval(interval!);
    }

    return () => clearInterval(interval!);
  }, [status]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateProgress = () => {
      if (audio.duration > 0) {
        setProgress((audio.currentTime / audio.duration) * 100);
      }
    };
    const handleEnd = () => setIsPlaying(false);

    audio.addEventListener("timeupdate", updateProgress);
    audio.addEventListener("ended", handleEnd);

    return () => {
      audio.removeEventListener("timeupdate", updateProgress);
      audio.removeEventListener("ended", handleEnd);
    };
  }, [mediaBlobUrl]);

  return (
    <div className="h-full flex flex-col">
      <div className="p-6 border border-slate-200 rounded-lg flex flex-col items-center justify-center h-full bg-slate-50">
        <p className="font-semibold text-slate-700 capitalize mb-4">
          {status === "idle"
            ? t("audioControls.readyToRecord")
            : t(`audioControls.${status}`)}
        </p>

        <div className="relative h-16 w-full flex items-center justify-center overflow-hidden">
          {mediaBlobUrl && <audio src={mediaBlobUrl} ref={audioRef} />}

          <div
            className={twMerge(
              "absolute transition-all duration-300",
              status !== "idle" && "opacity-0 -translate-x-full"
            )}
          >
            <button
              type="button"
              className="h-16 w-16 rounded-full text-white flex items-center justify-center shadow-lg bg-red-600 hover:bg-opacity-90 transition-colors disabled:cursor-not-allowed"
              onClick={handleStart}
              disabled={isProcessing}
            >
              <AppIcon className="h-5 w-5 stroke-2" icon="Mic" />
            </button>
          </div>
          <div
            className={twMerge(
              "h-full min-w-[360px] absolute transition-all duration-300 flex items-center justify-between bg-slate-200 rounded-full p-2",
              status === "idle" && "opacity-0 scale-x-0"
            )}
          >
            <div className="flex items-center flex-grow gap-3 ml-4">
              {status === "stopped" ? (
                <button
                  type="button"
                  className="h-8 w-8 p-2 rounded-full text-white flex items-center justify-center shadow-lg bg-black hover:bg-opacity-80 transition-colors"
                  onClick={togglePlay}
                >
                  <AppIcon
                    className="h-5 w-5 stroke-2"
                    icon={isPlaying ? "Pause" : "Play"}
                    fill="#ffffff"
                  />
                </button>
              ) : (
                <div className="w-4 h-4 bg-red-500 rounded-full animate-pulse"></div>
              )}

              {status === "stopped" ? (
                <div className="w-full h-2 bg-slate-300 rounded-full relative cursor-pointer">
                  <div
                    className="absolute h-2 bg-primary rounded-full"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
              ) : (
                <span className="font-mono text-slate-700">
                  {formatTime(duration)}
                </span>
              )}
            </div>
            <div className="flex items-center gap-2 ml-4">
              {(status === "recording" || status === "paused") && (
                <>
                  {status === "recording" && (
                    <button
                      type="button"
                      className="h-8 w-8 p-2 rounded-full text-white flex items-center justify-center shadow-lg bg-black hover:bg-opacity-80 transition-colors"
                      onClick={pauseRecording}
                    >
                      <AppIcon
                        className="h-5 w-5 stroke-2"
                        icon="Pause"
                        fill="#ffffff"
                      />
                    </button>
                  )}
                  {status === "paused" && (
                    <button
                      type="button"
                      className="h-8 w-8 p-2 rounded-full text-white flex items-center justify-center shadow-lg bg-black hover:bg-opacity-80 transition-colors"
                      onClick={resumeRecording}
                    >
                      <AppIcon
                        className="h-5 w-5 stroke-2"
                        icon="Play"
                        fill="#ffffff"
                      />
                    </button>
                  )}
                  <button
                    type="button"
                    className="h-8 w-8 p-2 rounded-full text-white flex items-center justify-center shadow-lg bg-black hover:bg-opacity-80 transition-colors"
                    onClick={handleStop}
                  >
                    <AppIcon
                      className="h-5 w-5 stroke-2"
                      icon="Square"
                      fill="#ffffff"
                    />
                  </button>
                </>
              )}
              {status === "stopped" && (
                <button
                  type="button"
                  className="h-8 w-8 p-2 rounded-full text-white flex items-center justify-center shadow-lg bg-black hover:bg-opacity-80 transition-colors"
                  onClick={handleStart}
                >
                  <AppIcon className="h-5 w-5 stroke-2" icon="RotateCcw" />
                </button>
              )}
            </div>
          </div>
        </div>
        {status === "stopped" && (
          <p className="text-sm text-slate-500 mt-4 text-center">
            {t("audioFileReady")}
          </p>
        )}
        {error && <p className="text-xs text-red-500 mt-5">{error}</p>}
      </div>
      <div className="self-center mt-4">
        {isProcessing ? (
          <Spin />
        ) : (
          <Button
            type="button"
            variant="outline-primary"
            disabled={status !== "stopped" || isProcessing}
            onClick={handleProcessAudio}
            className="mt-4"
            localizedLabel="processAudio"
          />
        )}
      </div>
    </div>
  );
};

export default CaseAudioRecorder;
