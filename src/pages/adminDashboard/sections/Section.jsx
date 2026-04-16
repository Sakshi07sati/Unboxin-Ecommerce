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
  Edit2,
  Trash2,
  X,
  Search,
  Download,
  Loader2,
  AlertCircle,
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

  // Loader
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="animate-spin text-blue-600" size={40} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              Section Management
            </h1>
            <p className="text-gray-500 text-sm">
              Manage your sections easily
            </p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => exportSections(filteredSections, "csv")}
              className="px-4 py-2 bg-gray-100 rounded-lg flex items-center gap-2 hover:bg-gray-200"
            >
              <Download size={18} /> Export
            </button>

            <button
              onClick={() => {
                setShowModal(true);
                setEditMode(false);
                setSectionName("");
              }}
              className="bg-blue-600 text-white px-5 py-2 rounded-lg flex items-center gap-2"
            >
              <Plus size={18} /> Add Section
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="bg-white p-4 rounded-xl shadow mb-6">
          <div className="flex items-center border rounded-lg px-3 py-2">
            <Search size={18} className="text-gray-400 mr-2" />
            <input
              type="text"
              placeholder="Search sections..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full outline-none"
            />
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-4 text-left">#</th>
                <th className="p-4 text-left">Section Name</th>
                <th className="p-4 text-left">Created At</th>
                <th className="p-4 text-center">Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredSections.length > 0 ? (
                filteredSections.map((section, index) => (
                  <tr key={section._id} className="border-t hover:bg-gray-50">
                    <td className="p-4">{index + 1}</td>

                    <td className="p-4 font-medium">
                      {section.section}
                    </td>

                    <td className="p-4 text-gray-500">
                      {new Date(section.createdAt).toLocaleDateString()}
                    </td>

                    <td className="p-4 text-center">
                      <button
                        onClick={() => handleEdit(section)}
                        className="text-blue-600 mr-3"
                      >
                        <Edit2 size={18} />
                      </button>

                      <button
                        onClick={() =>
                          openDeleteModal(section._id, section.section)
                        }
                        className="text-red-600"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="text-center p-6 text-gray-500">
                    No sections found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
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