"use client";
import { useState } from "react";
import { Group, Text, Loader } from "@mantine/core";
import { IconUpload, IconX, IconCloudUp } from "@tabler/icons-react";
import { Dropzone, DropzoneProps, IMAGE_MIME_TYPE, MIME_TYPES } from "@mantine/dropzone";
import "@mantine/dropzone/styles.css";

function UploadComponent({ onUploadSuccess, ...props }: Partial<DropzoneProps> & { onUploadSuccess: () => void }) {
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false); // Loading state

  // Generate unique filename
  const generateUniqueName = (file: File) => {
    const ext = file.name.split(".").pop();
    return `${crypto.randomUUID()}.${ext}`;
  };

  const handleUpload = async (files: File[]) => {
    const file = files[0];
    if (!file) return;

    setIsLoading(true); // Start loading

    const uniqueFileName = generateUniqueName(file);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("customName", uniqueFileName);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (res.ok) {
        setUploadedUrl(data.url);
        onUploadSuccess();
        alert("File uploaded successfully!");
      } else {
        console.error("Upload failed:", data.error);
      }
    } catch (error) {
      console.error("Error uploading file:", error);
    } finally {
      setIsLoading(false); // Stop loading
    }
  };

  return (
    <div className="pt-2">
      <Dropzone
        onDrop={handleUpload}
        onReject={(files) => console.log("Rejected files", files)}
        maxSize={5 * 1024 ** 2}
        accept={[...IMAGE_MIME_TYPE, MIME_TYPES.mp4]}
        {...props}
        className="text-center"
        disabled={isLoading} // Disable while uploading
      >
        <Group justify="center" gap="xl" mih={220} style={{ pointerEvents: "none" }}>
          <Dropzone.Accept>
            <IconUpload size={52} color="var(--mantine-color-blue-6)" stroke={1.5} />
          </Dropzone.Accept>
          <Dropzone.Reject>
            <IconX size={52} color="var(--mantine-color-red-6)" stroke={1.5} />
          </Dropzone.Reject>
          <Dropzone.Idle>
            <IconCloudUp size={52} color="var(--mantine-color-dimmed)" stroke={1.5} />
          </Dropzone.Idle>

          <div>
            <Text size="xl" inline className="text-center">
              {isLoading ? "Uploading..." : "Upload a file"}
            </Text>
            <Text size="sm" inline mt={7} className="underline text-blue-700">
              Attach a photo or video (max 5MB)
            </Text>
          </div>
        </Group>
      </Dropzone>

      {/* Show loading indicator */}
      {isLoading && (
        <Group justify="center" mt="md">
          <Loader size="sm" color="blue" />
          <Text size="sm">Uploading...</Text>
        </Group>
      )}

      {/* Show uploaded file link */}
      {uploadedUrl && (
        <Text size="sm" mt="md">
          File saved at:{" "}
          <a href={uploadedUrl} target="_blank" className="text-blue-600 underline">
            {uploadedUrl}
          </a>
        </Text>
      )}
    </div>
  );
}

export default UploadComponent;
