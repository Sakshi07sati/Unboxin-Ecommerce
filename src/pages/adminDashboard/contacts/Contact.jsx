import React, { useEffect, useState, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
  MessageSquare, 
  Mail, 
  Phone, 
  Calendar, 
  Search,
  Filter,
  Eye,
  RefreshCw,
  CheckCircle,
  Clock,
  XCircle,
  Send,
  User,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Download,
  FileSpreadsheet,
  FileText
} from "lucide-react";
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { fetchContacts, updateContactStatus } from '@/global_redux/features/contacts/contactThunks';
import { selectContacts, selectContactsLoading, selectContactsError } from '@/global_redux/features/contacts/contactSlice';
import { exportContacts } from '@/utils/exportUtils';

const AdminContacts = () => {
  const dispatch = useDispatch();
  const contacts = useSelector(selectContacts);
  const loading = useSelector(selectContactsLoading);
  const error = useSelector(selectContactsError);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [expandedContact, setExpandedContact] = useState(null);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [contactsPerPage, setContactsPerPage] = useState(10);

  const handleFetchContacts = () => {
    dispatch(fetchContacts());
  };

  useEffect(() => {
    handleFetchContacts();
  }, [dispatch]);
  // Update contact status
  const handleUpdateContactStatus = async (contactId, newStatus) => {
    try {
      await dispatch(updateContactStatus({ contactId, newStatus })).unwrap();
      toast.success("Contact status updated successfully!");
    } catch (err) {
      console.error("Error updating contact status:", err);
      toast.error(typeof err === 'string' ? err : "Failed to update contact status");
    }
  };

  // Filter and search contacts
  const filteredContacts = useMemo(() => {
    if (!contacts || contacts.length === 0) return [];
    
    let filtered = [...contacts];
    
    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(contact => 
        contact.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contact.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contact.phone?.includes(searchTerm) ||
        contact.subject?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contact.message?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter(contact => 
        contact.status?.toLowerCase() === statusFilter.toLowerCase()
      );
    }
    
    // Sort by date (newest first)
    filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    return filtered;
  }, [contacts, searchTerm, statusFilter]);

  // Get paginated contacts
  const paginatedContacts = useMemo(() => {
    const indexOfLastContact = currentPage * contactsPerPage;
    const indexOfFirstContact = indexOfLastContact - contactsPerPage;
    return filteredContacts.slice(indexOfFirstContact, indexOfLastContact);
  }, [filteredContacts, currentPage, contactsPerPage]);

  // Calculate total pages
  const totalPages = Math.ceil(filteredContacts.length / contactsPerPage);

  // Handle page change
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleContactsPerPageChange = (e) => {
    setContactsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "new":
        return "bg-blue-100 text-blue-700 border border-blue-200";
      case "read":
        return "bg-yellow-100 text-yellow-700 border border-yellow-200";
      case "replied":
        return "bg-purple-100 text-purple-700 border border-purple-200";
      case "resolved":
        return "bg-green-100 text-green-700 border border-green-200";
      default:
        return "bg-gray-100 text-gray-700 border border-gray-200";
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case "new":
        return <Clock className="w-4 h-4" />;
      case "read":
        return <Eye className="w-4 h-4" />;
      case "replied":
        return <Send className="w-4 h-4" />;
      case "resolved":
        return <CheckCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <RefreshCw className="w-12 h-12 text-blue-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading contacts...</p>
        </div>
      </div>
    );
  }

  if (error && contacts.length === 0) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Error</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={handleFetchContacts}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Calculate statistics
  const stats = {
    total: contacts.length,
    new: contacts.filter(c => c.status === 'new').length,
    read: contacts.filter(c => c.status === 'read').length,
    replied: contacts.filter(c => c.status === 'replied').length,
    resolved: contacts.filter(c => c.status === 'resolved').length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <MessageSquare className="w-8 h-8" />
            Contact Management
          </h1>
          <p className="text-gray-600 mt-1">
            View and manage all contact form submissions
          </p>
        </div>
        <div className="flex items-center gap-3">
          {/* Download Button */}
          <button
            onClick={() => {
              exportContacts(filteredContacts, 'csv');
              toast.success('CSV file downloaded successfully!');
            }}
            className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors shadow-sm"
          >
            <Download className="w-5 h-5" />
            Download Data (CSV)
          </button>
          <button
            onClick={handleFetchContacts}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <RefreshCw className="w-5 h-5" />
            Refresh
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Total Contacts</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{stats.total}</p>
            </div>
            <MessageSquare className="w-7 h-7 text-blue-500" />
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">New</p>
              <p className="text-2xl font-bold text-blue-600 mt-1">{stats.new}</p>
            </div>
            <Clock className="w-7 h-7 text-blue-500" />
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Read</p>
              <p className="text-2xl font-bold text-yellow-600 mt-1">{stats.read}</p>
            </div>
            <Eye className="w-7 h-7 text-yellow-500" />
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Replied</p>
              <p className="text-2xl font-bold text-purple-600 mt-1">{stats.replied}</p>
            </div>
            <Send className="w-7 h-7 text-purple-500" />
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Resolved</p>
              <p className="text-2xl font-bold text-green-600 mt-1">{stats.resolved}</p>
            </div>
            <CheckCircle className="w-7 h-7 text-green-500" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by name, email, phone, subject, or message..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Status</option>
              <option value="new">New</option>
              <option value="read">Read</option>
              <option value="replied">Replied</option>
              <option value="resolved">Resolved</option>
            </select>
          </div>
        </div>
      </div>

      {/* Contacts Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subject</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedContacts.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center">
                    <MessageSquare className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 text-lg">No contacts found</p>
                  </td>
                </tr>
              ) : (
                paginatedContacts.map((contact) => (
                  <React.Fragment key={contact._id}>
                    <tr className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold text-sm">
                            {contact.name?.charAt(0).toUpperCase() || 'C'}
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900">{contact.name}</div>
                            <div className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                              <Mail className="w-3 h-3" />
                              {contact.email}
                            </div>
                            {contact.phone && (
                              <div className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                                <Phone className="w-3 h-3" />
                                {contact.phone}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">
                          {contact.subject || <span className="text-gray-400 italic">No subject</span>}
                        </div>
                        <div className="text-xs text-gray-500 mt-1 line-clamp-1">
                          {contact.message?.substring(0, 50)}
                          {contact.message?.length > 50 && '...'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <select
                          value={contact.status || 'new'}
                          onChange={(e) => handleUpdateContactStatus(contact._id, e.target.value)}
                          className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(contact.status || 'new')} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                        >
                          <option value="new">New</option>
                          <option value="read">Read</option>
                          <option value="replied">Replied</option>
                          <option value="resolved">Resolved</option>
                        </select>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {new Date(contact.createdAt).toLocaleDateString('en-IN', {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric'
                          })}
                        </div>
                        <div className="text-xs text-gray-500">
                          {new Date(contact.createdAt).toLocaleTimeString('en-IN', {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => setExpandedContact(expandedContact === contact._id ? null : contact._id)}
                          className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium"
                        >
                          <Eye className="w-4 h-4" />
                          {expandedContact === contact._id ? 'Hide' : 'View'}
                        </button>
                      </td>
                    </tr>
                    
                    {/* Expanded Contact Details */}
                    <AnimatePresence>
                      {expandedContact === contact._id && (
                        <motion.tr
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <td colSpan="5" className="px-6 py-6 bg-gray-50">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              {/* Contact Information */}
                              <div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                  <User className="w-5 h-5" />
                                  Contact Information
                                </h3>
                                <div className="space-y-4">
                                  <div className="p-4 bg-white rounded-lg border border-gray-200">
                                    <div className="space-y-3">
                                      <div>
                                        <p className="text-xs text-gray-500 mb-1">Name</p>
                                        <p className="font-medium text-gray-900">{contact.name}</p>
                                      </div>
                                      <div>
                                        <p className="text-xs text-gray-500 mb-1">Email</p>
                                        <p className="font-medium text-gray-900 flex items-center gap-2">
                                          <Mail className="w-4 h-4" />
                                          <a href={`mailto:${contact.email}`} className="text-blue-600 hover:underline">
                                            {contact.email}
                                          </a>
                                        </p>
                                      </div>
                                      {contact.phone && (
                                        <div>
                                          <p className="text-xs text-gray-500 mb-1">Phone</p>
                                          <p className="font-medium text-gray-900 flex items-center gap-2">
                                            <Phone className="w-4 h-4" />
                                            <a href={`tel:${contact.phone}`} className="text-blue-600 hover:underline">
                                              {contact.phone}
                                            </a>
                                          </p>
                                        </div>
                                      )}
                                      {contact.subject && (
                                        <div>
                                          <p className="text-xs text-gray-500 mb-1">Subject</p>
                                          <p className="font-medium text-gray-900">{contact.subject}</p>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </div>

                              {/* Message */}
                              <div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                  <FileText className="w-5 h-5" />
                                  Message
                                </h3>
                                <div className="p-4 bg-white rounded-lg border border-gray-200">
                                  <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">
                                    {contact.message}
                                  </p>
                                </div>
                                <div className="mt-4 p-4 bg-white rounded-lg border border-gray-200">
                                  <div className="flex items-center justify-between text-sm">
                                    <div className="flex items-center gap-2 text-gray-600">
                                      <Calendar className="w-4 h-4" />
                                      <span>
                                        Submitted: {new Date(contact.createdAt).toLocaleString('en-IN', {
                                          day: '2-digit',
                                          month: 'short',
                                          year: 'numeric',
                                          hour: '2-digit',
                                          minute: '2-digit'
                                        })}
                                      </span>
                                    </div>
                                    {contact.updatedAt && contact.updatedAt !== contact.createdAt && (
                                      <div className="text-xs text-gray-500">
                                        Updated: {new Date(contact.updatedAt).toLocaleString('en-IN', {
                                          day: '2-digit',
                                          month: 'short',
                                          hour: '2-digit',
                                          minute: '2-digit'
                                        })}
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </td>
                        </motion.tr>
                      )}
                    </AnimatePresence>
                  </React.Fragment>
                ))
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
                  value={contactsPerPage}
                  onChange={handleContactsPerPageChange}
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                </select>
                <span className="text-sm text-gray-600">
                  Showing {((currentPage - 1) * contactsPerPage) + 1} to {Math.min(currentPage * contactsPerPage, filteredContacts.length)} of {filteredContacts.length} contacts
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
    </div>
  );
};

export default AdminContacts;

