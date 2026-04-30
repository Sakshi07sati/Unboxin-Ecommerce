import React, { useState, useEffect, useRef } from "react";
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
import { fetchSubCategories } from "../../../global_redux/features/subCategory/subCategoryThunks";
import { X, ImagePlus } from "lucide-react";
import toast from "react-hot-toast";

const EditProduct = () => {
  const MAX_IMAGES = 4;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();

  // Prevents re-populating form after Redux store updates with new product data post-submit
  const isFormPopulated = useRef(false);

  const {
    status,
    products,
    currentProduct,
    loading: productLoading,
  } = useSelector((state) => state.products);
  const categories = useSelector(selectCategories);
  const loadingCategories = useSelector(selectCategoryLoading);
  const categoryError = useSelector(selectCategoryError);
  const { subCategories, loading: subCategoryLoading } = useSelector(
    (state) => state.subCategory
  );

  const productFromStore = products.find((p) => p._id === id);
  const product =
    productFromStore ||
    (currentProduct && currentProduct._id === id ? currentProduct : null);

  const [formData, setFormData] = useState({
    name: "",
    price: "",
    originalPrice: "",
    category: "",
    subCategory: "",
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

  const [savedImages, setSavedImages] = useState([]);
  const [newImages, setNewImages] = useState([]);
  const [newImagePreviews, setNewImagePreviews] = useState([]);
  const [imageChanged, setImageChanged] = useState(false);

  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState({});

  // ─── Generate & revoke object URLs (no memory leak) ──────────────────────────
  useEffect(() => {
    if (!imageChanged || newImages.length === 0) {
      setNewImagePreviews([]);
      return;
    }
    const urls = newImages.map((f) => URL.createObjectURL(f));
    setNewImagePreviews(urls);

    return () => {
      urls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [newImages, imageChanged]);

  // ─── Fetch product if not in store ───────────────────────────────────────────
  useEffect(() => {
    if (!id) return;
    const inStore = products.find((p) => p._id === id);
    const currentMatches = currentProduct && currentProduct._id === id;
    if (!inStore && !currentMatches) {
      dispatch(fetchProductById(id));
    } else {
      setLoading(false);
    }
  }, [id, products, currentProduct, dispatch]);

  useEffect(() => {
    if (productLoading) setLoading(true);
    else if (product) setLoading(false);
  }, [productLoading, product]);

  // ─── Fetch categories / subcategories ────────────────────────────────────────
  useEffect(() => {
    if (!categories?.length) dispatch(fetchCategories());
    if (!subCategories?.length) dispatch(fetchSubCategories());
  }, [dispatch, categories, subCategories]);

  // ─── Populate form — only ONCE on first load ─────────────────────────────────
  // ROOT FIX: isFormPopulated ref prevents this from re-running after submit
  // Problem was: submit → Redux updates product → useEffect re-runs →
  // savedImages resets to new URLs BUT imageChanged stays true →
  // imagePreviews still shows old blob URLs instead of new Cloudinary URLs
  useEffect(() => {
    if (!product || product._id !== id) return;

    // Already populated — skip to avoid overwriting user's current form state
    if (isFormPopulated.current) return;

    setFormData({
      name: product.name || "",
      price: product.price !== undefined ? product.price : "",
      originalPrice:
        product.originalPrice !== undefined ? product.originalPrice : "",
      category:
        product.category?._id ||
        product.category?.id ||
        (typeof product.category === "string" ? product.category : "") ||
        "",
      subCategory:
        product.subCategory?._id ||
        product.subCategory?.id ||
        (typeof product.subCategory === "string" ? product.subCategory : "") ||
        "",
      rating: product.rating !== undefined ? product.rating : "",
      productDetails: product.productDetails || "",
      productDescription: product.productDescription || "",
    });

    setSizeVariants((prev) =>
      prev.map((defaultSize) => {
        const found = product.sizes?.find((s) => s.size === defaultSize.size);
        return found ? { ...defaultSize, stock: found.stock || 0 } : defaultSize;
      })
    );

    setSavedImages(product.img?.length ? product.img : []);

    isFormPopulated.current = true;
    setLoading(false);
  }, [product, id]);

  // ─── Helpers ─────────────────────────────────────────────────────────────────
  const calculateDiscount = () => {
    const selling = Number(formData.price);
    const mrp = Number(formData.originalPrice);
    if (!selling || !mrp || mrp <= selling) return 0;
    return Math.round(((mrp - selling) / mrp) * 100);
  };

  const calculateTotalQuantity = () =>
    sizeVariants.reduce((sum, v) => sum + (parseInt(v.stock) || 0), 0);

  // ─── Input handlers ──────────────────────────────────────────────────────────
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const updated = { ...prev, [name]: value };
      if (name === "category") updated.subCategory = "";
      return updated;
    });
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSizeChange = (index, value) => {
    setSizeVariants((prev) => {
      const updated = [...prev];
      updated[index] = {
        ...updated[index],
        stock: value === "" ? 0 : parseInt(value),
      };
      return updated;
    });
  };

  // ─── Image handlers ──────────────────────────────────────────────────────────
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    const maxSize = 50 * 1024 * 1024;

    if (errors.images) setErrors((prev) => ({ ...prev, images: "" }));

    if (files.length > MAX_IMAGES) {
      toast.error(`Maximum ${MAX_IMAGES} images allowed.`);
      e.target.value = "";
      return;
    }

    const valid = [];
    const invalid = [];

    files.forEach((file) => {
      if (!allowedTypes.includes(file.type)) {
        invalid.push(`${file.name}: invalid type (JPEG, PNG, WebP only)`);
      } else if (file.size > maxSize) {
        invalid.push(`${file.name}: too large (max 50 MB)`);
      } else {
        valid.push(file);
      }
    });

    if (invalid.length) toast.error(invalid.join("\n"));

    if (valid.length) {
      setImageChanged(true);
      setNewImages(valid);
      toast.success(
        `${valid.length} new image(s) selected. Will replace saved images on update.`
      );
    }

    e.target.value = "";
  };

  const removeNewImage = (index) => {
    const updated = newImages.filter((_, i) => i !== index);
    if (updated.length === 0) {
      setImageChanged(false);
      setNewImages([]);
      setNewImagePreviews([]);
      toast("Reverted to original saved images", { icon: "↩️" });
    } else {
      setNewImages(updated);
    }
  };

  // ─── Validation ──────────────────────────────────────────────────────────────
  const validateForm = () => {
    const errs = {};

    if (!formData.name?.trim()) {
      errs.name = "Product name is required";
    } else if (formData.name.trim().length < 3) {
      errs.name = "Product name must be at least 3 characters";
    } else if (formData.name.trim().length > 200) {
      errs.name = "Product name must be less than 200 characters";
    } else {
      // Check for duplicate name (excluding current product)
      const nameExists = products.some(
        (p) =>
          p._id !== id && p.name.toLowerCase() === formData.name.trim().toLowerCase()
      );
      if (nameExists) {
        errs.name = "A product with this name already exists";
      }
    }

    if (!formData.category?.trim()) errs.category = "Category is required";
    if (!formData.subCategory?.trim()) errs.subCategory = "SubCategory is required";

    if (!formData.price) {
      errs.price = "Price is required";
    } else {
      const p = parseFloat(formData.price);
      if (isNaN(p) || p <= 0) errs.price = "Price must be a positive number";
      else if (p > 1_000_000) errs.price = "Price cannot exceed ₹10,00,000";
    }

    if (formData.originalPrice) {
      const op = parseFloat(formData.originalPrice);
      const p = parseFloat(formData.price) || 0;
      if (isNaN(op) || op <= 0)
        errs.originalPrice = "Original price must be positive";
      else if (op <= p)
        errs.originalPrice =
          "Original price (MRP) must be greater than selling price";
      else if (op > 1_000_000)
        errs.originalPrice = "Original price cannot exceed ₹10,00,000";
    }

    if (!formData.rating) {
      errs.rating = "Rating is required";
    } else {
      const r = parseFloat(formData.rating);
      if (isNaN(r) || r < 0) errs.rating = "Rating must be a positive number";
      else if (r > 5) errs.rating = "Rating must be 5 or less";
    }

    if (imageChanged && newImages.length === 0) {
      errs.images = "Please select at least one image";
    } else if (!imageChanged && savedImages.length === 0) {
      errs.images = "At least one image is required";
    }

    setErrors(errs);
    return { isValid: Object.keys(errs).length === 0, formErrors: errs };
  };

  // ─── Submit ───────────────────────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    const { isValid, formErrors } = validateForm();
    if (!isValid) {
      toast.error("⚠️ Please fix the errors in the form");
      const first = Object.keys(formErrors)[0];
      if (first) {
        const el = document.querySelector(`[name="${first}"]`);
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "center" });
          el.focus();
        }
      }
      return;
    }

    const sizesArray = sizeVariants.map((v) => ({
      size: v.size,
      stock: Number(v.stock) || 0,
    }));

    const submitData = new FormData();
    submitData.append("name", formData.name.trim());
    submitData.append("price", formData.price);
    submitData.append("category", formData.category);
    submitData.append("subCategory", formData.subCategory || "");
    submitData.append("originalPrice", formData.originalPrice || "");
    submitData.append("productDetails", formData.productDetails || "");
    submitData.append("productDescription", formData.productDescription || "");
    submitData.append("rating", formData.rating);
    submitData.append("quantity", calculateTotalQuantity().toString());

    const hasStock = sizesArray.some((s) => s.stock > 0);
    submitData.append("sizes", hasStock ? JSON.stringify(sizesArray) : "null");

    if (imageChanged) {
      newImages.forEach((img) => submitData.append("img", img));
      submitData.append("replaceImages", "true");
    }

    try {
      const res = await dispatch(updateProduct({ id, productData: submitData }));
      if (res.type.endsWith("fulfilled")) {

        // ROOT FIX: Manually reset image state with new Cloudinary URLs from response
        // This ensures savedImages shows new images immediately without waiting for
        // useEffect to re-run (which was causing the stale preview bug)
        const updatedProduct = res.payload;
        if (updatedProduct?.img?.length) {
          setSavedImages(updatedProduct.img);
        }
        setImageChanged(false);
        setNewImages([]);
        setNewImagePreviews([]);

        toast.success("✅ Product updated successfully!");
        setTimeout(() => navigate("/admin/products"), 600);
      } else {
        toast.error("❌ " + (res.payload || "Failed to update product"));
      }
    } catch (err) {
      toast.error(err.message || "Something went wrong!");
    }
  };

  // ─── Loading / not-found ──────────────────────────────────────────────────────
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

  const imagePreviews = imageChanged ? newImagePreviews : savedImages;

  // ─── Render ───────────────────────────────────────────────────────────────────
  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        Edit Product — {product.name}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">

        {/* Basic Information */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-4 text-gray-700">Basic Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            <div className="md:col-span-2">
              <label className="block font-semibold mb-1 text-gray-700">Product Name *</label>
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
              <label className="block font-semibold mb-1 text-gray-700">Category *</label>
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
                {loadingCategories && <option disabled>Loading...</option>}
                {categoryError && (
                  <option disabled>Error loading categories</option>
                )}
                {categories.map((cat) => (
                  <option key={cat._id || cat.id} value={cat._id || cat.id}>
                    {cat.category || cat.name}
                  </option>
                ))}
              </select>
              {errors.category && (
                <p className="text-red-500 text-sm mt-1">{errors.category}</p>
              )}
            </div>

            <div>
              <label className="block font-semibold mb-1 text-gray-700">SubCategory *</label>
              <select
                name="subCategory"
                value={formData.subCategory}
                onChange={handleChange}
                className={`w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.subCategory ? "border-red-500" : "border-gray-300"
                }`}
                required
                disabled={!formData.category}
              >
                <option value="">Select subcategory</option>
                {subCategoryLoading && <option disabled>Loading...</option>}
                {subCategories
                  .filter((sub) => {
                    const catId =
                      typeof sub.category === "object"
                        ? sub.category?._id || sub.category?.id
                        : sub.category;
                    return catId === formData.category;
                  })
                  .map((sub) => (
                    <option key={sub._id || sub.id} value={sub._id || sub.id}>
                      {sub.name}
                    </option>
                  ))}
              </select>
              {errors.subCategory && (
                <p className="text-red-500 text-sm mt-1">{errors.subCategory}</p>
              )}
            </div>

          </div>
        </div>

        {/* Pricing */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-4 text-gray-700">Pricing</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

            <div>
              <label className="block font-semibold mb-1 text-gray-700">
                Selling Price (₹) *
              </label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                onKeyDown={(e) =>
                  ["e", "E", "+", "-"].includes(e.key) && e.preventDefault()
                }
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
                MRP / Original Price (₹)
              </label>
              <input
                type="number"
                name="originalPrice"
                value={formData.originalPrice}
                onChange={handleChange}
                onKeyDown={(e) =>
                  ["e", "E", "+", "-"].includes(e.key) && e.preventDefault()
                }
                className={`w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.originalPrice ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="0"
                step="0.01"
                min="0"
              />
              {errors.originalPrice && (
                <p className="text-red-500 text-sm mt-1">{errors.originalPrice}</p>
              )}
            </div>

            {formData.originalPrice &&
              formData.price &&
              Number(formData.originalPrice) > Number(formData.price) && (
                <div className="flex items-center justify-center text-green-700 font-semibold text-lg">
                  💰 {calculateDiscount()}% OFF
                </div>
              )}

          </div>
        </div>

        {/* Rating */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-4 text-gray-700">Rating *</h3>
          <input
            type="number"
            name="rating"
            step="0.1"
            min="0"
            max="5"
            value={formData.rating}
            onChange={handleChange}
            className={`w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.rating ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="Enter rating (0 – 5)"
            required
          />
          {errors.rating && (
            <p className="text-red-500 text-sm mt-1">{errors.rating}</p>
          )}
        </div>

        {/* Size & Stock */}
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
                onKeyDown={(e) =>
                  ["e", "E", "+", "-"].includes(e.key) && e.preventDefault()
                }
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

        {/* Images */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-2 text-gray-700">Product Images</h3>

          <div
            className={`mb-3 text-sm px-3 py-2 rounded font-medium ${
              imageChanged
                ? "bg-yellow-50 border border-yellow-300 text-yellow-800"
                : "bg-green-50 border border-green-300 text-green-800"
            }`}
          >
            {imageChanged
              ? `🔄 ${newImages.length} new image(s) selected — will replace saved images on update`
              : `✅ Using ${savedImages.length} saved image(s) — select new files below to replace all`}
          </div>

          <label className="flex items-center gap-2 cursor-pointer w-fit px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-medium">
            <ImagePlus size={16} />
            {imageChanged ? "Choose Different Images" : "Replace Images"}
            <input
              type="file"
              multiple
              accept="image/jpeg,image/jpg,image/png,image/webp"
              onChange={handleImageChange}
              className="hidden"
            />
          </label>

          <p className="text-xs text-gray-500 mt-2">
            Max {MAX_IMAGES} images · JPEG, PNG, WebP · Max 50 MB each.
            Selecting new files <strong>replaces ALL</strong> current images on save.
          </p>

          {errors.images && (
            <p className="text-red-500 text-sm mt-1">{errors.images}</p>
          )}

          {imagePreviews.length > 0 && (
            <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3">
              {imagePreviews.map((preview, index) => (
                <div key={index} className="relative group">
                  <img
                    src={preview}
                    alt={`Preview ${index + 1}`}
                    className="w-full h-32 object-cover rounded border"
                  />
                  <span
                    className={`absolute bottom-1 left-1 text-xs px-1.5 py-0.5 rounded font-medium ${
                      imageChanged
                        ? "bg-green-500 text-white"
                        : "bg-blue-500 text-white"
                    }`}
                  >
                    {imageChanged ? "New" : "Saved"}
                  </span>
                  {imageChanged && (
                    <button
                      type="button"
                      onClick={() => removeNewImage(index)}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-7 h-7 flex items-center justify-center hover:bg-red-600 transition opacity-0 group-hover:opacity-100"
                      title="Remove image"
                    >
                      <X size={16} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Product Information */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-4 text-gray-700">Product Information</h3>
          <div className="space-y-4">
            <div>
              <label className="block font-semibold mb-1 text-gray-700">Product Details</label>
              <textarea
                name="productDetails"
                value={formData.productDetails}
                onChange={handleChange}
                className="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-blue-500"
                placeholder="Key features, specifications, materials, etc."
                rows="3"
              />
            </div>
            <div>
              <label className="block font-semibold mb-1 text-gray-700">Product Description</label>
              <textarea
                name="productDescription"
                value={formData.productDescription}
                onChange={handleChange}
                className="w-full border border-slate-200 p-4 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all bg-slate-50/50 min-h-[150px] text-slate-700 placeholder-slate-400"
                placeholder="Give your product a compelling description..."
                rows="5"
              />
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="flex gap-3">
          <button
            type="submit"
            className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition disabled:opacity-60"
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
