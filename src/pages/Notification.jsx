import { useState } from "react";

export default function Notification() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };

  const handleDescriptionChange = (e) => {
    setDescription(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Title: ${title}\nDescription: ${description}`);
  };

  //   const handleReset = () => {
  //     setTitle('');
  //     setDescription('');
  //   };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Main Form */}
        <div className="bg-white shadow-lg rounded-lg p-6 mb-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title Input */}
            <div>
              <label
                htmlFor="title"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Title
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={title}
                onChange={handleTitleChange}
                placeholder="Enter title here..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
              />
            </div>

            {/* Description Input */}
            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={description}
                onChange={handleDescriptionChange}
                placeholder="Enter description here..."
                rows={6}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors resize-vertical"
              />
            </div>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                type="submit"
                className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors font-medium"
              >
                Submit
              </button>
              {/* <button
                type="button"
                onClick={handleReset}
                className="flex-1 bg-gray-600 text-white py-3 px-6 rounded-lg hover:bg-gray-700 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors font-medium"
              >
                Reset
              </button> */}
            </div>
          </form>
        </div>

        {/* Preview Section */}
        {(title || description) && (
          <div className="bg-white shadow-lg rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Preview
            </h2>

            {/* Title Preview */}
            {title && (
              <div className="mb-4">
                <h3 className="text-sm font-medium text-gray-500 mb-1">
                  Title:
                </h3>
                <p className="text-lg font-semibold text-gray-900 bg-gray-50 p-3 rounded-lg">
                  {title}
                </p>
              </div>
            )}

            {/* Description Preview */}
            {description && (
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">
                  Description:
                </h3>
                <div className="text-gray-700 bg-gray-50 p-3 rounded-lg whitespace-pre-wrap">
                  {description}
                </div>
              </div>
            )}
          </div>
        )}

      

        {/* Additional Info Card */}
      </div>
    </div>
  );
}
