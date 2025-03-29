"use client";

import { useState, useRef, useEffect } from "react";
import { Dropzone } from "@mantine/dropzone";
import { IconUpload } from "@tabler/icons-react";
import { Rnd } from "react-rnd";

export default function VideoCanvas() {
  const [media, setMedia] = useState(null);
  const [dimensions, setDimensions] = useState({ width: 200, height: 200 });
  const [startTime, setStartTime] = useState(0);
  const [endTime, setEndTime] = useState(10);
  const [timer, setTimer] = useState(0);
  const [playing, setPlaying] = useState(false);
  const intervalRef = useRef(null);

  const handleDrop = (files) => {
    const file = files[0];
    const url = URL.createObjectURL(file);
    setMedia({ url, type: file.type.startsWith("video") ? "video" : "image" });
  };

  useEffect(() => {
    if (playing) {
      intervalRef.current = setInterval(() => {
        setTimer((prev) => (prev < endTime ? prev + 1 : startTime));
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [playing]);

  return (
    <div className="flex">
      {/* Left Menu */}
      <div className="p-4 border-r w-64">
        <h3 className="text-lg font-bold">Settings</h3>
        <label>Width:</label>
        <input
          type="number"
          value={dimensions.width}
          onChange={(e) => setDimensions({ ...dimensions, width: +e.target.value })}
          className="w-full border p-1"
        />
        <label>Height:</label>
        <input
          type="number"
          value={dimensions.height}
          onChange={(e) => setDimensions({ ...dimensions, height: +e.target.value })}
          className="w-full border p-1"
        />
        <label>Start Time:</label>
        <input
          type="number"
          value={startTime}
          onChange={(e) => setStartTime(+e.target.value)}
          className="w-full border p-1"
        />
        <label>End Time:</label>
        <input
          type="number"
          value={endTime}
          onChange={(e) => setEndTime(+e.target.value)}
          className="w-full border p-1"
        />
        <button className="mt-4 p-2 bg-blue-500 text-white w-full" onClick={() => setPlaying(!playing)}>
          {playing ? "Pause" : "Play"}
        </button>
      </div>
      
      {/* Canvas */}
      <div className="flex-1 flex justify-center items-center relative">
        <Dropzone onDrop={handleDrop} className="w-full h-full border-2 border-dashed p-10">
          <IconUpload size={50} />
          <p>Drop files here or click to upload</p>
        </Dropzone>
        {media && timer >= startTime && timer <= endTime && (
          <Rnd
            size={{ width: dimensions.width, height: dimensions.height }}
            onResizeStop={(e, direction, ref) => {
              setDimensions({ width: ref.offsetWidth, height: ref.offsetHeight });
            }}
            className="absolute border shadow-lg"
          >
            {media.type === "video" ? (
              <video src={media.url} controls className="w-full h-full" />
            ) : (
              <img src={media.url} alt="Uploaded" className="w-full h-full" />
            )}
          </Rnd>
        )}
      </div>
    </div>
  );
}
