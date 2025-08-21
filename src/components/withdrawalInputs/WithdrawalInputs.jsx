import React, { useEffect, useState } from "react";
import { Upload, X, FileImage } from "lucide-react";
import axios from "axios";

const AdminImageUploadComponent = () => {
  const [bep20Image, setBep20Image] = useState(null);
  const [trc20Image, setTrc20Image] = useState(null);
  const [bep20Input, setBep20Input] = useState("");
  const [trc20Input, setTrc20Input] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const baseUrl = `${import.meta.env.VITE_API_BASE_URL}`;

  useEffect(() => {
    // Check localStorage for any saved data
    const storedBep20Image = localStorage.getItem("bep20Image");
    const storedTrc20Image = localStorage.getItem("trc20Image");
    const storedBep20Input = localStorage.getItem("bep20Input");
    const storedTrc20Input = localStorage.getItem("trc20Input");

    if (storedBep20Image) setBep20Image(JSON.parse(storedBep20Image));
    if (storedTrc20Image) setTrc20Image(JSON.parse(storedTrc20Image));
    if (storedBep20Input) setBep20Input(storedBep20Input);
    if (storedTrc20Input) setTrc20Input(storedTrc20Input);
  }, []);

  const formatFileSize = (size) => {
    if (size < 1024) return `${size} B`;
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(size) / Math.log(k));
    return parseFloat((size / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const handleImageUpload = (event, side) => {
    const file = event.target.files[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        alert("Please select a valid image file");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        alert("Image size should be less than 5MB");
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const imageData = {
          file: file,
          preview: e.target.result,
          name: file.name,
          size: file.size,
        };

        if (side === "left") {
          setBep20Image(imageData);
          localStorage.setItem("bep20Image", JSON.stringify(imageData)); // Save to localStorage
        } else {
          setTrc20Image(imageData);
          localStorage.setItem("trc20Image", JSON.stringify(imageData)); // Save to localStorage
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    if (!bep20Image && !trc20Image && !bep20Input && !trc20Input) {
      alert("Please provide at least one ID or image before submitting.");
      return;
    }

    setIsLoading(true);
    const formData = new FormData();

    if (bep20Image) formData.append("bep20Img", bep20Image.file);
    if (trc20Image) formData.append("trc20Img", trc20Image.file);
    if (bep20Input) formData.append("bep20Id", bep20Input);
    if (trc20Input) formData.append("trc20Id", trc20Input);

    try {
      const token = localStorage.getItem("authToken");
      const response = await axios.post(
        `${baseUrl}/admin/update-network-images`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Network data updated successfully!");

     
      } catch (error) {
      console.error("Error uploading data:", error);
      alert("An error occurred while uploading. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
      <div className="mb-4">
        <h2 className="text-xl font-semibold text-gray-800">
          Admin Image Upload
        </h2>
        <p className="text-sm text-gray-600 mt-1">
          Upload images and add Id for withdrawal management
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* BEP-20 Side */}
        <div className="space-y-4">
          <h3 className="text-md font-semibold text-blue-700">BEP-20</h3>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Id (BEP-20)
            </label>
            <input
              type="text"
              value={bep20Input}
              onChange={(e) => {
                setBep20Input(e.target.value);
                localStorage.setItem("bep20Input", e.target.value); // Save to localStorage
              }}
              placeholder="Enter BEP-20 Id..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              disabled={isLoading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Upload Image (BEP-20)
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-blue-400 transition-colors">
              {!bep20Image ? (
                <div className="text-center">
                  <input
                    type="file"
                    id="left-image"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e, "left")}
                    className="hidden"
                    disabled={isLoading}
                  />
                  <label
                    htmlFor="left-image"
                    className="cursor-pointer flex flex-col items-center space-y-2"
                  >
                    <Upload className="w-8 h-8 text-gray-400" />
                    <span className="text-sm text-gray-600">
                      Click to upload image
                    </span>
                    <span className="text-xs text-gray-500">
                      PNG, JPG, GIF up to 5MB
                    </span>
                  </label>
                </div>
              ) : (
                <div className="relative">
                  <div className="flex items-center space-x-3">
                    <img
                      src={bep20Image.preview}
                      alt="BEP-20 preview"
                      className="w-16 h-16 object-cover rounded-lg border border-gray-200"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {bep20Image.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {formatFileSize(bep20Image.size)}
                      </p>
                    </div>
                    <button
                      onClick={() => removeImage("left")}
                      className="flex-shrink-0 p-1 text-gray-400 hover:text-red-500 transition-colors"
                      disabled={isLoading}
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="mt-2">
                    <input
                      type="file"
                      id="left-image-replace"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e, "left")}
                      className="hidden"
                      disabled={isLoading}
                    />
                    <label
                      htmlFor="left-image-replace"
                      className="text-xs text-blue-600 hover:text-blue-800 cursor-pointer"
                    >
                      Replace image
                    </label>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* TRC-20 Side */}
        <div className="space-y-4">
          <h3 className="text-md font-semibold text-pink-700">TRC-20</h3>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Id (TRC-20)
            </label>
            <input
              type="text"
              value={trc20Input}
              onChange={(e) => {
                setTrc20Input(e.target.value);
                localStorage.setItem("trc20Input", e.target.value); // Save to localStorage
              }}
              placeholder="Enter TRC-20 Id..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
              disabled={isLoading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Upload Image (TRC-20)
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-pink-400 transition-colors">
              {!trc20Image ? (
                <div className="text-center">
                  <input
                    type="file"
                    id="right-image"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e, "right")}
                    className="hidden"
                    disabled={isLoading}
                  />
                  <label
                    htmlFor="right-image"
                    className="cursor-pointer flex flex-col items-center space-y-2"
                  >
                    <Upload className="w-8 h-8 text-gray-400" />
                    <span className="text-sm text-gray-600">
                      Click to upload image
                    </span>
                    <span className="text-xs text-gray-500">
                      PNG, JPG, GIF up to 5MB
                    </span>
                  </label>
                </div>
              ) : (
                <div className="relative">
                  <div className="flex items-center space-x-3">
                    <img
                      src={trc20Image.preview}
                      alt="TRC-20 preview"
                      className="w-16 h-16 object-cover rounded-lg border border-gray-200"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {trc20Image.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {formatFileSize(trc20Image.size)}
                      </p>
                    </div>
                    <button
                      onClick={() => removeImage("right")}
                      className="flex-shrink-0 p-1 text-gray-400 hover:text-red-500 transition-colors"
                      disabled={isLoading}
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="mt-2">
                    <input
                      type="file"
                      id="right-image-replace"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e, "right")}
                      className="hidden"
                      disabled={isLoading}
                    />
                    <label
                      htmlFor="right-image-replace"
                      className="text-xs text-pink-600 hover:text-pink-800 cursor-pointer"
                    >
                      Replace image
                    </label>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 flex justify-end space-x-3">
        <button
          onClick={() => {
            setBep20Image(null);
            setTrc20Image(null);
            setBep20Input("");
            setTrc20Input("");
            localStorage.removeItem("bep20Image");
            localStorage.removeItem("trc20Image");
            localStorage.removeItem("bep20Input");
            localStorage.removeItem("trc20Input");
          }}
          className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
          disabled={isLoading}
        >
          Clear All
        </button>
        <button
          onClick={handleSubmit}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={
            (!bep20Input && !trc20Input && !bep20Image && !trc20Image) ||
            isLoading
          }
        >
          {isLoading ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </div>
  );
};

export default AdminImageUploadComponent;
