"use client";

interface Props {
  size?: number;
  className?: string;
}

/** Geometric T-monogram for Tribhuvan. Inherits color from currentColor. */
export function Logo({ size = 28, className = "" }: Props) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.4"
      strokeLinecap="square"
      strokeLinejoin="miter"
      aria-label="Tribhuvan"
      className={className}
    >
      {/* outer diamond */}
      <path d="M32 4 L60 32 L32 60 L4 32 Z" opacity="0.4" />
      {/* T crossbar */}
      <path d="M18 22 L46 22" />
      {/* T stem */}
      <path d="M32 22 L32 46" />
      {/* base spike */}
      <path d="M26 46 L38 46 L32 56 Z" fill="currentColor" />
    </svg>
  );
}
