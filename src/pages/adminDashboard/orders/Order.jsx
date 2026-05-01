import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Package,
  Truck,
  Calendar,
  Search,
  Filter,
  Edit,
  RotateCw,
  Trash2,
  Clock,
  CheckCircle,
  Eye,
  X
} from "lucide-react";
import {
  fetchAllOrders,
  adminUpdateOrderStatus,
  adminUpdateShipment,
  adminDeleteOrder
} from "../../../global_redux/features/order/orderThunks";
import {
  selectAllOrders,
  selectOrdersLoading
} from "../../../global_redux/features/order/orderSlice";
import toast from "react-hot-toast";

const Order = () => {
  const dispatch = useDispatch();
  const orders = useSelector(selectAllOrders);
  const loading = useSelector(selectOrdersLoading);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [isShipmentModalOpen, setIsShipmentModalOpen] = useState(false);

  const [shipmentData, setShipmentData] = useState({
    trackingNumber: "",
    courier: "",
    estimatedDelivery: ""
  });
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchAllOrders());
  }, [dispatch]);

  const handleRefresh = () => {
    dispatch(fetchAllOrders());
    toast.success("Order list refreshed");
  };

  const handleDeleteOrder = (id) => {
    if (window.confirm("Delete this order?")) {
      dispatch(adminDeleteOrder(id));
    }
  };

  const handleViewDetails = (order) => {
    setSelectedOrder(order);
    setIsDetailsModalOpen(true);
  };

  const handleOpenStatusModal = (order) => {
    setSelectedOrder(order);
    setIsStatusModalOpen(true);
  };

  const handleOpenShipmentModal = (order) => {
    setSelectedOrder(order);
    setShipmentData({
      trackingNumber: order.shipment?.trackingNumber || "",
      courier: order.shipment?.courier || "",
      estimatedDelivery: order.shipment?.estimatedDelivery ? new Date(order.shipment.estimatedDelivery).toISOString().split('T')[0] : ""
    });
    setIsShipmentModalOpen(true);
  };

  const handleUpdateStatus = async (status) => {
    try {
      await dispatch(adminUpdateOrderStatus({ orderId: selectedOrder._id, status })).unwrap();
      toast.success(`Order status updated to ${status}`);
      setIsStatusModalOpen(false);
    } catch (error) {
      toast.error(error || "Failed to update status");
    }
  };

  const handleUpdateShipment = async (e) => {
    e.preventDefault();
    try {
      await dispatch(adminUpdateShipment({ orderId: selectedOrder._id, shipmentData })).unwrap();
      toast.success("Shipment details updated");
      setIsShipmentModalOpen(false);
    } catch (error) {
      toast.error(error || "Failed to update shipment");
    }
  };

  const filteredOrders = useMemo(() => {
    return orders?.filter((o) => {
      const search =
        (o._id || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (o.customerName || "").toLowerCase().includes(searchTerm.toLowerCase());

      const status =
        statusFilter === "all" ||
        (o.status || "").toLowerCase() === statusFilter.toLowerCase();

      return search && status;
    }) || [];
  }, [orders, searchTerm, statusFilter]);

  const formatDate = (d) =>
    new Date(d).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric"
    });

  const getStatusStyle = (s) => {
    s = s?.toLowerCase();
    if (s === "delivered") return "bg-emerald-100 text-emerald-600";
    if (s === "cancelled") return "bg-red-100 text-red-600";
    if (s === "shipped") return "bg-blue-100 text-blue-600";
    if (s === "confirmed") return "bg-indigo-100 text-indigo-600";
    return "bg-amber-100 text-amber-600";
  };

  if (loading && orders.length === 0) {
    return <div className="text-center py-20">Loading...</div>;
  }

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Order Management</h1>
          <p className="text-[13px] font-semibold text-gray-600 uppercase mt-1 flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
            Active Population: {filteredOrders.length} database records
          </p>
        </div>
        <button 
          onClick={handleRefresh}
          className="flex items-center gap-2 px-6 py-2.5 bg-white border border-gray-200 rounded-xl text-xs font-black text-gray-700 hover:shadow-lg transition-all active:scale-95"
        >
          <RotateCw size={14} className="text-blue-600" />
          REFRESH ENGINE
        </button>
      </div>

      {/* Top Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="relative group overflow-hidden bg-gradient-to-br from-amber-400 to-amber-600 p-6 rounded-xl shadow-xl shadow-amber-100 text-white border-b-4 border-amber-700/20">
          <div className="relative z-10">
            <p className="text-[10px] font-black uppercase tracking-widest opacity-80 mb-2">Pending Vault</p>
            <p className="text-3xl font-black">{orders.filter(o => o.status === "Pending").length}</p>
          </div>
          {/* <Clock className="absolute right-[-10px] bottom-[-10px] w-24 h-24 text-white/10" /> */}
        </div>

        <div className="relative group overflow-hidden bg-gradient-to-br from-indigo-500 to-indigo-700 p-6 rounded-xl shadow-xl shadow-indigo-100 text-white border-b-4 border-indigo-700/20">
          <div className="relative z-10">
            <p className="text-[10px] font-black uppercase tracking-widest opacity-80 mb-2">Confirmed Matrix</p>
            <p className="text-3xl font-black">{orders.filter(o => o.status === "Confirmed").length}</p>
          </div>
          {/* <CheckCircle className="absolute right-[-10px] bottom-[-10px] w-24 h-24 text-white/10" /> */}
        </div>

        <div className="relative group overflow-hidden bg-gradient-to-br from-blue-500 to-blue-700 p-6 rounded-xl shadow-xl shadow-blue-100 text-white border-b-4 border-blue-700/20">
          <div className="relative z-10">
            <p className="text-[10px] font-black uppercase tracking-widest opacity-80 mb-2">Transit Queue</p>
            <p className="text-3xl font-black">{orders.filter(o => o.status === "Shipped").length}</p>
          </div>
          {/* <Truck className="absolute right-[-10px] bottom-[-10px] w-24 h-24 text-white/10" /> */}
        </div>

        <div className="relative group overflow-hidden bg-gradient-to-br from-emerald-500 to-emerald-700 p-6 rounded-xl shadow-xl shadow-emerald-100 text-white border-b-4 border-emerald-700/20">
          <div className="relative z-10">
            <p className="text-[10px] font-black uppercase tracking-widest opacity-80 mb-2">Delivered Assets</p>
            <p className="text-3xl font-black">{orders.filter(o => o.status === "Delivered").length}</p>
          </div>
          {/* <Package className="absolute right-[-10px] bottom-[-10px] w-24 h-24 text-white/10" /> */}
        </div>
      </div>

      {/* FILTER */}
      <div className="bg-white p-4 rounded-xl border">
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-2.5 text-gray-400" size={16} />
            <input
              className="w-full pl-9 py-2 text-sm border rounded-lg"
              placeholder="Search orders..."
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <select
            className="px-3 py-2 text-sm border rounded-lg"
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All</option>
            <option>Pending</option>
            <option>Confirmed</option>
            <option>Shipped</option>
            <option>Delivered</option>
          </select>
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-xl border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-xs text-gray-500 uppercase">
            <tr>
              <th className="px-6 py-3 text-left">Order</th>
              <th className="px-6 py-3 text-left">Customer</th>
              <th className="px-6 py-3 text-left">Amount</th>
              <th className="px-6 py-3 text-left">Status</th>
              <th className="px-6 py-3 text-left">Action</th>
            </tr>
          </thead>

          <tbody>
            {filteredOrders.map((o) => (
              <tr key={o._id} className="border-t hover:bg-gray-50">
                <td className="px-6 py-4">
                  <p className="font-semibold text-gray-900">
                    #{o._id.slice(-6)}
                  </p>
                  <p className="text-xs text-gray-500">
                    {formatDate(o.createdAt)}
                  </p>
                </td>

                <td className="px-6 py-4">
                  <p className="font-medium text-gray-800">
                    {o.customerName}
                  </p>
                  <p className="text-xs text-gray-500">
                    {o.email}
                  </p>
                </td>

                <td className="px-6 py-4 font-medium">
                  ₹{o.totalAmount}
                </td>

                <td className="px-6 py-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusStyle(
                      o.status
                    )}`}
                  >
                    {o.status}
                  </span>
                </td>

                <td className="px-6 py-4 flex gap-2">
                  <button 
                    onClick={() => handleViewDetails(o)}
                    className="p-2 hover:bg-blue-50 text-blue-600 rounded"
                    title="View Details"
                  >
                    <Eye size={16} />
                  </button>

                  <button 
                    onClick={() => handleOpenStatusModal(o)}
                    className="p-2 hover:bg-indigo-50 text-indigo-600 rounded"
                    title="Update Status"
                  >
                    <Edit size={16} />
                  </button>

                  <button 
                    onClick={() => handleOpenShipmentModal(o)}
                    className="p-2 hover:bg-amber-50 text-amber-600 rounded"
                    title="Update Shipment"
                  >
                    <Truck size={16} />
                  </button>

                  <button
                    onClick={() => handleDeleteOrder(o._id)}
                    className="p-2 hover:bg-red-50 text-red-500 rounded"
                    title="Delete Order"
                  >
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredOrders.length === 0 && (
          <div className="text-center py-10 text-gray-400 text-sm">
            No orders found
          </div>
        )}
      </div>

      {/* Details Modal */}
      {isDetailsModalOpen && selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl animate-scaleUp">
            <div className="p-6 border-b flex justify-between items-center bg-gray-50">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Order Details</h2>
                <p className="text-sm text-gray-500">ID: #{selectedOrder._id}</p>
              </div>
              <button onClick={() => setIsDetailsModalOpen(false)} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 rounded-xl">
                  <p className="text-xs font-bold text-gray-400 uppercase mb-2">Customer Info</p>
                  <p className="font-bold text-gray-900">{selectedOrder.customerName}</p>
                  <p className="text-sm text-gray-600">{selectedOrder.email}</p>
                  <p className="text-sm text-gray-600">{selectedOrder.phone}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-xl">
                  <p className="text-xs font-bold text-gray-400 uppercase mb-2">Shipping Address</p>
                  <p className="text-sm text-gray-900">{selectedOrder.shippingAddress?.address}</p>
                  <p className="text-sm text-gray-900">{selectedOrder.shippingAddress?.city}, {selectedOrder.shippingAddress?.state} - {selectedOrder.shippingAddress?.pincode}</p>
                  {selectedOrder.shippingAddress?.landmark && (
                    <p className="text-xs text-gray-500 mt-1">Landmark: {selectedOrder.shippingAddress.landmark}</p>
                  )}
                </div>
              </div>

              <div>
                <p className="text-xs font-bold text-gray-400 uppercase mb-3">Order Items</p>
                <div className="space-y-3">
                  {selectedOrder.items?.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-4 p-3 border rounded-xl hover:bg-gray-50 transition-colors">
                      <img src={item.image} alt="" className="w-12 h-12 rounded-lg object-cover border" />
                      <div className="flex-1">
                        <p className="font-bold text-gray-900 text-sm">{item.name}</p>
                        <p className="text-xs text-gray-500">Size: {item.size} | Qty: {item.quantity}</p>
                      </div>
                      <p className="font-bold text-gray-900">₹{item.price * item.quantity}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-blue-700">Subtotal</span>
                  <span className="font-bold text-blue-900">₹{selectedOrder.subtotal}</span>
                </div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-blue-700">Discount</span>
                  <span className="font-bold text-green-600">-₹{selectedOrder.discount}</span>
                </div>
                <div className="flex justify-between text-lg font-black mt-2 pt-2 border-t border-blue-200">
                  <span className="text-blue-900">Total Amount</span>
                  <span className="text-blue-900">₹{selectedOrder.totalAmount}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Status Modal */}
      {isStatusModalOpen && selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl animate-scaleUp">
            <div className="p-6 border-b flex justify-between items-center bg-gray-50">
              <h2 className="text-xl font-bold text-gray-900">Update Status</h2>
              <button onClick={() => setIsStatusModalOpen(false)} className="p-2 hover:bg-gray-200 rounded-full">
                <X size={20} />
              </button>
            </div>
            <div className="p-6 grid grid-cols-1 gap-3">
              {['Pending', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled'].map((status) => (
                <button
                  key={status}
                  onClick={() => handleUpdateStatus(status)}
                  className={`w-full py-3 rounded-xl font-bold transition-all ${
                    selectedOrder.status === status 
                    ? 'bg-blue-600 text-white shadow-lg scale-105' 
                    : 'bg-gray-50 text-gray-700 hover:bg-gray-100 border'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Shipment Modal */}
      {isShipmentModalOpen && selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl animate-scaleUp">
            <div className="p-6 border-b flex justify-between items-center bg-gray-50">
              <h2 className="text-xl font-bold text-gray-900">Shipment Details</h2>
              <button onClick={() => setIsShipmentModalOpen(false)} className="p-2 hover:bg-gray-200 rounded-full">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleUpdateShipment} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-black text-gray-400 uppercase mb-1">Courier Partner</label>
                <input
                  className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                  value={shipmentData.courier}
                  onChange={(e) => setShipmentData({ ...shipmentData, courier: e.target.value })}
                  placeholder="e.g. BlueDart, Delhivery"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-black text-gray-400 uppercase mb-1">Tracking Number</label>
                <input
                  className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                  value={shipmentData.trackingNumber}
                  onChange={(e) => setShipmentData({ ...shipmentData, trackingNumber: e.target.value })}
                  placeholder="Enter AWB or Tracking ID"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-black text-gray-400 uppercase mb-1">Estimated Delivery</label>
                <input
                  type="date"
                  className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                  value={shipmentData.estimatedDelivery}
                  onChange={(e) => setShipmentData({ ...shipmentData, estimatedDelivery: e.target.value })}
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg active:scale-95"
              >
                SAVE LOGISTICS DATA
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Order;