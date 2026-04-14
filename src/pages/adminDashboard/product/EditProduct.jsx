import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import {
  updateProduct,
  fetchProductById,
} from "../../../global_redux/features/product/productThunks";
import { fetchCategories } from "../../../global_redux/features/category/categoryThunks";
import {
  selectCategories,
  selectCategoryError,
  selectCategoryLoading,
} from "../../../global_redux/features/category/categorySlice";
import { X } from "lucide-react";
import toast from "react-hot-toast";

const EditProduct = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();

  const {
    status,
    products,
    currentProduct,
    loading: productLoading,
  } = useSelector((state) => state.products);
  const categories = useSelector(selectCategories);
  const loadingCategories = useSelector(selectCategoryLoading);
  const categoryError = useSelector(selectCategoryError);

  // Try to find product in products array first, otherwise use currentProduct if it matches the id
  const productFromStore = products.find((p) => p._id === id);
  const product =
    productFromStore ||
    (currentProduct && currentProduct._id === id ? currentProduct : null);

  const [formData, setFormData] = useState({
    name: "",
    price: "",
    originalPrice: "",
    category: "",
    discount: "",
    rating: "",
    productDetails: "",
    productDescription: "",
  });

  const [sizeVariants, setSizeVariants] = useState([
    { size: "S", stock: 0 },
    { size: "M", stock: 0 },
    { size: "L", stock: 0 },
    { size: "XL", stock: 0 },
    { size: "XXL", stock: 0 },
  ]);

  const [images, setImages] = useState([]);
  const [imagePreview, setImagePreview] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [removedImages, setRemovedImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState({});

  // 🟢 Fetch product by ID if not in store
  useEffect(() => {
    if (id) {
      // Check if product exists in products array
      const productInStore = products.find((p) => p._id === id);
      // Check if currentProduct matches the id
      const currentProductMatches = currentProduct && currentProduct._id === id;

      // If product not in store and currentProduct doesn't match, fetch it
      if (!productInStore && !currentProductMatches) {
        dispatch(fetchProductById(id));
      } else if (productInStore || currentProductMatches) {
        setLoading(false);
      }
    }
  }, [id, products, currentProduct, dispatch]);

  // 🟢 Update loading state based on productLoading
  useEffect(() => {
    if (productLoading) {
      setLoading(true);
    } else if (product) {
      setLoading(false);
    }
  }, [productLoading, product]);

  // 🟢 Fetch categories
  useEffect(() => {
    if (!categories || categories.length === 0) {
      dispatch(fetchCategories());
    }
  }, [dispatch, categories]);

  const calculateDiscount = () => {
    const { price, originalPrice } = formData;
    if (!price || !originalPrice || originalPrice >= price) return 0;
    // Discount = ((Price - OriginalPrice) / Price) * 100
    // Since originalPrice < price, this shows the discount percentage
    const discount = ((price - originalPrice) / price) * 100;
    return Math.round(discount);
  };

  // 🟢 Populate product data
  useEffect(() => {
    if (product && product._id === id) {
      setFormData({
        name: product.name || "",
        price: product.price || "",
        originalPrice: product.originalPrice || "",
        category: (product.category?._id || (typeof product.category === 'string' ? product.category : "")) || "",
        discount: product.discount || "",
        rating: product.rating || "",
        productDetails: product.productDetails || "",
        productDescription: product.productDescription || "",
      });

      const updatedSizes = sizeVariants.map((defaultSize) => {
        const existing = product.sizes?.find(
          (s) => s.size === defaultSize.size,
        );
        return existing
          ? { ...defaultSize, stock: existing.stock || 0 }
          : defaultSize;
      });
      setSizeVariants(updatedSizes);

      if (product.img?.length) {
        setExistingImages(product.img);
        setImagePreview(product.img);
      }
      setLoading(false);
    }
  }, [product, id]);

  // 🔹 Input handlers
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const handleSizeChange = (index, value) => {
    const updatedSizes = [...sizeVariants];
    updatedSizes[index].stock = value === "" ? 0 : parseInt(value);
    setSizeVariants(updatedSizes);
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

  const removeExistingImage = (index) => {
    const removedImage = existingImages[index];
    setRemovedImages([...removedImages, removedImage]);
    const newExisting = existingImages.filter((_, i) => i !== index);
    setExistingImages(newExisting);
    const newPreviews = imagePreview.filter((_, i) => i !== index);
    setImagePreview(newPreviews);
  };

  const removeNewImage = (index) => {
    const actualIndex = existingImages.length + index;
    const newImages = images.filter((_, i) => i !== index);
    const newPreviews = imagePreview.filter((_, i) => i !== actualIndex);
    setImages(newImages);
    setImagePreview(newPreviews);
  };

  const calculateTotalQuantity = () =>
    sizeVariants.reduce((total, v) => total + (parseInt(v.stock) || 0), 0);

  // 🧮 Auto discount calculation
  const calculatedDiscount =
    formData.originalPrice &&
    formData.price &&
    formData.originalPrice < formData.price
      ? Math.round(
          ((formData.price - formData.originalPrice) / formData.price) * 100,
        )
      : 0;

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

    // Validate images - at least one image required (existing or new)
    if (existingImages.length === 0 && images.length === 0) {
      newErrors.images = "At least one image is required";
    } else if (images.length > 10) {
      newErrors.images = "Maximum 10 new images allowed";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 🔹 Submit Handler
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

    const validSizes = sizeVariants.filter((v) => v.size);
    const submitData = new FormData();

    submitData.append("name", formData.name.trim());
    submitData.append("price", formData.price);
    submitData.append("originalPrice", formData.originalPrice || "");
    submitData.append("category", formData.category);
    submitData.append("discount", formData.discount || calculatedDiscount);
    submitData.append("rating", formData.rating || "0");
    submitData.append("productDetails", formData.productDetails || "");
    submitData.append("productDescription", formData.productDescription || "");
    submitData.append("quantity", calculateTotalQuantity());
    submitData.append("sizes", JSON.stringify(validSizes));

    images.forEach((img) => submitData.append("img", img));
    if (existingImages.length > 0)
      submitData.append("existingImages", JSON.stringify(existingImages));
    if (removedImages.length > 0)
      submitData.append("removedImages", JSON.stringify(removedImages));

    try {
      const res = await dispatch(
        updateProduct({ id, productData: submitData }),
      );
      if (res.type.endsWith("fulfilled")) {
        toast.success("✅ Product updated successfully!");
        setTimeout(() => navigate("/admin/products"), 600);
      } else {
        toast.error("❌ Error: " + (res.payload || "Failed to update product"));
      }
    } catch (err) {
      toast.error(err.message || "Something went wrong!");
    }
  };

  if (loading)
    return (
      <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow">
        <p className="text-center text-gray-600">Loading product...</p>
      </div>
    );

  if (!product)
    return (
      <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow">
        <p className="text-center text-gray-600">Product not found</p>
        <button
          onClick={() => navigate("/admin/products")}
          className="mt-4 mx-auto block px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Back to Products
        </button>
      </div>
    );

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        Edit Product - {product.name}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 🟢 Basic Information */}
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
                required
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">{errors.name}</p>
              )}
            </div>

            <div>
              <label className="block font-semibold mb-1 text-gray-700">
                Category *
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className={`w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.category ? "border-red-500" : "border-gray-300"
                }`}
                required
              >
                <option value="">Select category</option>
                {loadingCategories && <option>Loading...</option>}
                {categoryError && <option>Error loading categories</option>}
                {categories.map((cat) => (
                  <option key={cat._id} value={cat._id}>
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

        {/* 🟢 Pricing Section */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-4 text-gray-700">
            Pricing & Rating
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block font-semibold mb-1 text-gray-700">
                Price (₹)
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
                step="0.01"
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
                step="0.01"
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

            {/* <div>
              <label className="block font-semibold mb-1 text-gray-700">
                Discount (%)
              </label>
              <input
                type="number"
                name="discount"
                value={formData.discount || calculatedDiscount}
                onChange={handleChange}
                className="w-full border border-gray-300 p-2 rounded"
              />
              {formData.originalPrice && formData.price && (
                <p className="text-sm text-blue-600 mt-1">
                  Auto: {calculatedDiscount}% off
                </p>
              )}
            </div> */}

            {/* <div>
              <label className="block font-semibold mb-1 text-gray-700">
                Rating
              </label>
              <input
                type="number"
                name="rating"
                step="0.1"
                min="0"
                max="5"
                value={formData.rating}
                onChange={handleChange}
                className="w-full border border-gray-300 p-2 rounded"
              />
            </div> */}
          </div>
        </div>

        {/* 🟢 Sizes */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-4 text-gray-700">
            Size & Stock Management
          </h3>
          {sizeVariants.map((variant, index) => (
            <div key={variant.size} className="flex gap-3 items-center mb-3">
              <input
                type="text"
                value={variant.size}
                readOnly
                className="w-1/3 border border-gray-300 p-2 rounded bg-gray-100"
              />
              <input
                type="number"
                value={variant.stock}
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
                onChange={(e) => handleSizeChange(index, e.target.value)}
                className="w-2/3 border border-gray-300 p-2 rounded"
                placeholder="Stock quantity"
                min="0"
              />
            </div>
          ))}
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded">
            <p className="text-sm font-semibold text-blue-800">
              Total Quantity:{" "}
              <span className="text-lg">{calculateTotalQuantity()}</span> units
            </p>
          </div>
        </div>

        {/* 🟢 Images */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-4 text-gray-700">
            Product Images
          </h3>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleImageChange}
            className="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <p className="text-sm text-gray-500 mt-2">
            Upload new images (max 10, 50MB each). Supported formats: JPEG, PNG,
            WebP.
          </p>
          {errors.images && (
            <p className="text-red-500 text-sm mt-1">{errors.images}</p>
          )}

          {imagePreview.length > 0 && (
            <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3">
              {imagePreview.map((preview, index) => {
                const isExisting = index < existingImages.length;
                return (
                  <div key={index} className="relative group">
                    <img
                      src={preview}
                      alt={`Preview ${index}`}
                      className="w-full h-32 object-cover rounded border"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        isExisting
                          ? removeExistingImage(index)
                          : removeNewImage(index - existingImages.length)
                      }
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-7 h-7 flex items-center justify-center hover:bg-red-600 transition opacity-0 group-hover:opacity-100"
                    >
                      <X size={16} />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* 🟢 Details & Description */}
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
                className="w-full border border-gray-300 p-2 rounded"
                placeholder="Key features, specifications, materials, etc."
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
            </div>
            {/* <div>
              <label className="block font-semibold mb-1 text-gray-700">
                Product Description
              </label>
              <textarea
                name="productDescription"
                value={formData.productDescription}
                onChange={handleChange}
                className="w-full border border-gray-300 p-2 rounded"
                placeholder="Detailed product description..."
                rows="3"
              />
            </div> */}
          </div>
        </div>

        {/* 🟢 Submit Buttons */}
        <div className="flex gap-3">
          <button
            type="submit"
            className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
            disabled={status === "loading"}
          >
            {status === "loading" ? "Updating..." : "Update Product"}
          </button>
          <button
            type="button"
            onClick={() => navigate("/admin/products")}
            className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditProduct;
