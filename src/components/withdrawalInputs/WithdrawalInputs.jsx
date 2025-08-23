import React, { useEffect, useState } from "react";
import { Upload, X } from "lucide-react";
import axios from "axios";
import { toast } from "react-toastify";

const AdminImageUploadComponent = () => {
  const [bep20Image, setBep20Image] = useState(null);
  const [trc20Image, setTrc20Image] = useState(null);
  const [bep20Input, setBep20Input] = useState("");
  const [trc20Input, setTrc20Input] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const baseUrl = `${import.meta.env.VITE_API_BASE_URL}`;

  useEffect(() => {
    getData();
  }, []);

  const formatFileSize = (size) => {
    if (!size || size <= 0) return "";
    if (size < 1024) return `${size} B`;
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(size) / Math.log(k));
    return parseFloat((size / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const handleImageUpload = (event, side) => {
    const file = event.target.files?.[0];
    if (!file) return;

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
        file,
        preview: e.target.result,
        name: file.name,
        size: file.size,
      };
      if (side === "left") setBep20Image(imageData);
      else setTrc20Image(imageData);
    };
    reader.readAsDataURL(file);
  };

  const removeImage = (side) => {
    if (side === "left") setBep20Image(null);
    else setTrc20Image(null);
  };

  const handleSubmit = async () => {
    if (!bep20Image && !trc20Image && !bep20Input && !trc20Input) {
      toast.error("Please provide at least one ID or image before submitting.");
      return;
    }

    setIsLoading(true);
    const formData = new FormData();

    // Only append files if they exist and are new uploads
    if (bep20Image?.file) formData.append("bep20Img", bep20Image.file);
    if (trc20Image?.file) formData.append("trc20Img", trc20Image.file);
    if (bep20Input.trim()) formData.append("bep20Id", bep20Input.trim());
    if (trc20Input.trim()) formData.append("trc20Id", trc20Input.trim());

    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch(`${baseUrl}/admin/networks/update`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json();
      console.log("Update response:", data);

      if (data.success) {
        // After successful update, fetch the latest data
        await getData();
        alert(data.message || "Network data updated successfully!");
      } else {
        alert(data.message || "Failed to update network data");
      }
    } catch (error) {
      console.error("Error uploading data:", error);
      alert(
        error?.response?.data?.message ||
          "An error occurred while uploading. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const getData = async () => {
    try {
      setIsInitialLoading(true);
      const token = localStorage.getItem("authToken");

      if (!token) {
        console.error("No auth token found");
        return;
      }

      console.log("Fetching network data with token:", token);

      // ✅ Updated endpoint for Network collection
      const response = await fetch(`${baseUrl}/admin/networks`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();
      console.log("Response from network API:", data);

      if (data.success) {
        // ✅ Updated to handle Network collection response structure
        const networkData =
          data.data?.network || data.data?.networks?.[0] || {};
        console.log("Fetched network data:", networkData);

        // Update state with fetched data
        setBep20Input(networkData.bep20Id || "");
        setTrc20Input(networkData.trc20Id || "");

        // For existing images, don't include the file object since they're already uploaded
        setBep20Image(
          networkData.bep20Img
            ? {
                preview: networkData.bep20Img,
                name: "BEP-20 Image",
                size: 0,
                isExisting: true, // Flag to identify existing images
              }
            : null
        );
        setTrc20Image(
          networkData.trc20Img
            ? {
                preview: networkData.trc20Img,
                name: "TRC-20 Image",
                size: 0,
                isExisting: true,
              }
            : null
        );
      }
    } catch (error) {
      console.error("Failed to fetch network data:", error);
      // Check if it's an auth error
      // if (error.response?.status === 401) {
      //   alert("Session expired. Please login again.");
      //   // Redirect to login or clear token
      //   localStorage.removeItem("authToken");
      //   localStorage.removeItem("user");
      // } else if (error.response?.status === 404) {
      //   console.log(
      //     "No network data found - this is normal for first time setup"
      //   );
      //   // Don't show error for 404, it's normal when no network data exists yet
      // } else {
      //   alert("Failed to fetch network data");
      // }
    } finally {
      setIsInitialLoading(false);
    }
  };

  const clearAll = async () => {
    const confirmClear = window.confirm(
      "⚠️ Are you sure you want to clear all network data?\n\nThis will delete:\n• All wallet addresses\n• All QR code images\n\nThis action cannot be undone!"
    );

    if (!confirmClear) return;

    try {
      const token = localStorage.getItem("authToken");

      if (!token) {
        alert("Authentication token not found. Please login again.");
        return;
      }

      const response = await fetch(`${baseUrl}/admin/networks/clear`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (data.success) {
        setBep20Image(null);
        setTrc20Image(null);
        setBep20Input("");
        setTrc20Input("");

        // Clear any localStorage cache
        localStorage.removeItem("bep20Input");
        localStorage.removeItem("trc20Input");

        alert("✅ All network data cleared successfully!");

        // Refresh data from server to confirm
        await getData();
      } else {
        if (response.status === 404) {
          alert("ℹ️ No network data found to clear.");
        } else {
          alert(data.message || "Failed to clear network data");
        }
      }
    } catch (error) {
      console.error("❌ Error clearing data:", error);

      if (error.name === "TypeError" && error.message.includes("fetch")) {
        alert("Network error: Unable to connect to server");
      } else {
        alert("Error clearing network data. Please try again.");
      }
    }
  };

  if (isInitialLoading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading network data...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
      <div className="mb-4">
        <h2 className="text-xl font-semibold text-gray-800">
          Admin Network Management
        </h2>
        <p className="text-sm text-gray-600 mt-1">
          Upload images and add IDs for withdrawal management
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* BEP-20 Side */}
        <div className="space-y-4">
          <h3 className="text-md font-semibold text-blue-700">BEP-20</h3>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              BEP-20 ID
            </label>
            <input
              type="text"
              value={bep20Input}
              onChange={(e) => setBep20Input(e.target.value)}
              placeholder="Enter BEP-20 ID..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              disabled={isLoading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              BEP-20 QR Code Image
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-blue-400 transition-colors">
              {!bep20Image ? (
                <div className="text-center">
                  <input
                    type="file"
                    id="bep20-image"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e, "left")}
                    className="hidden"
                    disabled={isLoading}
                  />
                  <label
                    htmlFor="bep20-image"
                    className="cursor-pointer flex flex-col items-center space-y-2"
                  >
                    <Upload className="w-8 h-8 text-gray-400" />
                    <span className="text-sm text-gray-600">
                      Click to upload QR code
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
                      alt="BEP-20 QR Code"
                      className="w-16 h-16 object-cover rounded-lg border border-gray-200"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {bep20Image.name}
                      </p>
                      {bep20Image.size > 0 && (
                        <p className="text-xs text-gray-500">
                          {formatFileSize(bep20Image.size)}
                        </p>
                      )}
                      {bep20Image.isExisting && (
                        <p className="text-xs text-green-600">Current image</p>
                      )}
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
                      id="bep20-image-replace"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e, "left")}
                      className="hidden"
                      disabled={isLoading}
                    />
                    <label
                      htmlFor="bep20-image-replace"
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
              TRC-20 ID
            </label>
            <input
              type="text"
              value={trc20Input}
              onChange={(e) => setTrc20Input(e.target.value)}
              placeholder="Enter TRC-20 ID..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
              disabled={isLoading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              TRC-20 QR Code Image
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-pink-400 transition-colors">
              {!trc20Image ? (
                <div className="text-center">
                  <input
                    type="file"
                    id="trc20-image"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e, "right")}
                    className="hidden"
                    disabled={isLoading}
                  />
                  <label
                    htmlFor="trc20-image"
                    className="cursor-pointer flex flex-col items-center space-y-2"
                  >
                    <Upload className="w-8 h-8 text-gray-400" />
                    <span className="text-sm text-gray-600">
                      Click to upload QR code
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
                      alt="TRC-20 QR Code"
                      className="w-16 h-16 object-cover rounded-lg border border-gray-200"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {trc20Image.name}
                      </p>
                      {trc20Image.size > 0 && (
                        <p className="text-xs text-gray-500">
                          {formatFileSize(trc20Image.size)}
                        </p>
                      )}
                      {trc20Image.isExisting && (
                        <p className="text-xs text-green-600">Current image</p>
                      )}
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
                      id="trc20-image-replace"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e, "right")}
                      className="hidden"
                      disabled={isLoading}
                    />
                    <label
                      htmlFor="trc20-image-replace"
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
          onClick={clearAll}
          className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
          disabled={isLoading}
        >
          Clear All
        </button>
        <button
          onClick={handleSubmit}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={
            (!bep20Input.trim() &&
              !trc20Input.trim() &&
              !bep20Image &&
              !trc20Image) ||
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
