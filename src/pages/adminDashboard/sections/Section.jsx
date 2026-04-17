import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchSections,
  addSection,
  updateSection,
  deleteSection,
} from "../../../global_redux/features/sections/sectionThunks";
import { clearSectionStatus } from "../../../global_redux/features/sections/sectionSlice";
import {
  Plus,
  Edit2 as Pencil,
  Trash2,
  X,
  Search,
  Download,
  AlertCircle,
  ChevronDown,
  FileSpreadsheet,
  FileText
} from "lucide-react";
import toast from "react-hot-toast";
import { exportSections } from "@/utils/exportUtils";

const SectionManagement = () => {
  const dispatch = useDispatch();
  const { sections, loading, error, success } = useSelector(
    (state) => state.section
  );

  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [sectionName, setSectionName] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState(null);
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    id: null,
    name: "",
  });
  const [exportDropdownOpen, setExportDropdownOpen] = useState(false);

  // Fetch data
  useEffect(() => {
    dispatch(fetchSections());
  }, [dispatch]);

  // Toast
  useEffect(() => {
    if (error) toast.error(error);
    if (success) toast.success(success);
    dispatch(clearSectionStatus());
  }, [error, success, dispatch]);

  // Search filter
  const filteredSections = useMemo(() => {
    if (!Array.isArray(sections)) return [];
    return sections.filter((s) =>
      (s.section || "").toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [sections, searchTerm]);

  // Submit
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!sectionName.trim()) return toast.error("Section name required");

    if (editMode) {
      dispatch(updateSection({ id: editId, section: sectionName }))
        .unwrap()
        .then(() => dispatch(fetchSections()));
    } else {
      dispatch(addSection({ section: sectionName }))
        .unwrap()
        .then(() => dispatch(fetchSections()));
    }

    setSectionName("");
    setEditMode(false);
    setEditId(null);
    setShowModal(false);
  };

  // Edit
  const handleEdit = (section) => {
    setSectionName(section.section);
    setEditMode(true);
    setEditId(section._id);
    setShowModal(true);
  };

  // Delete
  const openDeleteModal = (id, name) =>
    setDeleteModal({ isOpen: true, id, name });

  const closeDeleteModal = () =>
    setDeleteModal({ isOpen: false, id: null, name: "" });

  const handleDelete = () => {
    dispatch(deleteSection(deleteModal.id));
    closeDeleteModal();
  };

  // loading handled inline now to avoid jumpy UI

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-6xl mx-auto">

        {/* Header Section */}
        <div className="p-6 border-b border-gray-200 bg-white rounded-t-lg shadow-sm">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Section Management</h2>
              <p className="text-gray-600 text-sm mt-1">Organize and classify your curated collections</p>
            </div>
            
            <div className="flex flex-wrap items-center gap-3">
              {/* Export Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setExportDropdownOpen(!exportDropdownOpen)}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-all shadow-sm font-medium"
                >
                  <Download size={18} />
                  Export
                  <ChevronDown size={16} className={`transition-transform duration-200 ${exportDropdownOpen ? 'rotate-180' : ''}`} />
                </button>
                
                {exportDropdownOpen && (
                  <>
                    <div 
                      className="fixed inset-0 z-10" 
                      onClick={() => setExportDropdownOpen(false)}
                    ></div>
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 z-20 py-2 animate-in fade-in slide-in-from-top-2 duration-200">
                      <button
                        onClick={() => {
                          exportSections(filteredSections, 'csv');
                          toast.success('CSV Exported successfully!');
                          setExportDropdownOpen(false);
                        }}
                        className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors font-medium border-b border-gray-50 text-left"
                      >
                        <FileSpreadsheet size={16} className="text-green-600" />
                        Download CSV
                      </button>
                      <button
                        onClick={() => {
                          exportSections(filteredSections, 'csv');
                          toast.success('Excel Exported successfully!');
                          setExportDropdownOpen(false);
                        }}
                        className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors font-medium border-b border-gray-50 text-left"
                      >
                        <FileSpreadsheet size={16} className="text-blue-600" />
                        Download Excel
                      </button>
                      <button
                        onClick={() => {
                          exportSections(filteredSections, 'pdf');
                          toast.success('PDF Generated successfully!');
                          setExportDropdownOpen(false);
                        }}
                        className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors font-medium text-left"
                      >
                        <FileText size={16} className="text-red-500" />
                        Download PDF
                      </button>
                    </div>
                  </>
                )}
              </div>

              <button
                onClick={() => {
                  setShowModal(true);
                  setEditMode(false);
                  setSectionName("");
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors shadow-sm font-medium"
              >
                <Plus size={20} />
                Add New Section
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search Bar */}
            <div className="md:col-span-3 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search sections..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm"
              />
            </div>
            <div className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 flex items-center justify-between">
              <span className="text-xs text-gray-500 font-medium">Total:</span>
              <span className="text-sm font-bold text-gray-800">{filteredSections.length}</span>
            </div>
          </div>
        </div>

        {/* Loading Indicator */}
        {loading && sections.length === 0 && (
          <div className="bg-white p-8 rounded-b-lg shadow-sm border border-gray-100 flex items-center justify-center gap-3">
            <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-sm text-gray-600 font-medium">Loading sections...</p>
          </div>
        )}

        {/* content */}
        {!error && (sections.length > 0 || !loading) && (
          <div className="bg-white rounded-b-lg shadow-sm border-x border-b border-gray-200 overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">#</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Section Name</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Created At</th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredSections.length > 0 ? (
                  filteredSections.map((section, index) => (
                    <tr key={section._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 text-gray-500 font-medium">{index + 1}</td>
                      <td className="px-6 py-4 font-semibold text-gray-800 capitalize leading-tight">{section.section}</td>
                      <td className="px-6 py-4 text-gray-500">
                        {new Date(section.createdAt).toLocaleDateString('en-IN')}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => handleEdit(section)}
                            className="text-blue-600 hover:text-blue-900 p-2 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Edit"
                          >
                            <Pencil size={18} />
                          </button>
                          <button
                            onClick={() => openDeleteModal(section._id, section.section)}
                            className="text-red-600 hover:text-red-900 p-2 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="px-6 py-12 text-center text-gray-500 text-sm italic">
                      No sections found matching your criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center">
          <div className="bg-white p-6 rounded-xl w-[400px]">
            <h2 className="text-lg font-semibold mb-4">
              {editMode ? "Edit Section" : "Add Section"}
            </h2>

            <form onSubmit={handleSubmit}>
              <input
                type="text"
                value={sectionName}
                onChange={(e) => setSectionName(e.target.value)}
                className="w-full border p-2 rounded mb-4"
                placeholder="Enter section name"
              />

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border rounded"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded"
                >
                  {editMode ? "Update" : "Add"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {deleteModal.isOpen && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center">
          <div className="bg-white p-6 rounded-xl w-[400px] text-center">
            <AlertCircle className="mx-auto text-red-500 mb-3" size={40} />
            <p className="mb-4">
              Are you sure you want to delete{" "}
              <strong>{deleteModal.name}</strong>?
            </p>

            <div className="flex justify-center gap-4">
              <button
                onClick={closeDeleteModal}
                className="px-4 py-2 border rounded"
              >
                Cancel
              </button>

              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white rounded"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SectionManagement;