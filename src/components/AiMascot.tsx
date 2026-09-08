/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

interface AiMascotProps {
  className?: string;
  size?: number;
  showSpeaker?: boolean;
}

export default function AiMascot({ className = '', size = 56, showSpeaker = true }: AiMascotProps) {
  return (
    <div className={`relative inline-flex items-center justify-center select-none ${className}`} style={{ width: size, height: size }}>
      {/* Mascot Robot Cat SVG */}
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="drop-shadow-md"
      >
        {/* Cat Ears */}
        <path
          d="M26 44L16 18C28 22 36 30 38 40"
          fill="#ECEEF2"
          stroke="#475569"
          strokeWidth="3.5"
          strokeLinejoin="round"
        />
        <path
          d="M24 38L19 22C27 25 32 30 34 37"
          fill="#334155"
        />

        <path
          d="M74 44L84 18C72 22 64 30 62 40"
          fill="#ECEEF2"
          stroke="#475569"
          strokeWidth="3.5"
          strokeLinejoin="round"
        />
        <path
          d="M76 38L81 22C73 25 68 30 66 37"
          fill="#334155"
        />

        {/* Head Base */}
        <rect
          x="20"
          y="32"
          width="60"
          height="48"
          rx="24"
          fill="#FFFFFF"
          stroke="#475569"
          strokeWidth="3.5"
        />

        {/* Visor Screen */}
        <rect
          x="26"
          y="40"
          width="48"
          height="32"
          rx="16"
          fill="#0F172A"
        />

        {/* Glowing Eyes */}
        <path
          d="M38 52C38 48 44 48 44 52C44 56 38 56 38 52Z"
          fill="#2DD4BF"
          className="animate-pulse"
        />
        <polygon
          points="41,49 43,53 41,57 39,53"
          fill="#99F6E4"
        />

        <path
          d="M56 52C56 48 62 48 62 52C62 56 56 56 56 52Z"
          fill="#2DD4BF"
          className="animate-pulse"
        />
        <polygon
          points="59,49 61,53 59,57 57,53"
          fill="#99F6E4"
        />

        {/* Cheerful Visor Smile (subtle) */}
        <path
          d="M47 63C48.5 64.5 51.5 64.5 53 63"
          stroke="#2DD4BF"
          strokeWidth="2"
          strokeLinecap="round"
        />

        {/* Headphones Arch */}
        <path
          d="M18 52C18 30 32 16 50 16C68 16 82 30 82 52"
          stroke="#1E293B"
          strokeWidth="4"
          strokeLinecap="round"
        />

        {/* Left Headphone Earcup */}
        <rect
          x="12"
          y="44"
          width="10"
          height="22"
          rx="5"
          fill="#0F172A"
          stroke="#334155"
          strokeWidth="2"
        />
        <circle cx="17" cy="55" r="2.5" fill="#2DD4BF" />

        {/* Right Headphone Earcup */}
        <rect
          x="78"
          y="44"
          width="10"
          height="22"
          rx="5"
          fill="#0F172A"
          stroke="#334155"
          strokeWidth="2"
        />
        <circle cx="83" cy="55" r="2.5" fill="#2DD4BF" />

        {/* Headphone Mic */}
        <path
          d="M17 62C17 74 26 78 34 78"
          stroke="#334155"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <circle cx="35" cy="78" r="2.5" fill="#2DD4BF" />
      </svg>

      {/* Floating Speaker/Broadcast Badge */}
      {showSpeaker && (
        <div className="absolute -top-1.5 -right-1.5 h-5 w-5 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-sm border-2 border-white ring-1 ring-emerald-300">
          <svg className="w-2.5 h-2.5 fill-current" viewBox="0 0 24 24">
            <path d="M12 4L7 9H3V15H7L12 20V4ZM16.5 12C16.5 10.23 15.48 8.71 14 7.97V16.02C15.48 15.29 16.5 13.77 16.5 12ZM14 3.23V5.29C16.89 6.15 19 8.83 19 12C19 15.17 16.89 17.85 14 18.71V20.77C18.01 19.86 21 16.28 21 12C21 7.72 18.01 4.14 14 3.23Z" />
          </svg>
        </div>
      )}
    </div>
  );
}
