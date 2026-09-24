import { useState } from 'react';
import type { CSSProperties } from 'react';
import useSound from 'use-sound';

interface BlinkableImageProps {
  originalSrc: string;
  blinkSrc: string;
  altText: string;
  bgColor?: string; // optional, defaults to transparent
  soundEffect: string;
}

export default function BlinkableImage({
  originalSrc,
  blinkSrc,
  altText,
  bgColor = 'transparent',
  soundEffect
}: BlinkableImageProps) {
  const [isBlinking, setIsBlinking] = useState<boolean>(false);
  const [play] = useSound(soundEffect, { volume: 0.1 });

  const triggerBlink = (): void => {
    if (isBlinking) return;
    setIsBlinking(true);
    play();
    setTimeout(() => {
      setIsBlinking(false);
    }, 300);
  };

  const containerStyle: CSSProperties = {
    position: 'relative',
    display: 'inline-block',
    backgroundColor: bgColor,
  };

  return (
    <div style={containerStyle} onClick={triggerBlink}>
      {/* Blink image sits underneath, always mounted and already painted */}
      <img src={blinkSrc} alt="" style={baseImageStyle} aria-hidden="true" />

      {/* Normal image sits on top; we just hide it momentarily to reveal the blink frame beneath */}
      <img
        src={originalSrc}
        alt={altText}
        style={{
          ...overlayImageStyle,
          opacity: isBlinking ? 0 : 1,
        }}
      />
    </div>
  );
}

// Bottom layer: blink frame, always rendered
const baseImageStyle: CSSProperties = {
  display: 'block',
  width: '100%',
  height: '100%',
  objectFit: 'cover',
};

// Top layer: normal frame, stacked exactly over the base
const overlayImageStyle: CSSProperties = {
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  pointerEvents: 'none',
};