import React, { useState } from "react";
import { Plus, X, Tag } from "lucide-react";

const AddCategory = () => {
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Static simulation of adding category
    setTimeout(() => {
      console.log("Category added (Static):", { category, description });
      setLoading(false);
      setSuccess(true);
      setCategory("");
      setDescription("");
      
      setTimeout(() => setSuccess(false), 3000);
    }, 1000);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-10 text-white relative">
          <div className="relative z-10">
            <h2 className="text-3xl font-bold mb-2">Add New Category</h2>
            <p className="text-blue-100">Organize your products by creating descriptive categories.</p>
          </div>
          <Tag className="absolute right-8 top-1/2 -translate-y-1/2 w-32 h-32 text-white/10 -rotate-12" />
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-8 space-y-8">
          {success && (
            <div className="bg-green-50 border border-green-100 text-green-700 px-6 py-4 rounded-2xl flex items-center justify-between transition-all duration-500">
              <span className="font-medium">Success! The category has been added.</span>
              <button onClick={() => setSuccess(false)}><X className="w-5 h-5" /></button>
            </div>
          )}

          <div className="grid grid-cols-1 gap-8">
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 ml-1">Category Name</label>
              <input
                type="text"
                placeholder="e.g. Footwear, Electronics, Home Decor"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
                className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-blue-100 focus:bg-white transition-all text-gray-900"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 ml-1">Description (Optional)</label>
              <textarea
                placeholder="Briefly describe what this category includes..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-blue-100 focus:bg-white transition-all text-gray-900 resize-none"
              />
            </div>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-4 rounded-2xl font-bold text-white shadow-lg transition-all flex items-center justify-center gap-3 ${
                loading 
                  ? "bg-gray-400 cursor-not-allowed" 
                  : "bg-blue-600 hover:bg-blue-700 shadow-blue-100 active:scale-[0.98]"
              }`}
            >
              {loading ? (
                <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  <Plus className="w-5 h-5" />
                  Create Category
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddCategory;
