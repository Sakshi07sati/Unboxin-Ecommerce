// ===== EditPromoCode.jsx (Final Updated & Fixed) =====
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Info, X } from "lucide-react";
import toast from "react-hot-toast";

import {
  updatePromoCode,
  getAllPromoCodes,
} from "../../../global_redux/features/promoCode/promoCodeThunks";

import {
  fetchSubCategories,
} from "../../../global_redux/features/subCategory/subCategoryThunks";
const EditPromoCode = ({ promo, onClose }) => {
  const dispatch = useDispatch();
  const { subCategories } = useSelector((state) => state.subCategory);

  // Load subcategories on mount
  useEffect(() => {
    dispatch(fetchSubCategories());
  }, [dispatch]);

  const [applicableType, setApplicableType] = useState(
    promo.applicableSubCategory ? "category" : "product"
  );

  const [formData, setFormData] = useState({
    code: promo.code || "",
    discountValue: promo.discountValue || "",
    startDate: promo.startDate ? promo.startDate.split("T")[0] : "",
    expiryDate: promo.expiryDate ? promo.expiryDate.split("T")[0] : "",
    usageLimit: promo.usageLimit || "",
    applicableCategory: promo.applicableSubCategory?._id || promo.applicableSubCategory || "",
    applicableProduct: promo.applicableProduct?._id || promo.applicableProduct || "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handle input
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // ⭐ DATE VALIDATION
    if (!formData.startDate) {
      // Start Date empty → expiry must be >= today
      if (formData.expiryDate) {
        const exp = new Date(formData.expiryDate);
        exp.setHours(0, 0, 0, 0);

        if (exp < today) {
          toast.error("Expiry date cannot be earlier than today.");
          setIsSubmitting(false);
          return;
        }
      }
    } else {
      // Start Date given → expiry must be >= start
      const start = new Date(formData.startDate);
      start.setHours(0, 0, 0, 0);

      if (formData.expiryDate) {
        const exp = new Date(formData.expiryDate);
        exp.setHours(0, 0, 0, 0);

        if (exp < start) {
          toast.error("Expiry date cannot be earlier than the start date.");
          setIsSubmitting(false);
          return;
        }
      }
    }

    try {
      const payload = {
        code: formData.code.trim(),
        discountValue: Number(formData.discountValue),
        startDate: formData.startDate,
        expiryDate: formData.expiryDate,
        usageLimit: Number(formData.usageLimit),
      };

      // Applying type handling
      if (applicableType === "category") {
        if (!formData.applicableCategory) {
          toast.error("Please select a category");
          setIsSubmitting(false);
          return;
        }
        payload.applicableSubCategory = formData.applicableCategory;
        payload.applicableProduct = null;
      } else {
        if (!formData.applicableProduct.trim()) {
          toast.error("Please enter a product ID");
          setIsSubmitting(false);
          return;
        }
        payload.applicableProduct = formData.applicableProduct.trim();
        payload.applicableCategory = null;
      }

      await dispatch(updatePromoCode({ id: promo._id, promoData: payload })).unwrap();
      toast.success("Promo code updated successfully!");
      dispatch(getAllPromoCodes());
      onClose();
    } catch (err) {
      console.error("Update Error:", err);
      toast.error(err?.message || "Failed to update promo code");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl w-full max-w-2xl shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold">Edit Promo Code</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {/* Code + Discount */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              name="code"
              placeholder="Promo Code"
              value={formData.code}
              onChange={handleChange}
              className="w-full border border-gray-300 p-3 rounded-lg"
              required
            />

            <input
              name="discountValue"
              type="number"
              placeholder="Discount Value (%)"
              min="1"
              max="100"
              value={formData.discountValue}
              onChange={handleChange}
              onKeyDown={(e) => {
                if (["e", "E", "+", "-"].includes(e.key)) e.preventDefault();
              }}
              onPaste={(e) => {
                if (/[eE+\-]/.test(e.clipboardData.getData("text"))) e.preventDefault();
              }}
              className="w-full border border-gray-300 p-3 rounded-lg"
              required
            />
          </div>

          {/* Dates + Usage */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="font-medium">Start Date *</label>
              <input
                name="startDate"
                type="date"
                value={formData.startDate}
                onChange={handleChange}
                className="w-full border p-3 rounded-lg"
              />
            </div>

            <div>
              <label className="font-medium">Expiry Date *</label>
              <input
                name="expiryDate"
                type="date"
                value={formData.expiryDate}
                onChange={handleChange}
                className="w-full border p-3 rounded-lg"
              />
            </div>

            <div>
              <label className="font-medium">Usage Limit *</label>
              <input
                name="usageLimit"
                type="number"
                min="1"
                value={formData.usageLimit}
                onChange={handleChange}
                className="w-full border p-3 rounded-lg"
              />
            </div>
          </div>

          {/* Selection Type */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <label className="flex items-center gap-3 cursor-pointer mb-2">
              <input
                type="radio"
                name="applicableType"
                value="category"
                checked={applicableType === "category"}
                onChange={(e) => {
                  setApplicableType(e.target.value);
                  setFormData({ ...formData, applicableProduct: "" });
                }}
              />
              <span>Apply to Category</span>
            </label>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="radio"
                name="applicableType"
                value="product"
                checked={applicableType === "product"}
                onChange={(e) => {
                  setApplicableType(e.target.value);
                  setFormData({ ...formData, applicableCategory: "" });
                }}
              />
              <span>Apply to Specific Product</span>
            </label>
          </div>

          {/* Category Dropdown */}
          {applicableType === "category" && (
            <div>
              <label className="font-medium">Select Category *</label>

              <select
                name="applicableCategory"
                value={formData.applicableCategory}
                onChange={handleChange}
                className="w-full border p-3 rounded-lg bg-white"
              >
                <option value="">-- Select Subcategory --</option>
                {subCategories && subCategories.map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Product Input */}
          {applicableType === "product" && (
            <div>
              <label className="font-medium">Product ID *</label>
              <input
                name="applicableProduct"
                placeholder="Enter product ID"
                value={formData.applicableProduct}
                onChange={handleChange}
                className="w-full border p-3 rounded-lg"
              />
            </div>
          )}

          {/* Buttons */}
          <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 bg-gray-200 rounded-lg"
            >
              Cancel
            </button>

            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="px-5 py-2 bg-black text-white rounded-lg"
            >
              {isSubmitting ? "Updating..." : "Update Promo Code"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditPromoCode;
