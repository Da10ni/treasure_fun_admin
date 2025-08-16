// import { useState } from "react";

// export default function Notification() {
//   const [title, setTitle] = useState("");
//   const [description, setDescription] = useState("");

//   const handleTitleChange = (e) => {
//     setTitle(e.target.value);
//   };

//   const handleDescriptionChange = (e) => {
//     setDescription(e.target.value);
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     alert(`Title: ${title}\nDescription: ${description}`);
//   };

//   //   const handleReset = () => {
//   //     setTitle('');
//   //     setDescription('');
//   //   };

//   return (
//     <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
//       <div className="max-w-3xl mx-auto">
//         {/* Main Form */}
//         <div className="bg-white shadow-lg rounded-lg p-6 mb-8">
//           <form onSubmit={handleSubmit} className="space-y-6">
//             {/* Title Input */}
//             <div>
//               <label
//                 htmlFor="title"
//                 className="block text-sm font-medium text-gray-700 mb-2"
//               >
//                 Title
//               </label>
//               <input
//                 type="text"
//                 id="title"
//                 name="title"
//                 value={title}
//                 onChange={handleTitleChange}
//                 placeholder="Enter title here..."
//                 className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
//               />
//             </div>

//             {/* Description Input */}
//             <div>
//               <label
//                 htmlFor="description"
//                 className="block text-sm font-medium text-gray-700 mb-2"
//               >
//                 Description
//               </label>
//               <textarea
//                 id="description"
//                 name="description"
//                 value={description}
//                 onChange={handleDescriptionChange}
//                 placeholder="Enter description here..."
//                 rows={6}
//                 className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors resize-vertical"
//               />
//             </div>

//             {/* Buttons */}
//             <div className="flex flex-col sm:flex-row gap-3">
//               <button
//                 type="submit"
//                 className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors font-medium"
//               >
//                 Submit
//               </button>
//             </div>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// }
import { useState, useEffect } from "react";
import {
  Loader,
  Send,
  FileText,
  MessageSquare,
  CheckCircle,
  AlertCircle,
  Info,
  X,
} from "lucide-react";

export default function Notification() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
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

  // Fetch notification data and populate inputs
  const fetchNotificationData = async () => {
    try {
      const token = localStorage.getItem("authToken");

      if (!token) {
        showToast("Please login first", "error");
        return;
      }

      const response = await fetch(`${api_base}/notification/get-notification`, {
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

      if (data.success && data.data) {
        // API se direct object aa raha hai, array nahi
        const latestNotification = data.data;
        setTitle(latestNotification.title);
        setDescription(latestNotification.description);
        showToast("Notification data loaded in form", "success");
      } else {
        showToast("No notification data found", "info");
      }
    } catch (error) {
      console.error("Error fetching notification:", error);
      showToast("Network error. Please check your connection.", "error");
    }
  };

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };

  const handleDescriptionChange = (e) => {
    setDescription(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!title.trim()) {
      showToast("Title is required!", "error");
      return;
    }

    if (!description.trim()) {
      showToast("Description is required!", "error");
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem("authToken");

      if (!token) {
        showToast("Please login first", "error");
        setLoading(false);
        return;
      }

      const response = await fetch(
        `${api_base}/notification/create-notification`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            title: title.trim(),
            description: description.trim(),
          }),
        }
      );

      const data = await response.json();

      if (response.status === 401) {
        showToast("Session expired. Please login again.", "error");
        localStorage.removeItem("authToken");
        setLoading(false);
        return;
      }

      if (data.success) {
        showToast("Notification created successfully!", "success");
      } else {
        showToast(data.message || "Failed to create notification", "error");
      }
    } catch (error) {
      console.error("Error creating notification:", error);
      showToast("Network error. Please check your connection.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setTitle("");
    setDescription("");
    showToast("Form reset successfully!", "info");
  };

  // Load notification data on component mount
  useEffect(() => {
    fetchNotificationData();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
            <MessageSquare className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Create Notification
          </h1>
          <p className="text-gray-600">
            Send important updates and announcements to users
          </p>
        </div>

        {/* Main Form */}
        <div className="bg-white shadow-xl rounded-xl p-8 mb-8 border border-gray-200">
          <div className="space-y-6">
            {/* Title Input */}
            <div>
              <label
                htmlFor="title"
                className="flex items-center text-sm font-semibold text-gray-700 mb-3"
              >
                <FileText className="w-4 h-4 mr-2 text-blue-600" />
                Notification Title
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={title}
                onChange={handleTitleChange}
                placeholder="Enter a clear and concise title..."
                disabled={loading}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 disabled:bg-gray-50 disabled:cursor-not-allowed"
                maxLength={100}
              />
              <div className="flex justify-between mt-1">
                <span className="text-xs text-gray-500">
                  Make it engaging and informative
                </span>
                <span className="text-xs text-gray-400">
                  {title.length}/100
                </span>
              </div>
            </div>

            {/* Description Input */}
            <div>
              <label
                htmlFor="description"
                className="flex items-center text-sm font-semibold text-gray-700 mb-3"
              >
                <MessageSquare className="w-4 h-4 mr-2 text-blue-600" />
                Notification Description
              </label>
              <textarea
                id="description"
                name="description"
                value={description}
                onChange={handleDescriptionChange}
                placeholder="Provide detailed information about your notification..."
                rows={6}
                disabled={loading}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 resize-vertical disabled:bg-gray-50 disabled:cursor-not-allowed"
                maxLength={500}
              />
              <div className="flex justify-between mt-1">
                <span className="text-xs text-gray-500">
                  Include all relevant details and context
                </span>
                <span className="text-xs text-gray-400">
                  {description.length}/500
                </span>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <button
                type="button"
                onClick={handleSubmit}
                disabled={loading || !title.trim() || !description.trim()}
                className="flex-1 flex items-center justify-center bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 font-semibold disabled:bg-gray-400 disabled:cursor-not-allowed transform hover:scale-105 disabled:transform-none"
              >
                {loading ? (
                  <>
                    <Loader className="w-5 h-5 mr-2 animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5 mr-2" />
                    Send Notification
                  </>
                )}
              </button>
              
              <button
                type="button"
                onClick={handleReset}
                disabled={loading}
                className="sm:w-auto bg-gray-600 text-white py-3 px-6 rounded-lg hover:bg-gray-700 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all duration-200 font-semibold disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                Reset Form
              </button>
            </div>
          </div>
        </div>
      </div>

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
}