// import React, { useState, useEffect } from "react";
// import {
//   X,
//   Eye,
//   Trash2,
//   Upload,
//   RefreshCw,
//   ImageIcon,
//   CheckCircle,
//   AlertCircle,
//   Info,
// } from "lucide-react";

// const HeroImage = () => {
//   const [heroImages, setHeroImages] = useState([]);
//   const [selectedFile, setSelectedFile] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [uploadLoading, setUploadLoading] = useState(false);
//   const [deleteLoading, setDeleteLoading] = useState(null);
//   const [previewUrl, setPreviewUrl] = useState(null);
//   const [showModal, setShowModal] = useState(false);
//   const [modalImage, setModalImage] = useState(null);
//   const [toasts, setToasts] = useState([]);
//   const api_base = import.meta.env.VITE_API_BASE_URL;

//   // Toast notification system
//   const showToast = (message, type = "info") => {
//     const id = Date.now();
//     const toast = { id, message, type };
//     setToasts((prev) => [...prev, toast]);

//     // Auto remove after 5 seconds
//     setTimeout(() => {
//       setToasts((prev) => prev.filter((t) => t.id !== id));
//     }, 5000);
//   };

//   const removeToast = (id) => {
//     setToasts((prev) => prev.filter((t) => t.id !== id));
//   };

//   const getToastIcon = (type) => {
//     switch (type) {
//       case "success":
//         return <CheckCircle className="w-5 h-5" />;
//       case "error":
//         return <AlertCircle className="w-5 h-5" />;
//       default:
//         return <Info className="w-5 h-5" />;
//     }
//   };

//   const getToastColors = (type) => {
//     switch (type) {
//       case "success":
//         return "bg-green-500 text-white";
//       case "error":
//         return "bg-red-500 text-white";
//       default:
//         return "bg-blue-500 text-white";
//     }
//   };

//   // Fetch hero images
//   const fetchHeroImages = async () => {
//     setLoading(true);
//     try {
//       const token = localStorage.getItem("authToken");

//       if (!token) {
//         console.error("No authentication token found");
//         showToast("Please login first", "error");
//         return;
//       }

//       const response = await fetch(`${api_base}/hero-image/get-image`, {
//         method: "GET",
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "Content-Type": "application/json",
//         },
//       });

//       const data = await response.json();

//       if (response.status === 401) {
//         showToast("Session expired. Please login again.", "error");
//         localStorage.removeItem("authToken");
//         return;
//       }

//       if (data.success) {
//         setHeroImages(data.data);
//       } else {
//         console.error("API Error:", data.message);
//         showToast(data.message || "Failed to fetch images", "error");
//       }
//     } catch (error) {
//       console.error("Error fetching hero images:", error);
//       showToast("Network error. Please check your connection.", "error");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Handle file selection
//   const handleFileSelect = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       setSelectedFile(file);
//       const preview = URL.createObjectURL(file);
//       setPreviewUrl(preview);
//     }
//   };

//   // Upload hero image
//   const handleUpload = async () => {
//     if (!selectedFile) {
//       showToast("Please select an image first", "error");
//       return;
//     }

//     setUploadLoading(true);
//     const formData = new FormData();
//     formData.append("heroImage", selectedFile);

//     try {
//       const token = localStorage.getItem("authToken");

//       if (!token) {
//         showToast("Please login first", "error");
//         return;
//       }

//       const response = await fetch(`${api_base}/hero-image/create-image`, {
//         method: "POST",
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//         body: formData,
//       });

//       const data = await response.json();

//       if (response.status === 401) {
//         showToast("Session expired. Please login again.", "error");
//         localStorage.removeItem("authToken");
//         return;
//       }

//       if (data.success) {
//         showToast("Hero image uploaded successfully!", "success");
//         setSelectedFile(null);
//         setPreviewUrl(null);
//         fetchHeroImages();
//         document.getElementById("fileInput").value = "";
//       } else {
//         showToast(data.message || "Upload failed", "error");
//       }
//     } catch (error) {
//       console.error("Error uploading image:", error);
//       showToast("Upload failed. Please try again.", "error");
//     } finally {
//       setUploadLoading(false);
//     }
//   };

//   // Delete hero image
//   const handleDelete = async (imageId) => {
//     if (!window.confirm("Are you sure you want to delete this hero image?")) {
//       return;
//     }

//     setDeleteLoading(imageId);
//     try {
//       const token = localStorage.getItem("authToken");

//       if (!token) {
//         showToast("Please login first", "error");
//         return;
//       }

//       const response = await fetch(
//         `${api_base}/hero-image/delete-image/${imageId}`,
//         {
//           method: "DELETE",
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "application/json",
//           },
//         }
//       );

//       const data = await response.json();

//       if (response.status === 401) {
//         showToast("Session expired. Please login again.", "error");
//         localStorage.removeItem("authToken");
//         return;
//       }

//       if (data.success) {
//         showToast("Hero image deleted successfully!", "success");
//         fetchHeroImages();
//       } else {
//         showToast(data.message || "Delete failed", "error");
//       }
//     } catch (error) {
//       console.error("Error deleting image:", error);
//       showToast("Delete failed. Please try again.", "error");
//     } finally {
//       setDeleteLoading(null);
//     }
//   };

//   // Open modal with image
//   const handleViewImage = (image) => {
//     setModalImage(image);
//     setShowModal(true);
//   };

//   // Close modal
//   const closeModal = () => {
//     setShowModal(false);
//     setModalImage(null);
//   };

//   useEffect(() => {
//     fetchHeroImages();
//   }, []);

//   return (
//     <div className="p-6 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
//       <div className="max-w-7xl mx-auto">
//         {/* Header */}
//         <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
//           <div className="flex justify-between items-center">
//             <div className="flex items-center space-x-4">
//               <div className="p-3 bg-blue-100 rounded-full">
//                 <ImageIcon className="w-8 h-8 text-blue-600" />
//               </div>
//               <div>
//                 <h2 className="text-3xl font-bold text-gray-800">
//                   Hero Image Management
//                 </h2>
//                 <p className="text-gray-600 mt-1 flex items-center">
//                   <span className="inline-block w-2 h-2 bg-green-500 rounded-full mr-2"></span>
//                   Total: {heroImages.length} images
//                 </p>
//               </div>
//             </div>
//             <button
//               onClick={fetchHeroImages}
//               disabled={loading}
//               className="flex items-center px-6 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-800 transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
//             >
//               <RefreshCw
//                 className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`}
//               />
//               Refresh
//             </button>
//           </div>
//         </div>

//         {/* Upload Section */}
//         <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
//           <h3 className="text-xl font-semibold mb-6 text-gray-800">
//             Upload New Hero Image
//           </h3>

//           <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 hover:border-blue-400 transition-colors">
//             <div className="flex flex-col items-center space-y-4">
//               <Upload className="w-12 h-12 text-gray-400" />

//               <input
//                 id="fileInput"
//                 type="file"
//                 accept="image/*"
//                 onChange={handleFileSelect}
//                 className="file:mr-4 file:py-3 file:px-6 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 file:cursor-pointer cursor-pointer"
//               />

//               {previewUrl && (
//                 <div className="mt-6">
//                   <p className="text-sm text-gray-600 mb-3 font-medium">
//                     Preview:
//                   </p>
//                   <img
//                     src={previewUrl}
//                     alt="Preview"
//                     className="w-64 h-40 object-cover rounded-lg border-2 border-gray-200 shadow-md"
//                   />
//                 </div>
//               )}

//               <button
//                 onClick={handleUpload}
//                 disabled={!selectedFile || uploadLoading}
//                 className="flex items-center px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 font-semibold"
//               >
//                 {uploadLoading ? (
//                   <>
//                     <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
//                     Uploading...
//                   </>
//                 ) : (
//                   <>
//                     <Upload className="w-4 h-4 mr-2" />
//                     Upload Image
//                   </>
//                 )}
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* Images Table */}
//         <div className="bg-white rounded-xl shadow-lg overflow-hidden">
//           <div className="px-6 py-4 border-b border-gray-200">
//             <h3 className="text-xl font-semibold text-gray-800">
//               Existing Hero Images
//             </h3>
//           </div>

//           {loading ? (
//             <div className="flex justify-center items-center py-12">
//               <RefreshCw className="w-8 h-8 animate-spin text-blue-600" />
//               <span className="ml-3 text-lg text-gray-600">
//                 Loading images...
//               </span>
//             </div>
//           ) : heroImages.length === 0 ? (
//             <div className="text-center py-12 text-gray-500">
//               <ImageIcon className="w-16 h-16 mx-auto text-gray-300 mb-4" />
//               <p className="text-lg font-medium">No hero images found</p>
//               <p className="text-sm">Upload your first hero image above</p>
//             </div>
//           ) : (
//             <div className="overflow-x-auto">
//               <table className="w-full">
//                 <thead className="bg-gray-50">
//                   <tr>
//                     <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
//                       ID
//                     </th>
//                     <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
//                       Image
//                     </th>
//                     <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
//                       Uploaded By
//                     </th>
//                     <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
//                       Upload Date
//                     </th>
//                     <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
//                       Actions
//                     </th>
//                   </tr>
//                 </thead>
//                 <tbody className="divide-y divide-gray-200">
//                   {heroImages.map((image, index) => (
//                     <tr
//                       key={image._id}
//                       className="hover:bg-gray-50 transition-colors"
//                     >
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <span className="px-3 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full">
//                           #{image._id.slice(-6)}
//                         </span>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <img
//                           src={`${image.image}`}
//                           alt="Hero"
//                           className="w-20 h-14 object-cover rounded-lg border-2 border-gray-200 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
//                           onError={(e) => {
//                             e.target.src = "/placeholder-image.png";
//                           }}
//                           onClick={() => handleViewImage(image)}
//                         />
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <div className="flex items-center">
//                           <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
//                             <span className="text-sm font-medium text-blue-600">
//                               {(image.userId?.name || "Admin")
//                                 .charAt(0)
//                                 .toUpperCase()}
//                             </span>
//                           </div>
//                           <span className="text-sm font-medium text-gray-900">
//                             {image.userId?.name || "Admin"}
//                           </span>
//                         </div>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
//                         {new Date(image.createdAt).toLocaleDateString("en-US", {
//                           year: "numeric",
//                           month: "short",
//                           day: "numeric",
//                         })}
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <div className="flex space-x-3">
//                           <button
//                             onClick={() => handleViewImage(image)}
//                             className="flex items-center px-3 py-2 bg-blue-100 text-blue-700 text-sm rounded-lg hover:bg-blue-200 transition-colors"
//                           >
//                             <Eye className="w-4 h-4 mr-1" />
//                             View
//                           </button>
//                           <button
//                             onClick={() => handleDelete(image._id)}
//                             disabled={deleteLoading === image._id}
//                             className="flex items-center px-3 py-2 bg-red-100 text-red-700 text-sm rounded-lg hover:bg-red-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
//                           >
//                             {deleteLoading === image._id ? (
//                               <RefreshCw className="w-4 h-4 mr-1 animate-spin" />
//                             ) : (
//                               <Trash2 className="w-4 h-4 mr-1" />
//                             )}
//                             Delete
//                           </button>
//                         </div>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Modal */}
//       {showModal && modalImage && (
//         <div className="fixed inset-0 bg-black/50 bg-opacity-75 flex items-center justify-center z-[999999] p-4">
//           <div className="bg-white rounded-xl max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl">
//             <div className="flex justify-between items-center p-6 border-b border-gray-200">
//               <div>
//                 <h3 className="text-xl font-semibold text-gray-800">
//                   Hero Image Preview
//                 </h3>
//                 <p className="text-sm text-gray-600">
//                   ID: #{modalImage._id.slice(-6)}
//                 </p>
//               </div>
//               <button
//                 onClick={closeModal}
//                 className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
//               >
//                 <X className="w-6 h-6 text-gray-600" />
//               </button>
//             </div>

//             <div className="p-6">
//               <div className="flex flex-col lg:flex-row gap-6">
//                 <div className="flex-1">
//                   <img
//                     src={`${modalImage.image}`}
//                     alt="Hero"
//                     className="w-full max-h-96 object-contain rounded-lg shadow-lg"
//                     onError={(e) => {
//                       e.target.src = "/placeholder-image.png";
//                     }}
//                   />
//                 </div>

//                 <div className="lg:w-80 space-y-4">
//                   <div className="bg-gray-50 rounded-lg p-4">
//                     <h4 className="font-semibold text-gray-800 mb-3">
//                       Image Details
//                     </h4>
//                     <div className="space-y-2 text-sm">
//                       <div className="flex justify-between">
//                         <span className="text-gray-600">Uploaded by:</span>
//                         <span className="font-medium">
//                           {modalImage.userId?.name || "Admin"}
//                         </span>
//                       </div>
//                       <div className="flex justify-between">
//                         <span className="text-gray-600">Upload Date:</span>
//                         <span className="font-medium">
//                           {new Date(modalImage.createdAt).toLocaleDateString()}
//                         </span>
//                       </div>
//                       <div className="flex justify-between">
//                         <span className="text-gray-600">ID:</span>
//                         <span className="font-medium font-mono">
//                           #{modalImage._id.slice(-6)}
//                         </span>
//                       </div>
//                     </div>
//                   </div>

//                   <div className="flex flex-col space-y-3">
//                     <button
//                       onClick={() =>
//                         window.open(`${modalImage.image}`, "_blank")
//                       }
//                       className="flex items-center justify-center px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
//                     >
//                       <Eye className="w-4 h-4 mr-2" />
//                       Open in New Tab
//                     </button>

//                     <button
//                       onClick={() => {
//                         closeModal();
//                         handleDelete(modalImage._id);
//                       }}
//                       className="flex items-center justify-center px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
//                     >
//                       <Trash2 className="w-4 h-4 mr-2" />
//                       Delete Image
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Toast Notifications */}
//       <div className="fixed top-4 right-4 z-50 space-y-2">
//         {toasts.map((toast) => (
//           <div
//             key={toast.id}
//             className={`flex items-center p-4 rounded-lg shadow-lg transform transition-all duration-300 ease-in-out ${getToastColors(
//               toast.type
//             )} min-w-80`}
//           >
//             <div className="flex items-center">
//               {getToastIcon(toast.type)}
//               <span className="ml-3 font-medium">{toast.message}</span>
//             </div>
//             <button
//               onClick={() => removeToast(toast.id)}
//               className="ml-4 hover:bg-white hover:bg-opacity-20 rounded-full p-1 transition-colors"
//             >
//               <X className="w-4 h-4" />
//             </button>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default HeroImage;

import React, { useState, useEffect } from "react";
import {
  X,
  Eye,
  Trash2,
  Upload,
  RefreshCw,
  Image,
  CheckCircle,
  AlertCircle,
  Info,
  Video,
  Play,
  Pause,
} from "lucide-react";

const HeroImage = () => {
  // Video state (single video)
  const [heroVideo, setHeroVideo] = useState(null);
  const [selectedVideoFile, setSelectedVideoFile] = useState(null);
  const [videoPreviewUrl, setVideoPreviewUrl] = useState(null);
  const [videoUploadLoading, setVideoUploadLoading] = useState(false);
  const [videoDeleteLoading, setVideoDeleteLoading] = useState(false);
  const [showVideoModal, setShowVideoModal] = useState(false);

  // Image state (multiple images)
  const [heroImages, setHeroImages] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState(null);
  const [imageUploadLoading, setImageUploadLoading] = useState(false);
  const [imageDeleteLoading, setImageDeleteLoading] = useState(null);
  const [showImageModal, setShowImageModal] = useState(false);
  const [modalImage, setModalImage] = useState(null);

  // Common state
  const [loading, setLoading] = useState(false);
  const [toasts, setToasts] = useState([]);
  const api_base = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

  // Toast notification system
  const showToast = (message, type = "info") => {
    const id = Date.now();
    const toast = { id, message, type };
    setToasts((prev) => [...prev, toast]);

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

  // Fetch hero video (single)
  const fetchHeroVideo = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("authToken");

      if (!token) {
        console.error("No authentication token found");
        showToast("Please login first", "error");
        return;
      }

      const response = await fetch(`${api_base}/hero-image/get-video`, {
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
        // Set single video (take first one if multiple exist)
        setHeroVideo(data.data && data.data.length > 0 ? data.data[0] : null);
      } else {
        console.error("API Error:", data.message);
        // showToast(data.message || "Failed to fetch video", "error");
      }
    } catch (error) {
      console.error("Error fetching hero video:", error);
      // showToast("Network error. Please check your connection.", "error");
    } finally {
      setLoading(false);
    }
  };

  // Fetch hero images (multiple)
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
        // showToast(data.message || "Failed to fetch images", "error");
      }
    } catch (error) {
      console.error("Error fetching hero images:", error);
      // showToast("Network error. Please check your connection.", "error");
    } finally {
      setLoading(false);
    }
  };

  // Handle video file selection
  const handleVideoFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedVideoFile(file);
      const preview = URL.createObjectURL(file);
      setVideoPreviewUrl(preview);
    }
  };

  // Handle image file selection
  const handleImageFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      const preview = URL.createObjectURL(file);
      setImagePreviewUrl(preview);
    }
  };

  // Upload hero video (replaces existing one)
  const handleVideoUpload = async () => {
    if (!selectedVideoFile) {
      showToast("Please select a video first", "error");
      return;
    }

    // Show confirmation if video already exists
    if (heroVideo) {
      const confirmReplace = window.confirm(
        "A hero video already exists. Uploading a new video will replace the current one. Do you want to continue?"
      );
      if (!confirmReplace) {
        return;
      }
    }

    setVideoUploadLoading(true);
    const formData = new FormData();
    formData.append("video", selectedVideoFile);

    try {
      const token = localStorage.getItem("authToken");

      if (!token) {
        showToast("Please login first", "error");
        return;
      }

      const response = await fetch(`${api_base}/hero-image/create-video`, {
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
        showToast(
          heroVideo
            ? "Hero video replaced successfully!"
            : "Hero video uploaded successfully!",
          "success"
        );
        setSelectedVideoFile(null);
        setVideoPreviewUrl(null);
        fetchHeroVideo();
        document.getElementById("videoFileInput").value = "";
      } else {
        // showToast(data.message || "Video upload failed", "error");
      }
    } catch (error) {
      console.error("Error uploading video:", error);
      showToast("Video upload failed. Please try again.", "error");
    } finally {
      setVideoUploadLoading(false);
    }
  };

  // Upload hero image (adds to collection)
  const handleImageUpload = async () => {
    if (!selectedFile) {
      showToast("Please select an image first", "error");
      return;
    }

    setImageUploadLoading(true);
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
        setImagePreviewUrl(null);
        fetchHeroImages();
        document.getElementById("imageFileInput").value = "";
      } else {
        showToast(data.message || "Image upload failed", "error");
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      showToast("Image upload failed. Please try again.", "error");
    } finally {
      setImageUploadLoading(false);
    }
  };

  // Delete hero video
  const handleVideoDelete = async () => {
    if (!window.confirm("Are you sure you want to delete the hero video?")) {
      return;
    }

    setVideoDeleteLoading(true);
    try {
      const token = localStorage.getItem("authToken");

      if (!token) {
        showToast("Please login first", "error");
        return;
      }

      const response = await fetch(
        `${api_base}/hero-image/delete-video/${heroVideo._id}`,
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
        showToast("Hero video deleted successfully!", "success");
        setHeroVideo(null);
        setShowVideoModal(false);
      } else {
        showToast(data.message || "Video delete failed", "error");
      }
    } catch (error) {
      console.error("Error deleting video:", error);
      showToast("Video delete failed. Please try again.", "error");
    } finally {
      setVideoDeleteLoading(false);
    }
  };

  // Delete hero image
  const handleImageDelete = async (imageId) => {
    if (!window.confirm("Are you sure you want to delete this hero image?")) {
      return;
    }

    setImageDeleteLoading(imageId);
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
        showToast(data.message || "Image delete failed", "error");
      }
    } catch (error) {
      console.error("Error deleting image:", error);
      showToast("Image delete failed. Please try again.", "error");
    } finally {
      setImageDeleteLoading(null);
    }
  };

  // Modal handlers
  const handleViewVideo = () => {
    setShowVideoModal(true);
  };

  const handleViewImage = (image) => {
    setModalImage(image);
    setShowImageModal(true);
  };

  const closeVideoModal = () => {
    setShowVideoModal(false);
  };

  const closeImageModal = () => {
    setShowImageModal(false);
    setModalImage(null);
  };

  const refreshAll = () => {
    fetchHeroVideo();
    fetchHeroImages();
  };

  useEffect(() => {
    fetchHeroVideo();
    fetchHeroImages();
  }, []);

  return (
    <div className="p-6 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-purple-100 rounded-full">
                <Video className="w-8 h-8 text-purple-600" />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-gray-800">
                  Hero Media Management
                </h2>
                <p className="text-gray-600 mt-1 flex items-center">
                  <span className="inline-block w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                  Video: {heroVideo ? "1" : "0"} | Images: {heroImages.length}
                </p>
              </div>
            </div>
            <button
              onClick={refreshAll}
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

        {/* Video Upload Section */}
        {/* <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h3 className="text-xl font-semibold mb-6 text-gray-800 flex items-center">
            <Video className="w-6 h-6 mr-2 text-purple-600" />
            {heroVideo ? "Replace Hero Video" : "Upload Hero Video"}
          </h3>

          <div className="border-2 border-dashed border-purple-300 rounded-lg p-8 hover:border-purple-400 transition-colors">
            <div className="flex flex-col items-center space-y-4">
              <Video className="w-12 h-12 text-purple-400" />

              {heroVideo && (
                <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-sm text-yellow-800 text-center">
                    ⚠️ A hero video already exists. Uploading will replace the
                    current video.
                  </p>
                </div>
              )}

              <input
                id="videoFileInput"
                type="file"
                accept="video/*"
                onChange={handleVideoFileSelect}
                className="file:mr-4 file:py-3 file:px-6 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100 file:cursor-pointer cursor-pointer"
              />

              {videoPreviewUrl && (
                <div className="mt-6">
                  <p className="text-sm text-gray-600 mb-3 font-medium">
                    Video Preview:
                  </p>
                  <video
                    src={videoPreviewUrl}
                    controls
                    className="w-80 h-48 object-cover rounded-lg border-2 border-gray-200 shadow-md"
                  />
                </div>
              )}

              <button
                onClick={handleVideoUpload}
                disabled={!selectedVideoFile || videoUploadLoading}
                className="flex items-center px-8 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 font-semibold"
              >
                {videoUploadLoading ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    {heroVideo ? "Replacing Video..." : "Uploading Video..."}
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4 mr-2" />
                    {heroVideo ? "Replace Video" : "Upload Video"}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {heroVideo && (
          <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-xl font-semibold text-gray-800 flex items-center">
                <Video className="w-6 h-6 mr-2 text-purple-600" />
                Current Hero Video
              </h3>
            </div>

            <div className="p-6">
              <div className="flex items-center justify-between bg-gray-50 rounded-lg p-4">
                <div className="flex items-center space-x-4">
                  <div
                    className="relative w-24 h-16 bg-gray-100 rounded-lg border-2 border-gray-200 shadow-sm hover:shadow-md transition-shadow cursor-pointer overflow-hidden"
                    onClick={handleViewVideo}
                  >
                    <video
                      src={`${heroVideo.video}`}
                      className="w-full h-full object-cover"
                      muted
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30">
                      <Play className="w-6 h-6 text-white" />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="px-2 py-1 text-xs font-medium bg-purple-100 text-purple-800 rounded-full">
                        #{heroVideo._id.slice(-6)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">
                      Uploaded by:{" "}
                      <span className="font-medium">
                        {heroVideo.userId?.name || "Admin"}
                      </span>
                    </p>
                    <p className="text-sm text-gray-600">
                      Date:{" "}
                      {new Date(heroVideo.createdAt).toLocaleDateString(
                        "en-US",
                        {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        }
                      )}
                    </p>
                  </div>
                </div>

                <div className="flex space-x-3">
                  <button
                    onClick={handleViewVideo}
                    className="flex items-center px-4 py-2 bg-purple-100 text-purple-700 text-sm rounded-lg hover:bg-purple-200 transition-colors"
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    View
                  </button>
                  <button
                    onClick={handleVideoDelete}
                    disabled={videoDeleteLoading}
                    className="flex items-center px-4 py-2 bg-red-100 text-red-700 text-sm rounded-lg hover:bg-red-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {videoDeleteLoading ? (
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <Trash2 className="w-4 h-4 mr-2" />
                    )}
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        )} */}

        {/* Image Upload Section */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h3 className="text-xl font-semibold mb-6 text-gray-800 flex items-center">
            <Image className="w-6 h-6 mr-2 text-blue-600" />
            Upload New Hero Image
          </h3>

          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 hover:border-blue-400 transition-colors">
            <div className="flex flex-col items-center space-y-4">
              <Upload className="w-12 h-12 text-gray-400" />

              <input
                id="imageFileInput"
                type="file"
                accept="image/*"
                onChange={handleImageFileSelect}
                className="file:mr-4 file:py-3 file:px-6 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 file:cursor-pointer cursor-pointer"
              />

              {imagePreviewUrl && (
                <div className="mt-6">
                  <p className="text-sm text-gray-600 mb-3 font-medium">
                    Image Preview:
                  </p>
                  <img
                    src={imagePreviewUrl}
                    alt="Preview"
                    className="w-64 h-40 object-cover rounded-lg border-2 border-gray-200 shadow-md"
                  />
                </div>
              )}

              <button
                onClick={handleImageUpload}
                disabled={!selectedFile || imageUploadLoading}
                className="flex items-center px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 font-semibold"
              >
                {imageUploadLoading ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Uploading Image...
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4 mr-2" />
                    Add Image
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Images Table */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-xl font-semibold text-gray-800 flex items-center">
              <Image className="w-6 h-6 mr-2 text-blue-600" />
              Hero Images Collection
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
              <Image className="w-16 h-16 mx-auto text-gray-300 mb-4" />
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
                            onClick={() => handleImageDelete(image._id)}
                            disabled={imageDeleteLoading === image._id}
                            className="flex items-center px-3 py-2 bg-red-100 text-red-700 text-sm rounded-lg hover:bg-red-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {imageDeleteLoading === image._id ? (
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

      {/* Video Modal */}
      {showVideoModal && heroVideo && (
        <div className="fixed inset-0 bg-black/50 bg-opacity-75 flex items-center justify-center z-[999999] p-4">
          <div className="bg-white rounded-xl max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl">
            <div className="flex justify-between items-center p-6 border-b border-gray-200">
              <div>
                <h3 className="text-xl font-semibold text-gray-800">
                  Hero Video Preview
                </h3>
                <p className="text-sm text-gray-600">
                  ID: #{heroVideo._id.slice(-6)}
                </p>
              </div>
              <button
                onClick={closeVideoModal}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-6 h-6 text-gray-600" />
              </button>
            </div>

            <div className="p-6">
              <div className="flex flex-col lg:flex-row gap-6">
                <div className="flex-1">
                  <video
                    src={`${heroVideo.video}`}
                    controls
                    className="w-full max-h-96 rounded-lg shadow-lg"
                  />
                </div>

                <div className="lg:w-80 space-y-4">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-800 mb-3">
                      Video Details
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Uploaded by:</span>
                        <span className="font-medium">
                          {heroVideo.userId?.name || "Admin"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Upload Date:</span>
                        <span className="font-medium">
                          {new Date(heroVideo.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">ID:</span>
                        <span className="font-medium font-mono">
                          #{heroVideo._id.slice(-6)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col space-y-3">
                    <button
                      onClick={() =>
                        window.open(`${heroVideo.video}`, "_blank")
                      }
                      className="flex items-center justify-center px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      Open in New Tab
                    </button>

                    <button
                      onClick={() => {
                        closeVideoModal();
                        handleVideoDelete();
                      }}
                      className="flex items-center justify-center px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete Video
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Image Modal */}
      {showImageModal && modalImage && (
        <div className="fixed inset-0 bg-black/50 bg-opacity-75 flex items-center justify-center z-[999999] p-4">
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
                onClick={closeImageModal}
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
                        closeImageModal();
                        handleImageDelete(modalImage._id);
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
              className="ml-4 hover:bg-white hover:text-black hover:bg-opacity-20 rounded-full p-1 transition-colors"
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
