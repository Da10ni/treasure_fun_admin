import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import {
  Package,
  Plus,
  X,
  RefreshCw,
  Eye,
  Trash2,
  DollarSign,
} from "lucide-react";

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const API_BASE = import.meta.env.VITE_API_BASE_URL;
  const [formData, setFormData] = useState({
    title: "",
    image: "",
    status: "active",
    priceRange: {
      min: "",
      max: "",
    },
    income: "",
    handlingFee: "",
  });
  const [detailsModal, setDetailsModal] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(null);

  // Reset form data
  const resetForm = () => {
    setFormData({
      title: "",
      image: "",
      status: "active",
      priceRange: { min: "", max: "" },
      income: "",
      handlingFee: "",
    });
  };

  // Fetch all products
  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem("authToken");

      if (!token) {
        toast.error("Authentication required. Please login again.", {
          position: "top-right",
          autoClose: 3000,
        });
        return;
      }

      const response = await fetch(`${API_BASE}/products/allproducts`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          toast.error("Session expired. Please login again.", {
            position: "top-right",
            autoClose: 5000,
          });
          return;
        }
        throw new Error(`HTTP ${response.status}: Failed to fetch products`);
      }

      const data = await response.json();

      if (data.success) {
        setProducts(data.data);

        toast.success(`📦 Loaded ${data.data.length} products successfully`, {
          position: "top-right",
          autoClose: 2000,
        });
      } else {
        throw new Error(data.message || "Failed to fetch products");
      }
    } catch (err) {
      setError(err.message);

      toast.error(`Failed to load products: ${err.message}`, {
        position: "top-right",
        autoClose: 5000,
      });

      console.error("Error fetching products:", err);
    } finally {
      setLoading(false);
    }
  };

  // Add new product
  const handleAddProduct = async (e) => {
    e.preventDefault();

    // Client-side validation
    if (!formData.title.trim()) {
      toast.error("Product title is required", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    if (!formData.image.trim()) {
      toast.error("Product image URL is required", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    if (!formData.priceRange.min || !formData.priceRange.max) {
      toast.error("Both minimum and maximum prices are required", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    if (Number(formData.priceRange.min) >= Number(formData.priceRange.max)) {
      toast.error("Maximum price must be greater than minimum price", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    if (
      !formData.income ||
      Number(formData.income) < 0 ||
      Number(formData.income) > 100
    ) {
      toast.error("Income percentage must be between 0 and 100", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    try {
      setSubmitLoading(true);

      const token = localStorage.getItem("authToken");

      if (!token) {
        toast.error("Authentication required. Please login again.", {
          position: "top-right",
          autoClose: 3000,
        });
        return;
      }

      // Show loading toast
      const loadingToast = toast.loading("Adding new product...", {
        position: "top-right",
      });

      const response = await fetch(`${API_BASE}/products/addproducts`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          priceRange: {
            min: Number(formData.priceRange.min),
            max: Number(formData.priceRange.max),
          },
          income: Number(formData.income),
        }),
      });

      // Dismiss loading toast
      toast.dismiss(loadingToast);

      if (!response.ok) {
        if (response.status === 401) {
          toast.error("Session expired. Please login again.", {
            position: "top-right",
            autoClose: 5000,
          });
          return;
        }
        throw new Error(`HTTP ${response.status}: Failed to add product`);
      }

      const data = await response.json();

      if (data.success) {
        // Refresh the products list
        await fetchProducts();
        setShowAddForm(false);
        resetForm();

        toast.success(`✅ Product "${formData.title}" added successfully!`, {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      } else {
        throw new Error(data.message || "Failed to add product");
      }
    } catch (err) {
      toast.error(`❌ Error adding product: ${err.message}`, {
        position: "top-right",
        autoClose: 5000,
      });
      console.error("Error adding product:", err);
    } finally {
      setSubmitLoading(false);
    }
  };

  // Delete product with confirmation modal
  const handleDeleteProduct = async (id, title) => {
    // Create a custom confirmation modal
    const showConfirmModal = () => {
      return new Promise((resolve) => {
        const modal = document.createElement("div");
        modal.className =
          "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50";
        modal.innerHTML = `
          <div class="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div class="p-6">
              <div class="flex items-center gap-3 mb-4">
                <div class="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                  <svg class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                  </svg>
                </div>
                <div>
                  <h3 class="text-lg font-semibold text-gray-900">Delete Product</h3>
                  <p class="text-gray-600">This action cannot be undone</p>
                </div>
              </div>
              <p class="text-gray-700 mb-6">
                Are you sure you want to delete "<strong>${title}</strong>"?
              </p>
              <div class="flex gap-3 justify-end">
                <button id="cancel-delete" class="px-4 py-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded">Cancel</button>
                <button id="confirm-delete" class="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">Delete Product</button>
              </div>
            </div>
          </div>
        `;

        document.body.appendChild(modal);

        const cancelBtn = modal.querySelector("#cancel-delete");
        const confirmBtn = modal.querySelector("#confirm-delete");

        cancelBtn.onclick = () => {
          document.body.removeChild(modal);
          resolve(false);
        };

        confirmBtn.onclick = () => {
          document.body.removeChild(modal);
          resolve(true);
        };
      });
    };

    const confirmed = await showConfirmModal();
    if (!confirmed) return;

    try {
      setActionLoading(id);

      const token = localStorage.getItem("authToken");

      if (!token) {
        toast.error("Authentication required. Please login again.", {
          position: "top-right",
          autoClose: 3000,
        });
        return;
      }

      // Show loading toast
      const loadingToast = toast.loading(`Deleting product "${title}"...`, {
        position: "top-right",
      });

      const response = await fetch(
        `${API_BASE}/products/delete-products/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      // Dismiss loading toast
      toast.dismiss(loadingToast);

      if (!response.ok) {
        if (response.status === 401) {
          toast.error("Session expired. Please login again.", {
            position: "top-right",
            autoClose: 5000,
          });
          return;
        }
        throw new Error(`HTTP ${response.status}: Failed to delete product`);
      }

      const data = await response.json();

      if (data.success) {
        // Refresh the products list
        await fetchProducts();

        toast.success(`🗑️ Product "${title}" deleted successfully!`, {
          position: "top-right",
          autoClose: 3000,
        });
      } else {
        throw new Error(data.message || "Failed to delete product");
      }
    } catch (err) {
      toast.error(`❌ Error deleting product: ${err.message}`, {
        position: "top-right",
        autoClose: 5000,
      });
      console.error("Error deleting product:", err);
    } finally {
      setActionLoading(null);
    }
  };

  // Handle view product details
  const handleViewDetails = (product) => {
    setDetailsModal(product);
    toast.success("📋 Product details loaded", {
      position: "top-right",
      autoClose: 1500,
    });
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === "minPrice" || name === "maxPrice") {
      setFormData((prev) => ({
        ...prev,
        priceRange: {
          ...prev.priceRange,
          [name === "minPrice" ? "min" : "max"]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  // Handle form toggle
  const handleFormToggle = () => {
    if (showAddForm) {
      resetForm();
      toast.info("Form cancelled", {
        position: "top-right",
        autoClose: 1500,
      });
    } else {
      toast.info("Opening product form...", {
        position: "top-right",
        autoClose: 1500,
      });
    }
    setShowAddForm(!showAddForm);
  };

  // Format currency
  const formatCurrency = (amount) => {
    return `$${parseFloat(amount).toFixed(2)}`;
  };

  // Get status color
  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "inactive":
        return "bg-yellow-100 text-yellow-800";
      case "discontinued":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Initial load
  useEffect(() => {
    fetchProducts();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-500">Loading products...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        <p>Error: {error}</p>
        <button
          onClick={() => {
            toast.info("Retrying...", {
              position: "top-right",
              autoClose: 1000,
            });
            fetchProducts();
          }}
          className="mt-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-6 p-8">
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="p-4 border-b border-gray-200 flex justify-between items-center">
            <div>
              <h3 className="font-semibold flex items-center gap-2">
                <Package className="w-5 h-5" />
                Product Management
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                Total: {products.length} products
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  toast.info("Refreshing products...", {
                    position: "top-right",
                    autoClose: 1000,
                  });
                  fetchProducts();
                }}
                className="flex items-center gap-2 px-3 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 text-sm transition-colors"
                disabled={loading}
              >
                <RefreshCw
                  className={`w-4 h-4 ${loading ? "animate-spin" : ""}`}
                />
                Refresh
              </button>
              <button
                onClick={handleFormToggle}
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 flex items-center gap-2 transition-colors"
              >
                {showAddForm ? (
                  <>
                    <X className="w-4 h-4" />
                    Cancel
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4" />
                    Add Product
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Add Product Form */}
          {showAddForm && (
            <div className="p-6 border-b border-gray-200 bg-gray-50">
              <h4 className="text-lg font-medium mb-4 flex items-center gap-2">
                <Plus className="w-5 h-5" />
                Add New Product
              </h4>
              <form
                onSubmit={handleAddProduct}
                className="grid grid-cols-1 md:grid-cols-2 gap-4"
              >
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                    placeholder="Enter product title"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Image URL <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="url"
                    name="image"
                    value={formData.image}
                    onChange={handleInputChange}
                    required
                    placeholder="https://example.com/image.jpg"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="discontinued">Discontinued</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Income Percentage <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="income"
                    value={formData.income}
                    onChange={handleInputChange}
                    required
                    min="0"
                    max="100"
                    step="0.1"
                    placeholder="15.5"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Min Price <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="minPrice"
                    value={formData.priceRange.min}
                    onChange={handleInputChange}
                    required
                    min="0"
                    step="0.01"
                    placeholder="100.00"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Max Price <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="maxPrice"
                    value={formData.priceRange.max}
                    onChange={handleInputChange}
                    required
                    min="0"
                    step="0.01"
                    placeholder="500.00"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Handling Fee <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="handlingFee"
                    value={formData.handlingFee}
                    onChange={handleInputChange}
                    required
                    placeholder="$25"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>

                <div className="md:col-span-2 flex gap-3">
                  <button
                    type="submit"
                    disabled={submitLoading}
                    className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                  >
                    {submitLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        Adding...
                      </>
                    ) : (
                      <>
                        <Plus className="w-4 h-4" />
                        Add Product
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={handleFormToggle}
                    className="px-6 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Image
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Title
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Price Range
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Income %
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Handling Fee
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {products.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="px-6 py-12 text-center">
                      <div className="text-gray-400">
                        <Package className="mx-auto h-12 w-12" />
                        <h3 className="mt-2 text-sm font-medium text-gray-900">
                          No products found
                        </h3>
                        <p className="mt-1 text-sm text-gray-500">
                          Get started by adding your first product.
                        </p>
                        <button
                          onClick={() => setShowAddForm(true)}
                          className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
                        >
                          Add Product
                        </button>
                      </div>
                    </td>
                  </tr>
                ) : (
                  products.map((product) => (
                    <tr
                      key={product.id || product._id}
                      className="hover:bg-gray-50"
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-mono">
                        #{(product.id || product._id).slice(-6)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <img
                          src={product.image}
                          alt={product.title}
                          className="h-12 w-12 rounded-lg object-cover border"
                          onError={(e) => {
                            e.target.src =
                              "https://via.placeholder.com/48x48?text=No+Image";
                            toast.warn("Failed to load product image", {
                              position: "top-right",
                              autoClose: 2000,
                            });
                          }}
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {product.title}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <div className="flex items-center gap-1">
                          <DollarSign className="w-3 h-3 text-green-600" />
                          {formatCurrency(product.priceRange.min)} -{" "}
                          {formatCurrency(product.priceRange.max)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-semibold">
                          {product.income}%
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {product.handlingFee}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
                            product.status
                          )}`}
                        >
                          {product.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm flex gap-2">
                        <button
                          onClick={() => handleViewDetails(product)}
                          className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-xs transition-colors flex items-center gap-1"
                        >
                          <Eye className="w-3 h-3" />
                          Details
                        </button>
                        <button
                          onClick={() =>
                            handleDeleteProduct(
                              product.id || product._id,
                              product.title
                            )
                          }
                          disabled={
                            actionLoading === (product.id || product._id)
                          }
                          className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-xs transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
                        >
                          <Trash2 className="w-3 h-3" />
                          {actionLoading === (product.id || product._id)
                            ? "Deleting..."
                            : "Delete"}
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Details Modal */}
      {detailsModal && (
        <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center p-4 z-[9999]">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Package className="w-5 h-5" />
                  Product Details
                </h3>
                <button
                  onClick={() => {
                    setDetailsModal(null);
                    toast.info("Closed product details", {
                      position: "top-right",
                      autoClose: 1000,
                    });
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Product ID
                    </label>
                    <p className="mt-1 text-sm text-gray-900 font-mono">
                      #{detailsModal.id || detailsModal._id}
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Title
                    </label>
                    <p className="mt-1 text-sm text-gray-900">
                      {detailsModal.title}
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Price Range
                    </label>
                    <p className="mt-1 text-sm text-gray-900">
                      {formatCurrency(detailsModal.priceRange?.min)} -{" "}
                      {formatCurrency(detailsModal.priceRange?.max)}
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Income Percentage
                    </label>
                    <p className="mt-1 text-sm text-gray-900">
                      {detailsModal.income}%
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Handling Fee
                    </label>
                    <p className="mt-1 text-sm text-gray-900">
                      {detailsModal.handlingFee}
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Status
                    </label>
                    <span
                      className={`mt-1 inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                        detailsModal.status
                      )}`}
                    >
                      {detailsModal.status}
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Product Image
                  </label>
                  <div className="border rounded-lg overflow-hidden">
                    <img
                      src={detailsModal.image}
                      alt={detailsModal.title}
                      className="w-full h-64 object-cover"
                      onError={(e) => {
                        e.target.src =
                          "https://via.placeholder.com/300x200?text=Image+Not+Available";
                        toast.error("Failed to load product image", {
                          position: "top-right",
                          autoClose: 3000,
                        });
                      }}
                    />
                  </div>
                  <a
                    href={detailsModal.image}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 text-sm mt-2 inline-block"
                    onClick={() => {
                      toast.info("Opening image in new tab", {
                        position: "top-right",
                        autoClose: 1500,
                      });
                    }}
                  >
                    View Full Size
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ProductsPage;
