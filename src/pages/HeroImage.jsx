import React, { useState, useEffect } from "react";
import {
  X,
  Eye,
  Trash2,
  Upload,
  RefreshCw,
  ImageIcon,
  CheckCircle,
  AlertCircle,
  Info,
} from "lucide-react";

const HeroImage = () => {
  const [heroImages, setHeroImages] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalImage, setModalImage] = useState(null);
  const [toasts, setToasts] = useState([]);
  const api_base = import.meta.env.VITE_API_BASE_URL;

  // Toast notification system
  const showToast = (message, type = "info") => {
    const id = Date.now();
    const toast = { id, message, type };
    setToasts((prev) => [...prev, toast]);

    // Auto remove after 5 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 5000);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const getToastIcon = (type) => {
    switch (type) {
      case "success":
        return <CheckCircle className="w-5 h-5" />;
      case "error":
        return <AlertCircle className="w-5 h-5" />;
      default:
        return <Info className="w-5 h-5" />;
    }
  };

  const getToastColors = (type) => {
    switch (type) {
      case "success":
        return "bg-green-500 text-white";
      case "error":
        return "bg-red-500 text-white";
      default:
        return "bg-blue-500 text-white";
    }
  };

  // Fetch hero images
  const fetchHeroImages = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("authToken");

      if (!token) {
        console.error("No authentication token found");
        showToast("Please login first", "error");
        return;
      }

      const response = await fetch(`${api_base}/hero-image/get-image`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (response.status === 401) {
        showToast("Session expired. Please login again.", "error");
        localStorage.removeItem("authToken");
        return;
      }

      if (data.success) {
        setHeroImages(data.data);
      } else {
        console.error("API Error:", data.message);
        showToast(data.message || "Failed to fetch images", "error");
      }
    } catch (error) {
      console.error("Error fetching hero images:", error);
      showToast("Network error. Please check your connection.", "error");
    } finally {
      setLoading(false);
    }
  };

  // Handle file selection
  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      const preview = URL.createObjectURL(file);
      setPreviewUrl(preview);
    }
  };

  // Upload hero image
  const handleUpload = async () => {
    if (!selectedFile) {
      showToast("Please select an image first", "error");
      return;
    }

    setUploadLoading(true);
    const formData = new FormData();
    formData.append("heroImage", selectedFile);

    try {
      const token = localStorage.getItem("authToken");

      if (!token) {
        showToast("Please login first", "error");
        return;
      }

      const response = await fetch(`${api_base}/hero-image/create-image`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json();

      if (response.status === 401) {
        showToast("Session expired. Please login again.", "error");
        localStorage.removeItem("authToken");
        return;
      }

      if (data.success) {
        showToast("Hero image uploaded successfully!", "success");
        setSelectedFile(null);
        setPreviewUrl(null);
        fetchHeroImages();
        document.getElementById("fileInput").value = "";
      } else {
        showToast(data.message || "Upload failed", "error");
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      showToast("Upload failed. Please try again.", "error");
    } finally {
      setUploadLoading(false);
    }
  };

  // Delete hero image
  const handleDelete = async (imageId) => {
    if (!window.confirm("Are you sure you want to delete this hero image?")) {
      return;
    }

    setDeleteLoading(imageId);
    try {
      const token = localStorage.getItem("authToken");

      if (!token) {
        showToast("Please login first", "error");
        return;
      }

      const response = await fetch(
        `${api_base}/hero-image/delete-image/${imageId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();

      if (response.status === 401) {
        showToast("Session expired. Please login again.", "error");
        localStorage.removeItem("authToken");
        return;
      }

      if (data.success) {
        showToast("Hero image deleted successfully!", "success");
        fetchHeroImages();
      } else {
        showToast(data.message || "Delete failed", "error");
      }
    } catch (error) {
      console.error("Error deleting image:", error);
      showToast("Delete failed. Please try again.", "error");
    } finally {
      setDeleteLoading(null);
    }
  };

  // Open modal with image
  const handleViewImage = (image) => {
    setModalImage(image);
    setShowModal(true);
  };

  // Close modal
  const closeModal = () => {
    setShowModal(false);
    setModalImage(null);
  };

  useEffect(() => {
    fetchHeroImages();
  }, []);

  return (
    <div className="p-6 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-blue-100 rounded-full">
                <ImageIcon className="w-8 h-8 text-blue-600" />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-gray-800">
                  Hero Image Management
                </h2>
                <p className="text-gray-600 mt-1 flex items-center">
                  <span className="inline-block w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                  Total: {heroImages.length} images
                </p>
              </div>
            </div>
            <button
              onClick={fetchHeroImages}
              disabled={loading}
              className="flex items-center px-6 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-800 transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <RefreshCw
                className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`}
              />
              Refresh
            </button>
          </div>
        </div>

        {/* Upload Section */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h3 className="text-xl font-semibold mb-6 text-gray-800">
            Upload New Hero Image
          </h3>

          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 hover:border-blue-400 transition-colors">
            <div className="flex flex-col items-center space-y-4">
              <Upload className="w-12 h-12 text-gray-400" />

              <input
                id="fileInput"
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="file:mr-4 file:py-3 file:px-6 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 file:cursor-pointer cursor-pointer"
              />

              {previewUrl && (
                <div className="mt-6">
                  <p className="text-sm text-gray-600 mb-3 font-medium">
                    Preview:
                  </p>
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="w-64 h-40 object-cover rounded-lg border-2 border-gray-200 shadow-md"
                  />
                </div>
              )}

              <button
                onClick={handleUpload}
                disabled={!selectedFile || uploadLoading}
                className="flex items-center px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 font-semibold"
              >
                {uploadLoading ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4 mr-2" />
                    Upload Image
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Images Table */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-xl font-semibold text-gray-800">
              Existing Hero Images
            </h3>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-12">
              <RefreshCw className="w-8 h-8 animate-spin text-blue-600" />
              <span className="ml-3 text-lg text-gray-600">
                Loading images...
              </span>
            </div>
          ) : heroImages.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <ImageIcon className="w-16 h-16 mx-auto text-gray-300 mb-4" />
              <p className="text-lg font-medium">No hero images found</p>
              <p className="text-sm">Upload your first hero image above</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      ID
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Image
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Uploaded By
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Upload Date
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {heroImages.map((image, index) => (
                    <tr
                      key={image._id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-3 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full">
                          #{image._id.slice(-6)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <img
                          src={`${image.image}`}
                          alt="Hero"
                          className="w-20 h-14 object-cover rounded-lg border-2 border-gray-200 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                          onError={(e) => {
                            e.target.src = "/placeholder-image.png";
                          }}
                          onClick={() => handleViewImage(image)}
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                            <span className="text-sm font-medium text-blue-600">
                              {(image.userId?.name || "Admin")
                                .charAt(0)
                                .toUpperCase()}
                            </span>
                          </div>
                          <span className="text-sm font-medium text-gray-900">
                            {image.userId?.name || "Admin"}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {new Date(image.createdAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex space-x-3">
                          <button
                            onClick={() => handleViewImage(image)}
                            className="flex items-center px-3 py-2 bg-blue-100 text-blue-700 text-sm rounded-lg hover:bg-blue-200 transition-colors"
                          >
                            <Eye className="w-4 h-4 mr-1" />
                            View
                          </button>
                          <button
                            onClick={() => handleDelete(image._id)}
                            disabled={deleteLoading === image._id}
                            className="flex items-center px-3 py-2 bg-red-100 text-red-700 text-sm rounded-lg hover:bg-red-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {deleteLoading === image._id ? (
                              <RefreshCw className="w-4 h-4 mr-1 animate-spin" />
                            ) : (
                              <Trash2 className="w-4 h-4 mr-1" />
                            )}
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {showModal && modalImage && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl">
            <div className="flex justify-between items-center p-6 border-b border-gray-200">
              <div>
                <h3 className="text-xl font-semibold text-gray-800">
                  Hero Image Preview
                </h3>
                <p className="text-sm text-gray-600">
                  ID: #{modalImage._id.slice(-6)}
                </p>
              </div>
              <button
                onClick={closeModal}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-6 h-6 text-gray-600" />
              </button>
            </div>

            <div className="p-6">
              <div className="flex flex-col lg:flex-row gap-6">
                <div className="flex-1">
                  <img
                    src={`${modalImage.image}`}
                    alt="Hero"
                    className="w-full max-h-96 object-contain rounded-lg shadow-lg"
                    onError={(e) => {
                      e.target.src = "/placeholder-image.png";
                    }}
                  />
                </div>

                <div className="lg:w-80 space-y-4">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-800 mb-3">
                      Image Details
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Uploaded by:</span>
                        <span className="font-medium">
                          {modalImage.userId?.name || "Admin"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Upload Date:</span>
                        <span className="font-medium">
                          {new Date(modalImage.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">ID:</span>
                        <span className="font-medium font-mono">
                          #{modalImage._id.slice(-6)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col space-y-3">
                    <button
                      onClick={() =>
                        window.open(`${modalImage.image}`, "_blank")
                      }
                      className="flex items-center justify-center px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      Open in New Tab
                    </button>

                    <button
                      onClick={() => {
                        closeModal();
                        handleDelete(modalImage._id);
                      }}
                      className="flex items-center justify-center px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete Image
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notifications */}
      <div className="fixed top-4 right-4 z-50 space-y-2">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`flex items-center p-4 rounded-lg shadow-lg transform transition-all duration-300 ease-in-out ${getToastColors(
              toast.type
            )} min-w-80`}
          >
            <div className="flex items-center">
              {getToastIcon(toast.type)}
              <span className="ml-3 font-medium">{toast.message}</span>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="ml-4 hover:bg-white hover:bg-opacity-20 rounded-full p-1 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HeroImage;
