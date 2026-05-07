"use client";

import { useEffect, useRef, useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";

function PauseIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <rect x="6" y="4" width="4" height="16" rx="1" />
      <rect x="14" y="4" width="4" height="16" rx="1" />
    </svg>
  );
}

function PlayIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M8 5.14v13.72a1 1 0 001.5.86l11.04-6.86a1 1 0 000-1.72L9.5 4.28A1 1 0 008 5.14z" />
    </svg>
  );
}

function ExpandIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="15 3 21 3 21 9" />
      <polyline points="9 21 3 21 3 15" />
      <line x1="21" y1="3" x2="14" y2="10" />
      <line x1="3" y1="21" x2="10" y2="14" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

const AUTO_HIDE_MS = 3000;

function useAutoHide() {
  const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  const [isTapped, setIsTapped] = useState(false);

  function show() {
    setIsTapped(true);
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setIsTapped(false), AUTO_HIDE_MS);
  }

  useEffect(() => () => clearTimeout(timerRef.current), []);

  return { isTapped, showTapped: show };
}

export function VideoPlayer({ src, alt }: { src: string; alt: string }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const modalVideoRef = useRef<HTMLVideoElement>(null);

  const [isPlaying, setIsPlaying] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const { isTapped, showTapped } = useAutoHide();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalPlaying, setIsModalPlaying] = useState(true);
  const [isModalHovered, setIsModalHovered] = useState(false);
  const { isTapped: isModalTapped, showTapped: showModalTapped } =
    useAutoHide();

  const showControls = isHovered || isTapped || !isPlaying;
  const showModalControls = isModalHovered || isModalTapped || !isModalPlaying;

  function togglePlay() {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      video.play();
      setIsPlaying(true);
    } else {
      video.pause();
      setIsPlaying(false);
    }
  }

  function toggleModalPlay() {
    const video = modalVideoRef.current;
    if (!video) return;
    if (video.paused) {
      video.play();
      setIsModalPlaying(true);
    } else {
      video.pause();
      setIsModalPlaying(false);
    }
  }

  function handleVideoClick() {
    if (!showControls) {
      showTapped();
      return;
    }
    togglePlay();
    showTapped();
  }

  function handleModalVideoClick() {
    if (!showModalControls) {
      showModalTapped();
      return;
    }
    toggleModalPlay();
    showModalTapped();
  }

  function handleExpand(e: React.MouseEvent) {
    e.stopPropagation();
    setIsModalOpen(true);
  }

  function handleModalOpen() {
    videoRef.current?.pause();
    setIsModalPlaying(true);
  }

  function handleModalClose() {
    setIsModalOpen(false);
    if (isPlaying) {
      videoRef.current?.play();
    }
  }

  return (
    <Dialog.Root open={isModalOpen} onOpenChange={setIsModalOpen}>
      <div
        className="relative w-fit select-none"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <video
          ref={videoRef}
          src={src}
          autoPlay
          loop
          muted
          playsInline
          aria-label={alt}
          className="block rounded-xl"
        />

        <button
          type="button"
          onClick={handleVideoClick}
          className={`absolute inset-0 flex cursor-pointer items-center justify-center bg-transparent transition-opacity duration-300 ${showControls ? "opacity-100" : "opacity-0"}`}
        >
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur-sm">
            {isPlaying ? <PauseIcon /> : <PlayIcon />}
          </span>
        </button>

        <button
          type="button"
          onClick={handleExpand}
          className={`absolute right-2 bottom-2 z-10 flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg bg-black/60 text-white backdrop-blur-sm transition-opacity duration-300 hover:bg-black/80 ${showControls ? "opacity-100" : "pointer-events-none opacity-0"}`}
        >
          <ExpandIcon />
        </button>
      </div>

      <Dialog.Portal>
        <Dialog.Overlay className="data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 fixed inset-0 z-50 bg-black/50 backdrop-blur-md" />
        <Dialog.Content
          onOpenAutoFocus={(e) => e.preventDefault()}
          onAnimationStart={() => {
            if (isModalOpen) handleModalOpen();
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) handleModalClose();
          }}
          className="data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 fixed inset-0 z-50 flex items-center justify-center p-8"
        >
          <Dialog.Title className="sr-only">{alt}</Dialog.Title>
          <Dialog.Description className="sr-only">
            Expanded video view
          </Dialog.Description>

          <Dialog.Close
            onClick={handleModalClose}
            className="absolute top-4 right-4 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
          >
            <CloseIcon />
          </Dialog.Close>

          <button
            type="button"
            className="relative cursor-pointer border-none bg-transparent p-0 select-none"
            onClick={handleModalVideoClick}
            onMouseEnter={() => setIsModalHovered(true)}
            onMouseLeave={() => setIsModalHovered(false)}
          >
            <video
              ref={modalVideoRef}
              src={src}
              autoPlay
              loop
              muted
              playsInline
              aria-label={alt}
              className="block max-h-[65vh] rounded-xl"
            />
            <span
              className={`pointer-events-none absolute inset-0 flex items-center justify-center transition-opacity duration-300 ${showModalControls ? "opacity-100" : "opacity-0"}`}
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur-sm">
                {isModalPlaying ? <PauseIcon /> : <PlayIcon />}
              </span>
            </span>
          </button>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
