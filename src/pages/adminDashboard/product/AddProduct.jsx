import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { addProduct } from "../../../global_redux/features/product/productThunks";
import { Plus, X } from "lucide-react";
import toast from "react-hot-toast";
import { fetchCategories } from "../../../global_redux/features/category/categoryThunks";
import {
  selectCategories,
  selectCategoryError,
  selectCategoryLoading,
} from "../../../global_redux/features/category/categorySlice";

const AddProduct = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const categories = useSelector(selectCategories);
  const loadingCategories = useSelector(selectCategoryLoading);
  const categoryError = useSelector(selectCategoryError);
  const { status, error } = useSelector((state) => state.products);

  const [formData, setFormData] = useState({
    name: "",
    price: "",
    category: "",
    originalPrice: "",
    productDetails: "",
    productDescription: "",
  });

  useEffect(() => {
    if (!categories || categories.length === 0) {
      dispatch(fetchCategories());
    }
  }, [dispatch, categories]);

  // Fixed sizes
  const fixedSizes = ["S", "M", "L", "XL", "XXL"];

  const [sizeVariants, setSizeVariants] = useState(
    fixedSizes.map((size) => ({ size, stock: "" })),
  );

  const [images, setImages] = useState([]);
  const [imagePreview, setImagePreview] = useState([]);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const maxFileSize = 50 * 1024 * 1024; // 50MB
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    const maxFiles = 10;

    // Clear previous image errors
    if (errors.images) {
      setErrors({ ...errors, images: "" });
    }

    // Validate file count
    if (images.length + files.length > maxFiles) {
      toast.error(
        `Maximum ${maxFiles} images allowed. You can upload ${maxFiles - images.length} more.`,
      );
      return;
    }

    // Validate each file
    const validFiles = [];
    const invalidFiles = [];

    files.forEach((file) => {
      // Check file type
      if (!allowedTypes.includes(file.type)) {
        invalidFiles.push(
          `${file.name} - Invalid file type. Only JPEG, PNG, and WebP are allowed.`,
        );
        return;
      }

      // Check file size
      if (file.size > maxFileSize) {
        invalidFiles.push(
          `${file.name} - File too large. Maximum size is 50MB.`,
        );
        return;
      }

      validFiles.push(file);
    });

    // Show errors for invalid files
    if (invalidFiles.length > 0) {
      toast.error(invalidFiles.join("\n"));
    }

    // Add valid files
    if (validFiles.length > 0) {
      setImages([...images, ...validFiles]);
      const newPreviews = validFiles.map((file) => URL.createObjectURL(file));
      setImagePreview([...imagePreview, ...newPreviews]);
    }
  };

  const removeImage = (index) => {
    const newImages = images.filter((_, i) => i !== index);
    const newPreviews = imagePreview.filter((_, i) => i !== index);
    setImages(newImages);
    setImagePreview(newPreviews);
  };

  const calculateTotalQuantity = () => {
    return sizeVariants.reduce(
      (total, variant) => total + (parseInt(variant.stock) || 0),
      0,
    );
  };

  const calculateDiscount = () => {
    const { price, originalPrice } = formData;
    if (!price || !originalPrice || originalPrice >= price) return 0;
    // Discount = ((Price - OriginalPrice) / Price) * 100
    // Since originalPrice < price, this shows the discount percentage
    const discount = ((price - originalPrice) / price) * 100;
    return Math.round(discount);
  };

  const validateForm = () => {
    const newErrors = {};

    // Validate product name
    if (!formData.name || formData.name.trim() === "") {
      newErrors.name = "Product name is required";
    } else if (formData.name.trim().length < 3) {
      newErrors.name = "Product name must be at least 3 characters";
    } else if (formData.name.trim().length > 200) {
      newErrors.name = "Product name must be less than 200 characters";
    }

    // Validate category
    if (!formData.category || formData.category.trim() === "") {
      newErrors.category = "Category is required";
    }

    // Validate price
    if (!formData.price || formData.price === "") {
      newErrors.price = "Price is required";
    } else {
      const price = parseFloat(formData.price);
      if (isNaN(price) || price <= 0) {
        newErrors.price = "Price must be a positive number";
      } else if (price > 1000000) {
        newErrors.price = "Price cannot exceed ₹10,00,000";
      }
    }

    // Validate original price (if provided)
    if (formData.originalPrice && formData.originalPrice !== "") {
      const originalPrice = parseFloat(formData.originalPrice);
      const price = parseFloat(formData.price) || 0;

      if (isNaN(originalPrice) || originalPrice <= 0) {
        newErrors.originalPrice = "Original price must be a positive number";
      } else if (originalPrice >= price) {
        newErrors.originalPrice =
          "Original price must be less than selling price";
      } else if (originalPrice > 1000000) {
        newErrors.originalPrice = "Original price cannot exceed ₹10,00,000";
      }
    }

    // Validate images
    if (images.length === 0) {
      newErrors.images = "At least one image is required";
    } else if (images.length > 10) {
      newErrors.images = "Maximum 10 images allowed";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form
    if (!validateForm()) {
      toast.error("⚠️ Please fix the errors in the form");
      // Scroll to first error
      const firstErrorField = Object.keys(errors)[0];
      if (firstErrorField) {
        const element = document.querySelector(`[name="${firstErrorField}"]`);
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "center" });
          element.focus();
        }
      }
      return;
    }

    const sizesArray = sizeVariants.map((variant) => ({
      size: variant.size,
      stock: Number(variant.stock) || 0,
    }));

    const submitData = new FormData();
    submitData.append("name", formData.name.trim());
    submitData.append("price", formData.price);
    submitData.append("category", formData.category);
    submitData.append("originalPrice", formData.originalPrice || "");
    submitData.append("productDetails", formData.productDetails || "");
    submitData.append("productDescription", formData.productDescription || "");
    submitData.append("quantity", calculateTotalQuantity().toString());
    submitData.append("sizes", JSON.stringify(sizesArray));

    images.forEach((image) => submitData.append("img", image));

    try {
      const res = await dispatch(addProduct(submitData));
      if (res.type.endsWith("fulfilled")) {
        toast.success("✅ Product added successfully!");
        navigate("/admin/products");
      } else {
        toast.error("❌ Error: " + (res.payload || "Failed to add product"));
      }
    } catch (err) {
      console.error("Submit error:", err);
      toast.error("Something went wrong!");
    }
  };

  console.log("Current form data:", formData);

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Add New Product</h2>

      {status === "loading" && (
        <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded mb-4">
          Adding product...
        </div>
      )}
      {status === "failed" && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          Error: {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-4 text-gray-700">
            Basic Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block font-semibold mb-1 text-gray-700">
                Product Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.name ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Enter product name"
                required
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">{errors.name}</p>
              )}
            </div>

            {/* Category */}
            <div>
              <label className="block font-semibold mb-2 text-gray-800">
                Category <span className="text-red-500">*</span>
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className={`w-full p-3 rounded border bg-white text-gray-700 shadow-sm
                focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.category ? "border-red-500" : "border-gray-300"
                }`}
                required
              >
                <option value="">-- Select a category --</option>
                {loadingCategories && (
                  <option disabled>Loading categories...</option>
                )}
                {categoryError && (
                  <option disabled>Error loading categories</option>
                )}
                {categories.map((cat) => (
                  <option key={cat._id || cat.id} value={cat._id || cat.id}>
                    {cat.category}
                  </option>
                ))}
              </select>
              {errors.category && (
                <p className="text-red-500 text-sm mt-1">{errors.category}</p>
              )}
            </div>
          </div>
        </div>

        {/* Pricing Section */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-4 text-gray-700">Pricing</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* <div>
              <label className="block font-semibold mb-1 text-gray-700">
                Price (₹) *
              </label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                className={`w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.price ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="0.00"
                step="0.01"
                min="0"
                required
              />
              {errors.price && (
                <p className="text-red-500 text-sm mt-1">{errors.price}</p>
              )}
            </div> */}
            <div>
              <label className="block font-semibold mb-1 text-gray-700">
                Price (₹) *
              </label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                onKeyDown={(e) => {
                  if (["e", "E", "+", "-"].includes(e.key)) {
                    e.preventDefault();
                  }
                }}
                onPaste={(e) => {
                  if (/[eE+\-]/.test(e.clipboardData.getData("text"))) {
                    e.preventDefault();
                  }
                }}
                className={`w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.price ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="0.00"
                // step="0.01"
                min="0"
                required
              />
              {errors.price && (
                <p className="text-red-500 text-sm mt-1">{errors.price}</p>
              )}
            </div>

            <div>
              <label className="block font-semibold mb-1 text-gray-700">
                Original Price (₹)
              </label>
              <input
                type="number"
                name="originalPrice"
                value={formData.originalPrice}
                onChange={handleChange}
                onKeyDown={(e) => {
                  if (["e", "E", "+", "-"].includes(e.key)) {
                    e.preventDefault();
                  }
                }}
                onPaste={(e) => {
                  if (/[eE+\-]/.test(e.clipboardData.getData("text"))) {
                    e.preventDefault();
                  }
                }}
                className={`w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.originalPrice ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="0"
                min="0"
              />
              {errors.originalPrice && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.originalPrice}
                </p>
              )}
            </div>

            {formData.originalPrice &&
              formData.price &&
              formData.originalPrice < formData.price && (
                <div className="flex items-center justify-center text-green-700 font-semibold">
                  💰 {calculateDiscount()}% OFF
                </div>
              )}
          </div>
        </div>

        {/* Size & Stock */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-4 text-gray-700">
            Size & Stock Management *
          </h3>
          {fixedSizes.map((size, index) => (
            <div key={index} className="flex gap-3 items-center mb-3">
              <div className="flex-1">
                <input
                  type="text"
                  value={size}
                  readOnly
                  className="w-full border border-gray-300 p-2 rounded bg-gray-100 text-gray-700"
                />
              </div>
              <div className="flex-1">
                <input
                  type="number"
                  value={sizeVariants[index]?.stock || ""}
                  onChange={(e) => {
                    const newSizes = [...sizeVariants];
                    newSizes[index] = { size, stock: e.target.value || "0" };
                    setSizeVariants(newSizes);
                  }}
                  onKeyDown={(e) => {
                    if (["e", "E", "+", "-"].includes(e.key)) {
                      e.preventDefault();
                    }
                  }}
                  onPaste={(e) => {
                    if (/[eE+\-]/.test(e.clipboardData.getData("text"))) {
                      e.preventDefault();
                    }
                  }}
                  className="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Stock quantity (default 0)"
                  min="0"
                />
              </div>
            </div>
          ))}

          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded">
            <p className="text-sm font-semibold text-blue-800">
              Total Quantity:{" "}
              <span className="text-lg">{calculateTotalQuantity()}</span> units
            </p>
          </div>
        </div>

        {/* Images */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-4 text-gray-700">
            Product Images *
          </h3>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageChange}
            className="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <p className="text-sm text-gray-500 mt-2">
            Upload multiple images (max 10, 50MB each). First image will be
            primary. Supported formats: JPEG, PNG, WebP.
          </p>
          {errors.images && (
            <p className="text-red-500 text-sm mt-1">{errors.images}</p>
          )}

          {imagePreview.length > 0 && (
            <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3">
              {imagePreview.map((preview, index) => (
                <div key={index} className="relative group">
                  <img
                    src={preview}
                    alt={`Preview ${index + 1}`}
                    className="w-full h-32 object-cover rounded border border-gray-300"
                  />
                  {index === 0 && (
                    <span className="absolute top-1 left-1 bg-blue-600 text-white text-xs px-2 py-1 rounded">
                      Primary
                    </span>
                  )}
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-7 h-7 flex items-center justify-center hover:bg-red-600 transition opacity-0 group-hover:opacity-100"
                  >
                    <X size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Description */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-4 text-gray-700">
            Product Information
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block font-semibold mb-1 text-gray-700">
                Product Details
              </label>
              <textarea
                name="productDetails"
                value={formData.productDetails}
                onChange={handleChange}
                className="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Key features, specifications, etc."
                rows="3"
              />
            </div>

            <div>
              <label className="block font-semibold mb-1 text-gray-700">
                Product Description
              </label>
              <textarea
                name="productDescription"
                value={formData.productDescription}
                onChange={handleChange}
                className="w-full border border-slate-200 p-4 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all bg-slate-50/50 min-h-[150px] text-slate-700 placeholder-slate-400"
                placeholder="Give your product a compelling description..."
                rows="5"
              />
              {/* <textarea
                name="productDescription"
                value={formData.productDescription}
                onChange={handleChange}
                className="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Detailed product description..."
                rows="5"
              /> */}
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-3">
          <button
            type="submit"
            className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed font-semibold"
            disabled={status === "loading"}
          >
            {status === "loading" ? "Adding Product..." : "Add Product"}
          </button>
          <button
            type="button"
            onClick={() => navigate("/admin/products")}
            className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-semibold"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddProduct;
