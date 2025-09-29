"use client";

import React, { useState, useRef, useEffect } from "react";
import Howler from "react-howler";
import { tracks } from "./track";
import Slider from "@mui/material/Slider";
import { Box, Button, IconButton, Stack, Typography } from "@mui/material";
import {
  Pause,
  PauseCircleOutline,
  PlayArrow,
  PlayCircleOutline,
  SkipNext,
  SkipPrevious,
  VolumeOff,
  VolumeUp,
} from "@mui/icons-material";

type TrackType = "calm" | "upbeat";

const Playlist = () => {
  const [playlistType, setPlaylistType] = useState<TrackType>("calm");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [seek, setSeek] = useState(0);
  const [duration, setDuration] = useState(0);
  const [progress, setProgress] = React.useState(0);
  const [volume, setVolume] = useState(1.0);

  const howlerRef = useRef<Howler | null>(null);

  const currentTrack = tracks.filter((t) => t.type === playlistType)[
    currentIndex
  ];

  useEffect(() => {
    if (howlerRef.current) {
      const sound = howlerRef.current as any;
      if (sound?.howler) {
        setDuration(sound.howler.duration());
      }
    }
  }, [currentTrack]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (playing) {
      interval = setInterval(() => {
        if (howlerRef.current) {
          const sound = howlerRef.current as any;
          if (sound?.howler) {
            setSeek(sound.howler.seek());
            setDuration(sound.howler.duration());
            setProgress((sound.howler.seek() / sound.howler.duration()) * 100);
          }
        }
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [playing]);

  const playNext = () => {
    const list = tracks.filter((t) => t.type === playlistType);
    setCurrentIndex((prev) => (prev + 1) % list.length);
  };

  const playPrev = () => {
    const list = tracks.filter((t) => t.type === playlistType);
    setCurrentIndex((prev) => (prev - 1 + list.length) % list.length);
  };

  useEffect(() => {
    if ("mediaSession" in navigator && currentTrack) {
      navigator.mediaSession.metadata = new MediaMetadata({
        title: currentTrack.title,
        artist: currentTrack.artist,
        artwork: [
          {
            src: "/default-cover.png",
            sizes: "512x512",
            type: "image/png",
          },
        ],
      });

      navigator.mediaSession.setActionHandler("play", () => setPlaying(true));
      navigator.mediaSession.setActionHandler("pause", () => setPlaying(false));

      navigator.mediaSession.setActionHandler("seekbackward", () => {
        if (howlerRef.current) {
          const sound = (howlerRef.current as any).howler;
          sound.seek(Math.max(0, sound.seek() - 10));
        }
      });

      navigator.mediaSession.setActionHandler("seekforward", () => {
        if (howlerRef.current) {
          const sound = (howlerRef.current as any).howler;
          sound.seek(Math.min(duration, sound.seek() + 10));
        }
      });

      navigator.mediaSession.setActionHandler("previoustrack", playPrev);
      navigator.mediaSession.setActionHandler("nexttrack", playNext);
    }
  }, [currentTrack, duration, playNext, playPrev]);

  return (
    <div className="p-4 rounded-lg shadow-md bg-gray-900 text-white w-full overflow-hidden">
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-4">
          <Box>
            <IconButton
              onClick={() => setPlaying(!playing)}
              className="p-6 rounded-full border border-gray-400 text-gray-400"
            >
              {playing ? (
                <Pause className="w-12 h-12" />
              ) : (
                <PlayArrow className="w-12 h-12" />
              )}
            </IconButton>
          </Box>
          <div>
            <div>
              <h2 className="text-lg font-bold">{currentTrack.title}</h2>
              <p className="text-sm text-gray-400">{currentTrack.artist}</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-center gap-4">
          <Typography variant="body2" className="text-gray-400">
            Mood:
          </Typography>
          <Stack direction="row" spacing={1}>
            <Button
              size="small"
              onClick={() => {
                setPlaylistType("calm");
                setCurrentIndex(0);
              }}
              variant={playlistType === "calm" ? "contained" : "outlined"}
            >
              Calm
            </Button>
            <Button
              size="small"
              variant={playlistType === "upbeat" ? "contained" : "outlined"}
              onClick={() => {
                setPlaylistType("upbeat");
                setCurrentIndex(0);
              }}
            >
              Upbeat
            </Button>
          </Stack>
        </div>
      </div>

      <Howler
        src={currentTrack.url}
        playing={playing}
        ref={howlerRef}
        html5={true}
        onEnd={playNext}
        volume={volume}
      />

      <div className="mt-2 text-sm relative">
        <Slider
          size="small"
          value={progress || 0}
          onChange={(_, value) => {
            if (howlerRef.current) {
              const sound = howlerRef.current as any;
              if (sound?.howler && duration) {
                sound.howler.seek(((value as number) * duration) / 100);
                setSeek(((value as number) * duration) / 100);
              }
            }
            setProgress(value as number);
          }}
        />

        <Typography
          variant="caption"
          className="absolute left-0 -bottom-2 text-gray-400"
        >
          {new Date(seek * 1000).toISOString().substring(14, 19)}
        </Typography>

        <div className="absolute right-0 -top-6 flex items-center gap-4">
          <div className="flex items-center gap-2">
            <IconButton onClick={playPrev} className="text-gray-400 p-1">
              <SkipPrevious />
            </IconButton>

            <IconButton onClick={playNext} className="text-gray-400 p-1">
              <SkipNext />
            </IconButton>
          </div>
          <div>
            {/* mute */}
            <IconButton
              onClick={() => {
                setVolume(volume === 0 ? 1.0 : 0);
              }}
              className="text-gray-400 p-1"
            >
              {volume === 0 ? <VolumeOff /> : <VolumeUp />}
            </IconButton>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Playlist;
