// ===== PromoCode.jsx (Updated) =====
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Ticket, Calendar, Users, Package, Tag, Pencil, Trash2, Plus, TrendingUp, Clock, Sparkles, CalendarClock } from "lucide-react";
import toast from "react-hot-toast";
import {
  getAllPromoCodes,
  deletePromoCode
} from "../../../global_redux/features/promoCode/promoCodeThunks";
import { Link } from "react-router-dom";
import EditPromoCode from "./EditPromoCode";

const PromoCode = () => {
  const dispatch = useDispatch();
  const { promoCodes, status, error } = useSelector((state) => state.promoCode);

  const [deletingId, setDeletingId] = useState(null);
  const [editingPromo, setEditingPromo] = useState(null);
  // Check permissions
  const canAdd = true;
  const canEdit = true;
  const canDelete = true;

  useEffect(() => {
    dispatch(getAllPromoCodes());
  }, [dispatch]);

  useEffect(() => {
    if (error) toast.error(error);
  }, [error]);

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const handleDelete = async (id, code) => {
    if (window.confirm(`Are you sure you want to delete promo code "${code}"?`)) {
      setDeletingId(id);
      try {
        await dispatch(deletePromoCode(id)).unwrap();
        toast.success("Promo code deleted successfully!");
      } catch (err) {
        toast.error(err || "Failed to delete promo code");
      } finally {
        setDeletingId(null);
      }
    }
  };

  const handleEdit = (promo) => {
    setEditingPromo(promo);
  };

  const handleCloseEdit = () => {
    setEditingPromo(null);
  };

  // Calculate statistics
  const safePromoCodes = Array.isArray(promoCodes)
    ? promoCodes.filter((p) => p && typeof p === "object")
    : [];

  // ✅ Enhanced status check - considers start date, expiry date, and isActive flag
  const getPromoStatus = (promo) => {
    const now = new Date();
    const startDate = new Date(promo.startDate);
    const expiryDate = new Date(promo.expiryDate);

    if (expiryDate < now) {
      return { status: "Expired", color: "red" };
    }
    if (startDate > now) {
      return { status: "Scheduled", color: "yellow" };
    }
    if (promo.isActive && startDate <= now && expiryDate >= now) {
      return { status: "Active", color: "green" };
    }
    return { status: "Inactive", color: "gray" };
  };

  const stats = {
    total: safePromoCodes.length,
    active: safePromoCodes.filter(p => {
      const now = new Date();
      const startDate = new Date(p.startDate);
      const expiryDate = new Date(p.expiryDate);
      return p.isActive && startDate <= now && expiryDate >= now;
    }).length,
    expired: safePromoCodes.filter(p => new Date(p.expiryDate) < new Date()).length,
    scheduled: safePromoCodes.filter(p => new Date(p.startDate) > new Date()).length,
    totalUsage: safePromoCodes.reduce((sum, p) => sum + (p.usedCount || 0), 0)
  };

  // Calculate usage percentage
  const getUsagePercentage = (used, limit) => {
    if (!limit) return 0;
    return Math.min((used / limit) * 100, 100);
  };

  if (status === "loading" && !editingPromo) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-200 border-t-purple-600 mx-auto"></div>
            <Sparkles className="w-6 h-6 text-purple-600 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
          </div>
          <p className="mt-4 text-gray-600 font-medium">Loading promo codes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-2 rounded-lg">
                  <Ticket className="w-6 h-6 text-white" />
                </div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                  Promo Codes
                </h1>
              </div>
              <p className="text-gray-600 text-lg">
                Manage promotional codes and track performance
              </p>
            </div>
            {canAdd && (
              <Link to="/admin/promo-codes/add">
                <button className="group relative bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-200 font-medium flex items-center gap-2">
                  <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
                  Create Promo Code
                </button>
              </Link>
            )}
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-purple-100 p-5 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Total Codes</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{stats.total}</p>
              </div>
              <div className="bg-purple-100 p-3 rounded-lg">
                <Ticket className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-green-100 p-5 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Active</p>
                <p className="text-3xl font-bold text-green-600 mt-1">{stats.active}</p>
              </div>
              <div className="bg-green-100 p-3 rounded-lg">
                <Sparkles className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-yellow-100 p-5 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Scheduled</p>
                <p className="text-3xl font-bold text-yellow-600 mt-1">{stats.scheduled}</p>
              </div>
              <div className="bg-yellow-100 p-3 rounded-lg">
                <CalendarClock className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-red-100 p-5 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Expired</p>
                <p className="text-3xl font-bold text-red-600 mt-1">{stats.expired}</p>
              </div>
              <div className="bg-red-100 p-3 rounded-lg">
                <Clock className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-blue-100 p-5 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Total Usage</p>
                <p className="text-3xl font-bold text-blue-600 mt-1">{stats.totalUsage}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <TrendingUp className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Edit Modal */}
        {editingPromo && (
          <EditPromoCode promo={editingPromo} onClose={handleCloseEdit} />
        )}

        {/* Promo Codes Grid */}
        {safePromoCodes.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center border border-gray-100">
            <div className="bg-gradient-to-br from-purple-100 to-blue-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
              <Ticket className="w-12 h-12 text-purple-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">
              No Promo Codes Yet
            </h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              Start creating promotional codes to boost sales and reward your customers
            </p>
            {canAdd && (
              <Link to="/admin/promo-codes/add">
                <button className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-xl hover:shadow-lg transition-all duration-200 font-medium inline-flex items-center gap-2">
                  <Plus className="w-5 h-5" />
                  Create Your First Promo Code
                </button>
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {safePromoCodes.map((promo, index) => {
              const promoStatus = getPromoStatus(promo);
              const usagePercent = getUsagePercentage(promo?.usedCount, promo?.usageLimit);

              // Status badge colors
              const statusColors = {
                green: "bg-green-500/20 text-white border border-green-300/30",
                red: "bg-red-500/20 text-white border border-red-300/30",
                yellow: "bg-yellow-500/20 text-white border border-yellow-300/30",
                gray: "bg-gray-500/20 text-white border border-gray-300/30"
              };

              return (
                <div
                  key={promo._id || index}
                  className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden"
                >
                  {/* Card Header with Gradient */}
                  <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-6 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -mr-16 -mt-16"></div>
                    <div className="relative">
                      <div className="flex items-start justify-between mb-3">
                        <div className="bg-white/20 backdrop-blur-sm p-2 rounded-lg">
                          <Ticket className="w-6 h-6 text-white" />
                        </div>
                        <span
                          className={`px-3 py-1 text-xs font-semibold rounded-full backdrop-blur-sm ${statusColors[promoStatus.color]}`}
                        >
                          {promoStatus.status}
                        </span>
                      </div>
                      <h3 className="text-2xl font-bold text-white mb-1 font-mono tracking-wider">
                        {promo?.code || "N/A"}
                      </h3>
                      <div className="flex items-center gap-2">
                        <Tag className="w-4 h-4 text-white/80" />
                        <span className="text-white/90 text-sm font-medium">
                          {promo?.discountValue || 0}₹ OFF
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-6">
                    <div className="space-y-4 mb-5">
                      {/* ✅ Start Date & Expiry Date */}
                      <div className="grid grid-cols-2 gap-3">
                        <div className="flex items-start gap-2 text-gray-700">
                          <div className="bg-blue-100 p-2 rounded-lg mt-0.5">
                            <Calendar className="w-4 h-4 text-blue-600" />
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 font-medium">Starts</p>
                            <p className="text-sm font-semibold">{formatDate(promo?.startDate)}</p>
                          </div>
                        </div>

                        <div className="flex items-start gap-2 text-gray-700">
                          <div className="bg-orange-100 p-2 rounded-lg mt-0.5">
                            <Calendar className="w-4 h-4 text-orange-600" />
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 font-medium">Expires</p>
                            <p className="text-sm font-semibold">{formatDate(promo?.expiryDate)}</p>
                          </div>
                        </div>
                      </div>

                      {/* Usage Stats */}
                      <div className="bg-gray-50 rounded-xl p-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2 text-gray-700">
                            <Users className="w-4 h-4 text-blue-600" />
                            <span className="text-sm font-medium">Usage</span>
                          </div>
                          <span className="text-sm font-bold text-gray-900">
                            {promo?.usedCount || 0} / {promo?.usageLimit || 0}
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-500"
                            style={{ width: `${usagePercent}%` }}
                          ></div>
                        </div>
                      </div>

                      {/* Product/Category Info */}
                      {(promo?.applicableProduct || promo?.applicableSubCategory) && (
                        <div className="flex items-start gap-3 text-gray-700 bg-purple-50 rounded-lg p-3">
                          <div className="bg-purple-100 p-2 rounded-lg mt-0.5">
                            <Package className="w-4 h-4 text-purple-600" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs text-gray-500 font-medium mb-1">Applicable To</p>
                            <p className="text-sm font-semibold truncate">
                              {promo?.applicableProduct?.name || promo?.applicableSubCategory?.name || "N/A"}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Action Buttons */}
                    {(canEdit || canDelete) && (
                      <div className="flex gap-3 pt-5 border-t border-gray-100">
                        {canEdit && (
                          <button
                            onClick={() => handleEdit(promo)}
                            className="flex-1 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 text-sm font-semibold flex items-center justify-center gap-2 shadow-sm hover:shadow-md"
                          >
                            <Pencil className="w-4 h-4" />
                            Edit
                          </button>
                        )}
                        {canDelete && (
                          <button
                            onClick={() => handleDelete(promo._id, promo.code)}
                            disabled={deletingId === promo._id}
                            className="flex-1 px-4 py-2.5 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl hover:from-red-700 hover:to-red-800 transition-all duration-200 text-sm font-semibold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md"
                          >
                            {deletingId === promo._id ? (
                              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                            ) : (
                              <>
                                <Trash2 className="w-4 h-4" />
                                Delete
                              </>
                            )}
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default PromoCode;