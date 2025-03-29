"use client";
import React from "react";
import { Player } from "@remotion/player";
import RemotionComposition from "./RemotionComposition";

interface RemotionPlayerProps {
  selectedMedia: {
    src: string;
    width: number;
    height: number;
    x: number;
    y: number;
    startTime: number;
    endTime: number;
  }[];
}

const RemotionPlayer: React.FC<RemotionPlayerProps> = ({ selectedMedia }) => {
  return (
    <div>
      <Player
        component={() => <RemotionComposition selectedMedia={selectedMedia} />}
        durationInFrames={300}
        compositionWidth={500}
        compositionHeight={300}
        fps={30}
        controls
      />
    </div>
  );
};

export default RemotionPlayer;
