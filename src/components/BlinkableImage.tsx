import { useState, useEffect } from 'react';
import type { CSSProperties } from 'react';

interface BlinkableImageProps {
  originalSrc: string;
  blinkSrc: string;
  altText: string;
  bgColor?: string; // optional, defaults to transparent
}

export default function BlinkableImage({
  originalSrc,
  blinkSrc,
  altText,
  bgColor = 'transparent',
}: BlinkableImageProps) {
  const [isBlinking, setIsBlinking] = useState<boolean>(false);

  useEffect(() => {
    const img = new Image();
    img.src = blinkSrc;
    img.decode?.().catch(() => {}); // decode it too, so the first paint isn't delayed
  }, [blinkSrc]);

  const triggerBlink = (): void => {
    if (isBlinking) return;
    setIsBlinking(true);

    setTimeout(() => {
      setIsBlinking(false);
    }, 300);
  };

  // These depend on the bgColor prop, so they live inside the component
  const containerStyle: CSSProperties = {
    position: 'relative',
    display: 'inline-block',
    backgroundColor: bgColor,
  };

  const overlayStyle: CSSProperties = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    pointerEvents: 'none',
    animation: 'flashEffect 0.3s ease-in-out',
    backgroundColor: bgColor,
  };

  return (
    <div style={containerStyle} onClick={triggerBlink}>
      <img src={originalSrc} alt={altText} style={imageStyle} />

      {isBlinking && (
        <img src={blinkSrc} alt="" style={overlayStyle} />
      )}
    </div>
  );
}

// This one doesn't use any props, so it can stay outside
const imageStyle: CSSProperties = {
  width: '100%',
  height: '100%',
  objectFit: 'cover',
};