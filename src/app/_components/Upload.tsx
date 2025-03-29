"use client";
import { useState } from "react";
import { Group, Text} from "@mantine/core";
import { IconUpload, IconX, IconCloudUp } from "@tabler/icons-react";
import { Dropzone, DropzoneProps, IMAGE_MIME_TYPE, MIME_TYPES } from "@mantine/dropzone";
import "@mantine/dropzone/styles.css";


function UploadComponent({ onUploadSuccess, ...props }: Partial<DropzoneProps> & { onUploadSuccess: () => void }) {
  // const [media, setMedia] = useState<File | null>(null);
  // const [preview, setPreview] = useState<string | null>(null);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);



  // Generate unique filename
  const generateUniqueName = (file: File) => {
    const ext = file.name.split(".").pop();
    return `${crypto.randomUUID()}.${ext}`;
  };

  const handleUpload = async (files: File[]) => {
    const file = files[0];
    if (!file) return;

 
    const uniqueFileName = generateUniqueName(file);

    // const objectURL = URL.createObjectURL(file);
  

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
        // fetchMedia(); // Refresh media list after upload
        alert("File uploaded successfully!");
      } else {
        console.error("Upload failed:", data.error);
      }
    } catch (error) {
      console.error("Error uploading file:", error);
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
              Upload a file
            </Text>
            <Text size="sm" inline mt={7} className="underline text-blue-700">
              Attach a photo or video (max 5MB)
            </Text>
          </div>
        </Group>
      </Dropzone>

     

      {/* Show uploaded file link */}
      {uploadedUrl && (
        <Text size="sm" mt="md">
          File saved at:{" "}
          <a href={uploadedUrl} target="_blank" className="text-blue-600 underline">
            {uploadedUrl}
          </a>
        </Text>
      )}

      {/* Clear media
      {preview && (
        <Button
          variant="outline"
          color="red"
          mt="md"
          onClick={() => {
            setMedia(null);
            setPreview(null);
            setUploadedUrl(null);
          }}
        >
          Remove Media
        </Button>
      )} */}

      {/* Display Available Media */}
     
    </div>
  );
}

export default UploadComponent;
