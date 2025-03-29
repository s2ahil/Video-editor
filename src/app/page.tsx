"use client";

import { AppShell, Text, Button, NumberInput } from "@mantine/core";
import { useState, useEffect } from "react";
import Image from "next/image";
import UploadComponent from "./_components/Upload";
import RemotionPlayer from "./_components/RemotionPlayer";




export default function Home() {
  const [availableMedia, setAvailableMedia] = useState<{ images: string[]; videos: string[] }>({
    images: [],
    videos: [],
  });

  const [selectedMedia, setSelectedMedia] = useState<
    { src: string; width: number; height: number; x: number; y: number; startTime: number; endTime: number }[]
  >([]);

  const [activeMedia, setActiveMedia] = useState<string | null>(null);
  const [mediaProperties, setMediaProperties] = useState<
    Record<string, { width: number; height: number; x: number; y: number; startTime: number; endTime: number }>
  >({});

  const fetchMedia = async () => {
    try {
      const res = await fetch("/api/media");
      const data = await res.json();
      if (res.ok) {
        setAvailableMedia(data);
      } else {
        console.error("Failed to fetch media:", data.error);
      }
    } catch (error) {
      console.error("Error fetching media:", error);
    }
  };

  useEffect(() => {
    fetchMedia();
  }, []);

  const toggleMediaSelection = (media: string) => {
    setSelectedMedia((prev) => {
      const existing = prev.find((item) => item.src === media);
      return existing
        ? prev.filter((item) => item.src !== media)
        : [...prev, { src: media, width: 200, height: 200, x: 0, y: 0, startTime: 0, endTime: 10 }];
    });

    setMediaProperties((prev) => ({
      ...prev,
      [media]: prev[media] || { width: 200, height: 200, x: 0, y: 0, startTime: 0, endTime: 10 },
    }));
  };

  const saveUpdatedSize = (src: string) => {
    setSelectedMedia((prev) =>
      prev.map((item) => (item.src === src ? { ...item, ...mediaProperties[src] } : item))
    );
    setActiveMedia(null);
  };

  const handleUploadSuccess = () => {
    fetchMedia();
  };

  return (
    <AppShell>
      <div className="grid grid-cols-1 md:grid-cols-5 items-start">
        {/* Sidebar */}
        <div className="relative flex flex-col w-full max-h-[25rem] md:col-span-2 p-4 border border-gray-200 shadow overflow-y-auto">
          <div className="text-lg font-semibold text-gray-700 flex flex-col">
            <div className="w-full">Add Media</div>
            <UploadComponent onUploadSuccess={handleUploadSuccess} />
          </div>

          {/* Media List */}
          <div className="mt-6">
            <Text size="lg">Available Media</Text>
            <div className="grid grid-cols-2 gap-4 w-full mt-2">
              {availableMedia.images.map((img) => (
                <div key={img} className="relative">
                  <Image src={img} alt="Uploaded" width={100} height={100} className="w-full h-auto rounded-lg shadow" />
                  <Button
                    className="absolute top-2 left-2 bg-gray-800 text-white text-xs"
                    onClick={() => toggleMediaSelection(img)}
                    size="xs"
                  >
                    {selectedMedia.some((item) => item.src === img) ? "Deselect" : "Select"}
                  </Button>
                </div>
              ))}
              {availableMedia.videos.map((vid) => (
                <div key={vid} className="relative">
                  <video controls src={vid} className="w-full h-auto rounded-lg shadow"></video>
                  <Button
                    className="absolute top-2 left-2 bg-gray-800 text-white text-xs"
                    onClick={() => toggleMediaSelection(vid)}
                    size="xs"
                  >
                    {selectedMedia.some((item) => item.src === vid) ? "Deselect" : "Select"}
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Preview Section */}
        <div className="flex flex-col items-center justify-center w-full md:col-span-3 p-4 bg-[#f7f7f8] border border-gray-200 min-h-[25rem]">
          <RemotionPlayer selectedMedia={selectedMedia} />
        </div>
      </div>

      {/* Selected Media Editor */}
      <div className="border-t border-gray-200 mt-6 p-4">
        <Text size="lg" className="font-semibold mb-4">
          Selected Media (Click to Edit)
        </Text>
        <div className="flex gap-4 overflow-x-auto">
          {selectedMedia.map((media) => (
            <div key={media.src} className="relative p-2 border rounded-md shadow">
              {media.src.toLowerCase().endsWith(".mp4") ? (
                <video
                  src={media.src}
                  width={200}
                  height={200}
                  className="rounded-md cursor-pointer"
                  onClick={() => setActiveMedia(media.src)}
                />
              ) : (
                <Image
                  src={media.src}
                  alt="Selected"
                  width={200}
                  height={200}
                  className="rounded-md cursor-pointer"
                  onClick={() => setActiveMedia(media.src)}
                />
              )}

              {/* Show input fields only for the active media */}
              {activeMedia === media.src && (
                <div>
                  <NumberInput
                    label="Width"
                    value={mediaProperties[media.src]?.width || 100}
                    onChange={(value) =>
                      setMediaProperties((prev) => ({
                        ...prev,
                        [media.src]: { ...prev[media.src], width: Number(value) || 100 },
                      }))
                    }
                  />
                  <NumberInput
                    label="Height"
                    value={mediaProperties[media.src]?.height || 100}
                    onChange={(value) =>
                      setMediaProperties((prev) => ({
                        ...prev,
                        [media.src]: { ...prev[media.src], height: Number(value) || 100 },
                      }))
                    }
                  />
                  <NumberInput
                    label="X Position"
                    value={mediaProperties[media.src]?.x || 0}
                    onChange={(value) =>
                      setMediaProperties((prev) => ({
                        ...prev,
                        [media.src]: { ...prev[media.src], x: Number(value) || 0 },
                      }))
                    }
                  />
                  <NumberInput
                    label="Y Position"
                    value={mediaProperties[media.src]?.y || 0}
                    onChange={(value) =>
                      setMediaProperties((prev) => ({
                        ...prev,
                        [media.src]: { ...prev[media.src], y: Number(value) || 0 },
                      }))
                    }
                  />
                  <NumberInput
                    label="Start Time (s)"
                    value={mediaProperties[media.src]?.startTime || 0}
                    onChange={(value) =>
                      setMediaProperties((prev) => ({
                        ...prev,
                        [media.src]: { ...prev[media.src], startTime: Number(value) || 0 },
                      }))
                    }
                  />
                  <NumberInput
                    label="End Time (s)"
                    value={mediaProperties[media.src]?.endTime || 10}
                    onChange={(value) =>
                      setMediaProperties((prev) => ({
                        ...prev,
                        [media.src]: { ...prev[media.src], endTime: Number(value) || 10 },
                      }))
                    }
                  />
                  <Button fullWidth variant="outline" color="blue" onClick={() => saveUpdatedSize(media.src)} className="mt-2">
                    Save
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
