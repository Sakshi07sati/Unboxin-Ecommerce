// ===== AddPromoCode.jsx (Updated with Dynamic Categories) =====
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Info } from "lucide-react";
import toast from "react-hot-toast";
import {
  addPromoCode,
  getAllPromoCodes,
} from "../../../global_redux/features/promoCode/promoCodeThunks";
import { fetchSubCategories } from "../../../global_redux/features/subCategory/subCategoryThunks";
import { useNavigate } from "react-router-dom";

const AddPromoCode = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // GET subcategories from Redux
  const { subCategories } = useSelector((state) => state.subCategory);

  console.log("AddPromoCode: Current subCategories in state:", subCategories);

  // Load subcategories on mount
  useEffect(() => {
    console.log("AddPromoCode: Fetching subcategories...");
    dispatch(fetchSubCategories());
  }, [dispatch]);

  const [applicableType, setApplicableType] = useState("category");

  const [formData, setFormData] = useState({
    code: "",
    discountValue: "",
    startDate: "",
    expiryDate: "",
    usageLimit: "",
    applicableCategory: "", // will store category _id
    applicableProduct: "",
  });

  const handleChange = (e) => {

    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // ==== Date Validation ====
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // === DATE VALIDATION ===
    if (!formData.startDate) {
      // Start date NOT given → expiry >= today
      if (formData.expiryDate) {
        const exp = new Date(formData.expiryDate);
        exp.setHours(0, 0, 0, 0);

        if (exp < today) {
          toast.error("Expiry date cannot be earlier than today.");
          return;
        }
      }
    } else {
      // Start date given → expiry >= startDate (EQUAL allowed)
      const start = new Date(formData.startDate);
      start.setHours(0, 0, 0, 0);

      if (formData.expiryDate) {
        const exp = new Date(formData.expiryDate);
        exp.setHours(0, 0, 0, 0);

        if (exp < start) {
          toast.error("Expiry date cannot be earlier than the start date.");
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

      // CATEGORY CASE → SEND CATEGORY ID
      if (applicableType === "category") {
        if (!formData.applicableCategory) {
          toast.error("Please select a category");
          return;
        }

        payload.applicableSubCategory = formData.applicableCategory; // Use applicableSubCategory for backend
      }

      // PRODUCT CASE
      if (applicableType === "product") {
        if (!formData.applicableProduct.trim()) {
          toast.error("Please enter product name");
          return;
        }

        payload.applicableProduct = formData.applicableProduct.trim();
      }
      console.log("payload:", payload);
      await dispatch(addPromoCode(payload)).unwrap();
      toast.success("Promo code added successfully!");

      navigate("/admin/promo-codes");
      dispatch(getAllPromoCodes());
    } catch (err) {
      toast.error(err?.message || "Failed to add promo code");
    }
  };

  return (
    <div className="min-h-full flex items-center justify-center py-10 px-4 sm:px-6 lg:px-8 bg-gray-100">
      <div className="bg-white p-6 rounded-xl w-full max-w-3xl shadow-lg">
        <h2 className="text-2xl font-bold mb-6">Add Promo Code</h2>

        {/* Form */}
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              name="code"
              placeholder="Promo Code (e.g., SUMMER50)"
              value={formData.code}
              onChange={handleChange}
              className="w-full border p-3 rounded-lg"
            />

            <input
              name="discountValue"
              type="number"
              placeholder="Discount (%)"
              value={formData.discountValue}
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
              min="0"
              className="w-full border p-3 rounded-lg"
            />
          </div>

          {/* Dates + Usage */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label>Start Date</label>
              <input
                name="startDate"
                type="date"
                value={formData.startDate}
                onChange={handleChange}
                className="w-full border p-3 rounded-lg"
              />
            </div>

            <div>
              <label>Expiry Date</label>
              <input
                name="expiryDate"
                type="date"
                value={formData.expiryDate}
                min={formData.startDate}
                onChange={handleChange}
                className="w-full border p-3 rounded-lg"
              />
            </div>

            <div>
              <label>Usage Limit</label>
              <input
                name="usageLimit"
                type="number"
                value={formData.usageLimit}
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
                placeholder="0"
                min="0"
                className="w-full border p-3 rounded-lg"
              />
            </div>
          </div>

          {/* Radio */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="font-medium text-blue-900 flex items-center gap-2">
              <Info className="w-5 h-5" /> Select promo apply type
            </p>

            <div className="mt-3 space-y-2">
              <label className="flex gap-3">
                <input
                  type="radio"
                  value="category"
                  checked={applicableType === "category"}
                  onChange={() => {
                    setApplicableType("category");
                    setFormData({ ...formData, applicableProduct: "" });
                  }}
                />
                Apply to Category
              </label>

              <label className="flex gap-3">
                <input
                  type="radio"
                  value="product"
                  checked={applicableType === "product"}
                  onChange={() => {
                    setApplicableType("product");
                    setFormData({ ...formData, applicableCategory: "" });
                  }}
                />
                Apply to Specific Product
              </label>
            </div>
          </div>

          {/* CATEGORY DROPDOWN (NEW) */}
          {applicableType === "category" && (
            <div>
              <label className="font-medium">Select Category *</label>

              <select
                name="applicableCategory"
                value={formData.applicableCategory}
                onChange={handleChange}
                className="w-full border p-3 mt-1 rounded-lg bg-white"
              >
                <option value="">-- Select Subcategory --</option>

                {/* Show Sub Categories */}
                {subCategories && Array.isArray(subCategories) && subCategories.map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.name}
                  </option>
                ))}

                {/* Fallback if empty */}
                {(!subCategories || subCategories.length === 0) && (
                  <option disabled>No subcategories found</option>
                )}
              </select>
            </div>
          )}

          {/* PRODUCT INPUT */}
          {applicableType === "product" && (
            <div>
              <label className="font-medium">Product Id *</label>
              <input
                name="applicableProduct"
                placeholder="Enter product Id"
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
              onClick={() =>
                setFormData({
                  code: "",
                  discountValue: "",
                  startDate: "",
                  expiryDate: "",
                  usageLimit: "",
                  applicableCategory: "",
                  applicableProduct: "",
                })
              }
              className="px-5 py-2 bg-gray-200 rounded-lg"
            >
              Reset
            </button>

            <button
              onClick={handleSubmit}
              className="px-5 py-2 bg-black text-white rounded-lg"
            >
              Create Promo Code
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddPromoCode;
