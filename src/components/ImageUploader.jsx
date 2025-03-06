import React, { useState } from "react";
import axios from "axios";

const ImageUploader = ({ onImageUpload }) => {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    setPreview(URL.createObjectURL(file)); // Show preview before upload
  };

  const handleUpload = async () => {
    if (!image) {
      alert("Please select an image.");
      return;
    }

    setUploading(true);

    const formData = new FormData();
    formData.append("file", image);
    formData.append("upload_preset", "your_upload_preset"); // Replace with your Cloudinary upload preset

    try {
      const response = await axios.post(
        "https://api.cloudinary.com/v1_1/your_cloud_name/image/upload", // Replace with your Cloudinary cloud name
        formData
      );

      const imageUrl = response.data.secure_url; // ✅ Cloudinary URL
      onImageUpload(imageUrl); // Send URL to parent component
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Image upload failed!");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="p-4 border rounded-md shadow">
      <input type="file" onChange={handleFileChange} className="mb-2" />
      {preview && <img src={preview} alt="Preview" className="w-32 h-32 object-cover mb-2" />}
      <button onClick={handleUpload} className="bg-blue-500 text-white px-4 py-2 rounded-md" disabled={uploading}>
        {uploading ? "Uploading..." : "Upload"}
      </button>
    </div>
  );
};

export default ImageUploader;
