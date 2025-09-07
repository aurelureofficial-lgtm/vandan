/**
 * App.tsx
 * Simplified React-only Multi-step Birthday Flow (no external libraries)
 * -------------------------------------------------------------------
 * - Step 0: Tap the heart to enter
 * - Step 1: Greeting card (Lakshita)
 * - Step 2: Sweet treats card
 * - Step 3: Final card with auto-playing photo carousel, music, and lightweight confetti
 *
 * Usage:
 *  - Save as `src/App.tsx` in your React + Vite project (TypeScript or JS + JSX).
 *  - This file uses only React and native browser APIs — no `framer-motion` or `react-confetti` required.
 *  - Tailwind classes are used for quick styling; if you don't have Tailwind, the UI will still work but styling will be basic. You can replace classes or add your own CSS.
 *
 * Notes on the original error:
 *  - You saw `Missing semicolon` and missing dependency errors because the earlier file imported packages that were not installed. This version removes those imports and provides clean, valid TSX so Vite won't fail on missing modules or stray syntax.
 */

import React, { useEffect, useRef, useState } from "react";

const MUSIC_URL = "/https://github.com/aurelureofficial-lgtm/vandan/blob/main/ranjheya-ve-zain-zohaib-yratta-media_axDPrvzX.mp3"; // Replace with your own song if you want

const GALLERY_IMAGES = [
  "https://github.com/aurelureofficial-lgtm/vandan/blob/main/Image/1.webp",
  "https://github.com/aurelureofficial-lgtm/vandan/blob/main/Image/2.webp",
  "https://github.com/aurelureofficial-lgtm/vandan/blob/main/Image/3.webp",
  "https://github.com/aurelureofficial-lgtm/vandan/blob/main/Image/4.webp",
];

function useInterval(callback: () => void, delay: number | null) {
  const savedRef = useRef(callback);
  useEffect(() => {
    savedRef.current = callback;
  }, [callback]);
  useEffect(() => {
    if (delay === null) return;
    const id = setInterval(() => savedRef.current(), delay);
    return () => clearInterval(id);
  }, [delay]);
}

const ConfettiLayer: React.FC<{ active: boolean }> = ({ active }) => {
  const [pieces, setPieces] = useState<number[]>([]);
  useEffect(() => {
    if (!active) {
      setPieces([]);
      return;
    }
    // create pieces and remove after a while
    setPieces(Array.from({ length: 60 }, (_, i) => i));
    const t = setTimeout(() => setPieces([]), 6000);
    return () => clearTimeout(t);
  }, [active]);

  if (!active) return null;
  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
      {pieces.map((p) => {
        const left = Math.random() * 100;
        const size = 6 + Math.random() * 12;
        const bg = [
          "#F43F5E",
          "#FB923C",
          "#F59E0B",
          "#10B981",
          "#60A5FA",
          "#A78BFA",
        ][Math.floor(Math.random() * 6)];
        const delay = Math.random() * 1000;
        const duration = 3000 + Math.random() * 3000;
        const style: React.CSSProperties = {
          left: `${left}%`,
          width: size,
          height: size * 1.6,
          background: bg,
          transform: `rotate(${Math.random() * 360}deg)`,
          position: "absolute",
          top: -10,
          borderRadius: 2,
          opacity: 0.95,
          animation: `confetti-fall ${duration}ms ${delay}ms linear forwards`,
        };
        return <div key={p} style={style} />;
      })}
      <style>{`@keyframes confetti-fall { to { transform: translateY(110vh) rotate(360deg); opacity: 1; } }`}</style>
    </div>
  );
};

export default function App(): JSX.Element {
  const [step, setStep] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [showConfetti, setShowConfetti] = useState<boolean>(false);
  const [carouselIndex, setCarouselIndex] = useState<number>(0);
  const [autoAdvance, setAutoAdvance] = useState<boolean>(true);

  // initialize audio
  useEffect(() => {
    audioRef.current = new Audio(MUSIC_URL);
    if (audioRef.current) {
      audioRef.current.loop = true;
      audioRef.current.volume = 0.6;
    }
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (step === 3) {
      // slight delay for confetti pop
      setTimeout(() => setShowConfetti(true), 250);
      if (autoAdvance && audioRef.current) {
        audioRef.current.play().catch(() => {});
        setIsPlaying(true);
      }
    } else {
      setShowConfetti(false);
    }
  }, [step, autoAdvance]);

  // carousel auto-play when on final step
  useInterval(
    () => {
      if (step === 3) {
        setCarouselIndex((i) => (i + 1) % GALLERY_IMAGES.length);
      }
    },
    step === 3 ? 3000 : null
  );

  function nextStep(): void {
    setStep((s) => Math.min(3, s + 1));
  }
  function prevStep(): void {
    setStep((s) => Math.max(0, s - 1));
  }

  function togglePlay(): void {
    if (!audioRef.current) return;
    if (!isPlaying) {
      audioRef.current.play().catch(() => {});
      setIsPlaying(true);
    } else {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-100 via-purple-100 to-yellow-50 p-4">
      <ConfettiLayer active={showConfetti} />

      {step === 0 && (
        <div className="text-center">
          <button
            aria-label="start"
            onClick={nextStep}
            className="text-7xl transform-gpu animate-pulse"
            style={{ background: "none", border: "none" }}
          >
            💖
          </button>
          <div className="mt-4 text-lg font-medium">Tap the heart to enter</div>
        </div>
      )}

      {step === 1 && (
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-xl text-center">
          <div className="text-sm uppercase text-gray-500">A tiny wish</div>
          <h1 className="mt-2 text-4xl font-extrabold text-pink-600">
            Happy Birthday, <span className="text-rose-500">Lakshita</span>!
          </h1>
          <p className="mt-4 text-gray-700">
            Wishing you a day filled with giggles, cake, and cozy hugs 💕
          </p>
          <div className="mt-6 flex justify-center gap-3">
            <button
              onClick={prevStep}
              className="px-4 py-2 rounded-lg bg-gray-200"
            >
              ◀ Back
            </button>
            <button
              onClick={nextStep}
              className="px-4 py-2 rounded-lg bg-pink-500 text-white"
            >
              Next →
            </button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-xl text-center">
          <h2 className="text-2xl font-semibold text-purple-600">
            Sweet treats for you 🍬🧁
          </h2>
          <div className="mt-6 text-6xl flex justify-center gap-6">🧁🍭🍩</div>
          <p className="mt-4 text-gray-600">
            Because birthdays should be extra sweet!
          </p>
          <div className="mt-6 flex justify-center gap-3">
            <button
              onClick={prevStep}
              className="px-4 py-2 rounded-lg bg-gray-200"
            >
              ◀ Back
            </button>
            <button
              onClick={nextStep}
              className="px-4 py-2 rounded-lg bg-purple-500 text-white"
            >
              Next →
            </button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="bg-white rounded-2xl shadow-lg p-6 max-w-3xl w-full">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-pink-600">
              🎉 Happy Birthday, Lakshita! 🎉
            </h1>
            <div className="flex items-center gap-2">
              <label  className="text-sm">Auto-play photos</label>
              <input
                type="checkbox"
                checked={autoAdvance}
                onChange={(e) => setAutoAdvance(e.target.checked)}
              />
            </div>
          </div>

          <p className="mt-2 text-gray-700">
            May your day be filled with love, laughter, and memories 💖
          </p>

          <div className="mt-6 relative h-80 rounded-lg overflow-hidden bg-gray-100">
            <img
              src={GALLERY_IMAGES[carouselIndex]}
              alt={`photo-${carouselIndex}`}
              className="w-full h-full object-cover transition-opacity duration-700"
              key={carouselIndex}
            />
            <div className="absolute left-3 top-1/2 -translate-y-1/2">
              <button
                onClick={() =>
                  setCarouselIndex(
                    (i) =>
                      (i - 1 + GALLERY_IMAGES.length) % GALLERY_IMAGES.length
                  )
                }
                className="px-3 py-2 bg-white/80 rounded-full"
              >
                ◀
              </button>
            </div>
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <button
                onClick={() =>
                  setCarouselIndex((i) => (i + 1) % GALLERY_IMAGES.length)
                }
                className="px-3 py-2 bg-white/80 rounded-full"
              >
                ▶
              </button>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-center gap-3">
            <button
              onClick={togglePlay}
              className="px-4 py-2 rounded-lg bg-green-500 text-white"
            >
              {isPlaying ? "❚❚ Pause Song" : "▶ Play Song"}
            </button>
            <button
              onClick={() => setShowConfetti(true)}
              className="px-4 py-2 rounded-lg bg-yellow-500 text-white"
            >
              🎊 Celebrate
            </button>
          </div>

          <div className="mt-4 text-center text-sm text-gray-500">Any text</div>
        </div>
      )}
    </div>
  );
}
