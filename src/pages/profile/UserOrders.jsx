import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserOrders, cancelUserOrder } from "../../global_redux/features/order/orderThunks";
import { selectUserOrders, selectOrdersLoading } from "../../global_redux/features/order/orderSlice";
import { Package, Calendar, MapPin, Loader2, ArrowLeft, XCircle } from "lucide-react";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import Navbar from "../../components/common/Navbar";
import Footer from "../../components/common/Footer";

const UserOrders = () => {
  const dispatch = useDispatch();
  const orders = useSelector(selectUserOrders) || [];
  const loading = useSelector(selectOrdersLoading);
  const user = useSelector((state) => state.auth?.user);

  useEffect(() => {
    if (user?.email) {
      dispatch(fetchUserOrders(user.email));
    }
  }, [dispatch, user]);

  const handleCancelOrder = async (orderId) => {
    if (window.confirm("Are you sure you want to cancel this order?")) {
      const res = await dispatch(cancelUserOrder(orderId));
      if (!res.error) {
        toast.success("Order cancelled successfully");
      } else {
        toast.error(res.payload || "Failed to cancel order");
      }
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getStatusColor = (status) => {
    const s = status?.toLowerCase();
    if (s === "delivered") return "bg-green-100 text-green-800";
    if (s === "shipped") return "bg-blue-100 text-blue-800";
    if (s === "cancelled") return "bg-red-100 text-red-800";
    if (s === "confirmed") return "bg-indigo-100 text-indigo-800";
    return "bg-yellow-100 text-yellow-800"; // pending
  };

  if (!user) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center bg-white p-8 rounded-2xl shadow-lg max-w-md w-full mx-4">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Please Login</h2>
            <p className="text-gray-600 mb-6">You need to be logged in to view your orders.</p>
            <Link to="/login" className="inline-block w-full py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition">
              Login Now
            </Link>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8 flex items-center justify-between">
            <div>
              <Link to="/profile" className="inline-flex items-center gap-2 text-sm text-blue-600 font-medium hover:text-blue-800 mb-2">
                <ArrowLeft className="w-4 h-4" /> Back to Profile
              </Link>
              <h1 className="text-3xl font-bold text-gray-900">My Orders</h1>
              <p className="text-gray-600 mt-1">Track and manage your past purchases</p>
            </div>
            <div className="bg-white p-3 rounded-full shadow-sm border border-gray-100">
              <Package className="w-8 h-8 text-blue-600" />
            </div>
          </div>

          {/* Orders List */}
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl shadow-sm border border-gray-100">
              <Loader2 className="w-10 h-10 text-blue-600 animate-spin mb-4" />
              <p className="text-gray-600 font-medium">Loading your orders...</p>
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-gray-100">
              <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <Package className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">No orders found</h3>
              <p className="text-gray-500 mb-6 max-w-sm mx-auto">Looks like you haven't made any purchases yet. Start shopping to see your orders here!</p>
              <Link to="/shop" className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition shadow-md hover:shadow-lg">
                Browse Products
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              {orders.map((order) => (
                <div key={order._id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition duration-300">
                  {/* Order Header */}
                  <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="grid grid-cols-2 sm:flex sm:gap-8 gap-4">
                      <div>
                        <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Order Placed</p>
                        <p className="text-sm font-medium text-gray-900 flex items-center gap-1">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          {formatDate(order.createdAt)}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Total</p>
                        <p className="text-sm font-bold text-gray-900">₹{order.totalAmount}</p>
                      </div>
                      <div className="col-span-2 sm:col-span-1">
                        <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Order #</p>
                        <p className="text-sm font-medium text-gray-900 truncate max-w-[150px]" title={order._id}>
                          {order._id.slice(-8).toUpperCase()}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col sm:items-end gap-2 mt-4 sm:mt-0">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide w-fit ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                      {(order.status?.toLowerCase() === "pending" || order.status?.toLowerCase() === "processing" || order.status?.toLowerCase() === "confirmed") && (
                        <button
                          onClick={() => handleCancelOrder(order._id)}
                          className="flex items-center justify-center gap-1.5 text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg border border-red-100 transition-colors"
                        >
                          <XCircle className="w-3.5 h-3.5" />
                          Cancel Order
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="p-6">
                    <div className="space-y-4">
                      {order.items?.map((item, idx) => (
                        <div key={idx} className="flex gap-4 items-start pb-4 border-b border-gray-50 last:border-0 last:pb-0">
                          <div className="w-20 h-20 flex-shrink-0 bg-gray-50 rounded-xl overflow-hidden border border-gray-100">
                            {item.image ? (
                              <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <Package className="w-8 h-8 text-gray-300" />
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="text-base font-bold text-gray-900 truncate mb-1">{item.name}</h4>
                            <div className="text-sm text-gray-500 flex items-center gap-3">
                              <span>Qty: {item.quantity}</span>
                              {item.size && <span>Size: {item.size}</span>}
                            </div>
                            <div className="mt-2 text-sm font-bold text-gray-900">
                              ₹{item.price}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Shipping Info */}
                    {order.shippingAddress && (
                      <div className="mt-6 pt-6 border-t border-gray-100">
                        <h4 className="text-sm font-bold text-gray-900 mb-2 flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-blue-500" /> Shipping Address
                        </h4>
                        <p className="text-sm text-gray-600">
                          {order.shippingAddress.address}, {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}
                        </p>
                      </div>
                    )}
                    
                    {/* Shipment Tracking */}
                    {order.shipment?.trackingNumber && (
                      <div className="mt-4 p-4 bg-blue-50 rounded-xl border border-blue-100">
                        <p className="text-sm text-blue-800 font-medium">
                          <span className="font-bold">Courier:</span> {order.shipment.courier || 'N/A'}
                        </p>
                        <p className="text-sm text-blue-800 font-medium mt-1">
                          <span className="font-bold">Tracking ID:</span> {order.shipment.trackingNumber}
                        </p>
                        {order.shipment.estimatedDelivery && (
                          <p className="text-sm text-blue-800 mt-1">
                            Estimated Delivery: {formatDate(order.shipment.estimatedDelivery)}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default UserOrders;
