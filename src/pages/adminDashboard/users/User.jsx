import { fetchAllUsers } from '@/global_redux/features/auth/authThunks';
import React, { useEffect, useState, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Users as UsersIcon, Mail, Phone, Calendar, CheckCircle, XCircle, UserCheck, Download, FileSpreadsheet, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Search, FilterX } from 'lucide-react';
import { exportUsers } from '@/utils/exportUtils';
import toast from 'react-hot-toast';

const User = () => {
  const dispatch = useDispatch();
  const { allUsers, usersLoading, admin, error } = useSelector((state) => state.auth);
  
  const [hasAdminAccess, setHasAdminAccess] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  useEffect(() => {
    // Check for admin
    const adminToken = localStorage.getItem('adminToken');
    
    let isAdmin = admin || adminToken;
    
    setHasAdminAccess(!!isAdmin);

    if (isAdmin) {
      dispatch(fetchAllUsers());
    }
  }, [dispatch, admin]);

  // Filter users based on search and date range
  const filteredUsers = useMemo(() => {
    const filtered = allUsers?.filter(user => {
      const matchesSearch = 
        !searchTerm ||
        user.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.phone?.includes(searchTerm);
      
      // Date range matching
      let matchesDate = true;
      if (user.createdAt) {
        const registrationDate = new Date(user.createdAt);
        registrationDate.setHours(0, 0, 0, 0);

        if (startDate) {
          const from = new Date(startDate);
          from.setHours(0, 0, 0, 0);
          if (registrationDate < from) matchesDate = false;
        }

        if (endDate) {
          const to = new Date(endDate);
          to.setHours(0, 0, 0, 0);
          if (registrationDate > to) matchesDate = false;
        }
      }
      
      return matchesSearch && matchesDate;
    }) || [];
    
    // Reset to first page when filters change
    setCurrentPage(1);
    return filtered;
  }, [allUsers, searchTerm, startDate, endDate]);

  // Pagination logic
  const paginatedUsers = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredUsers.slice(startIndex, endIndex);
  }, [filteredUsers, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setStartDate('');
    setEndDate('');
    setCurrentPage(1);
  };

  // Calculate statistics
  const stats = {
    total: allUsers?.length || 0,
    recentUsers: allUsers?.filter(u => {
      const userDate = new Date(u.createdAt);
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      return userDate >= thirtyDaysAgo;
    }).length || 0,
  };

  if (!hasAdminAccess) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-br from-red-50 to-red-100">
        <div className="bg-white p-8 rounded-2xl shadow-xl text-center max-w-md">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <XCircle className="w-8 h-8 text-red-600" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Access Denied</h3>
          <p className="text-gray-600">Admin access required to view users management.</p>
        </div>
      </div>
    );
  }

  if (usersLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-lg font-semibold text-gray-700">Loading users...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-br from-red-50 to-red-100">
        <div className="bg-white p-8 rounded-2xl shadow-xl text-center max-w-md">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <XCircle className="w-8 h-8 text-red-600" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Error Loading Users</h3>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        {/* Header */}
        <div className="mb-8 animate-fadeIn">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2 flex items-center gap-3">
                <UsersIcon className="w-8 h-8" />
                Users Management
              </h1>
              <p className="text-gray-600 text-sm sm:text-base">
                Manage and monitor all registered users in your system.
              </p>
            </div>
            {/* Download Button */}
            <button
              onClick={() => {
                exportUsers(filteredUsers, 'csv');
                toast.success('CSV file downloaded successfully!');
              }}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors shadow-sm"
            >
              <Download className="w-5 h-5" />
              Download Data (CSV)
            </button>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-8">
          <div 
            className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden transform hover:-translate-y-1"
            style={{ animation: 'slideInUp 0.5s ease-out backwards' }}
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-3 rounded-xl shadow-lg">
                  <UsersIcon className="w-6 h-6 text-white" />
                </div>
              </div>
              <h3 className="text-gray-500 text-sm font-medium mb-2">Total Users</h3>
              <p className="text-3xl font-bold text-gray-900 tracking-tight">{stats.total}</p>
            </div>
            <div className="h-1 bg-gradient-to-r from-blue-500 to-blue-600"></div>
          </div>

          <div 
            className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden transform hover:-translate-y-1"
            style={{ animation: 'slideInUp 0.5s ease-out 0.2s backwards' }}
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-gradient-to-br from-green-500 to-green-600 p-3 rounded-xl shadow-lg">
                  <UserCheck className="w-6 h-6 text-white" />
                </div>
              </div>
              <h3 className="text-gray-500 text-sm font-medium mb-2">New Users (30d)</h3>
              <p className="text-3xl font-bold text-gray-900 tracking-tight">{stats.recentUsers}</p>
            </div>
            <div className="h-1 bg-gradient-to-r from-green-500 to-green-600"></div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-8 animate-fadeIn">
          <div className="flex flex-col sm:flex-row gap-4 items-end">
            {/* Search Input */}
            <div className="flex-[2]">
              <label className="block text-xs font-semibold text-gray-500 mb-1 ml-1 uppercase tracking-wider">Search Users</label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search by name, email, or phone..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              </div>
            </div>

            {/* Date From */}
            <div className="flex-1">
              <label className="block text-xs font-semibold text-gray-500 mb-1 ml-1 uppercase tracking-wider">From Date</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              />
            </div>

            {/* Date To */}
            <div className="flex-1">
              <label className="block text-xs font-semibold text-gray-500 mb-1 ml-1 uppercase tracking-wider">To Date</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              />
            </div>

            {/* Reset Button */}
            <button
              onClick={handleClearFilters}
              className="p-3 bg-gray-100 text-gray-500 rounded-xl hover:bg-gray-200 transition-all"
              title="Clear Filters"
            >
              <FilterX className="w-6 h-6" />
            </button>
          </div>

          <div className="mt-4 text-sm text-gray-600">
            Showing <span className="font-semibold text-gray-900">{filteredUsers.length}</span> matching users
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden animate-fadeIn">
          <div className="bg-gradient-to-r from-gray-50 to-white px-6 py-5 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <UsersIcon className="w-5 h-5" />
              User List
            </h2>
            <p className="text-gray-600 text-sm mt-1">
              Complete list of all registered users
            </p>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Joined Date
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {paginatedUsers.length > 0 ? (
                  paginatedUsers.map((user, idx) => (
                    <tr
                      key={user._id}
                      className="hover:bg-gradient-to-r hover:from-blue-50 hover:to-transparent transition-all duration-200"
                      style={{
                        animation: `fadeIn 0.3s ease-out ${idx * 0.05}s backwards`,
                      }}
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold text-sm shadow-lg">
                            {user.username?.charAt(0).toUpperCase() || 'U'}
                          </div>
                          <div>
                            <div className="text-sm font-bold text-gray-900">
                              {user.username}
                            </div>
                            <div className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                              <Mail className="w-3 h-3" />
                              {user.email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-900">
                            {user.phone || (
                              <span className="text-gray-400 italic">Not provided</span>
                            )}
                          </span>
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          {new Date(user.createdAt).toLocaleDateString('en-IN', {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric'
                          })}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center justify-center">
                        <UsersIcon className="w-12 h-12 text-gray-300 mb-3" />
                        <p className="text-gray-500 font-medium">No users found</p>
                        <p className="text-gray-400 text-sm mt-1">
                          Try adjusting your filters (search or date range)
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center gap-3">
                  <label className="text-sm text-gray-600">Show:</label>
                  <select
                    value={itemsPerPage}
                    onChange={handleItemsPerPageChange}
                    className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value={5}>5</option>
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                    <option value={50}>50</option>
                    <option value={100}>100</option>
                  </select>
                  <span className="text-sm text-gray-600">
                    Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredUsers.length)} of {filteredUsers.length} users
                  </span>
                </div>
                
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handlePageChange(1)}
                    disabled={currentPage === 1}
                    className="p-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                  >
                    <ChevronsLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="p-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }
                    
                    return (
                      <button
                        key={pageNum}
                        onClick={() => handlePageChange(pageNum)}
                        className={`px-4 py-2 border rounded-lg ${
                          currentPage === pageNum
                            ? 'bg-blue-600 text-white border-blue-600'
                            : 'border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                  
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="p-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handlePageChange(totalPages)}
                    disabled={currentPage === totalPages}
                    className="p-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                  >
                    <ChevronsRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Info */}
        {filteredUsers.length > 0 && (
          <div className="mt-6 bg-white rounded-2xl shadow-sm p-6 animate-fadeIn">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                <span className="text-gray-600">
                  <span className="font-semibold text-gray-900">{stats.recentUsers}</span> users joined in last 30 days
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.6s ease-out;
        }
      `}</style>
    </div>
  );
};

export default User;