import React from "react";
import { AbsoluteFill, Video, Img, useCurrentFrame } from "remotion";

const RemotionComposition = ({ selectedMedia }) => {
  const frame = useCurrentFrame();
  const fps = 30; // Assuming 30 frames per second

  return (
    <AbsoluteFill style={{ backgroundColor: "black" }}>
      {selectedMedia.map((media) => {
        const startFrame = media.startTime * fps;
        const endFrame = media.endTime * fps;
        const isVisible = frame >= startFrame && frame <= endFrame;

        return isVisible ? (
          <div
            key={media.src}
            style={{
              position: "absolute",
              left: `${media.x}px`,
              top: `${media.y}px`,
              width: `${media.width}px`,
              height: `${media.height}px`,
            }}
          >
            {media.src.endsWith(".mp4") ? (
              <Video src={media.src} style={{ width: "100%", height: "100%" }} />
            ) : (
              <Img src={media.src} style={{ width: "100%", height: "100%" }} />
            )}
          </div>
        ) : null;
      })}
    </AbsoluteFill>
  );
};

export default RemotionComposition;
