import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addSectionProduct,
} from "../../../global_redux/features/sectionProducts/sectionProductThunks";
import { fetchSections } from "../../../global_redux/features/sections/sectionThunks";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { ArrowLeft, Loader2, Package, Layers } from "lucide-react";

const AddSectionProduct = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, sections } = useSelector((state) => state.section);

  const [section, setSection] = useState("");
  const [products, setProducts] = useState("");

  useEffect(() => {
    dispatch(fetchSections());
  }, [dispatch]);

  const handleAdd = async (e) => {
    e.preventDefault();

    if (!section || !products)
      return toast.error("Section and Product IDs are required");

    const productIds = products.split(",").map((id) => id.trim());

    const result = await dispatch(
      addSectionProduct({ section, products: productIds })
    );

    if (result.meta.requestStatus === "fulfilled") {
      toast.success("Products added to section");
      dispatch(fetchSections());
      setSection("");
      setProducts("");
      navigate("/admin/section/products");
    } else {
      toast.error(result.payload || "Failed to add products");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-indigo-100 p-6">
      <div className="max-w-3xl mx-auto space-y-6">

        {/* Header */}
        <div className="bg-white rounded-2xl shadow-md p-6 flex justify-between items-center border">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              Add Section Product
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              Map products to a section easily
            </p>
          </div>

          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg border hover:bg-gray-50 transition"
          >
            <ArrowLeft size={18} /> Back
          </button>
        </div>

        {/* Form Card */}
        <form
          onSubmit={handleAdd}
          className="bg-white rounded-2xl shadow-md border p-6 space-y-5"
        >

          {/* Section Dropdown */}
          <div>
            <label className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
              <Layers size={16} /> Select Section
            </label>

            <select
              value={section}
              onChange={(e) => setSection(e.target.value)}
              className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            >
              <option value="">Select section</option>
              {sections?.map((sec) => (
                <option key={sec._id} value={sec.section}>
                  {sec.section}
                </option>
              ))}
            </select>
          </div>

          {/* Product IDs */}
          <div>
            <label className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
              <Package size={16} /> Product IDs
            </label>

            <input type="text"
              placeholder="Enter product IDs separated by commas (e.g. 123, 456, 789)"
              value={products}
              onChange={(e) => setProducts(e.target.value)}
              className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />

            <p className="text-xs text-gray-400 mt-1">
              Tip: Use comma ( , ) to separate multiple product IDs
            </p>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-3 rounded-xl flex justify-center items-center gap-2 transition shadow-md"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin" size={18} />
                Adding Products...
              </>
            ) : (
              "Add Products to Section"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddSectionProduct;