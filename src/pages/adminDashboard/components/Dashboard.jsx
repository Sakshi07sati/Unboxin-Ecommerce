import React, { useMemo } from 'react';
import { 
  DollarSign, 
  ShoppingCart, 
  UserCheck, 
  Package, 
  Clock, 
  CheckCircle,
} from "lucide-react";

const Dashboard = () => {
  // Static Statistics Data
  const stats = {
    totalRevenue: 1250000,
    totalOrders: 450,
    totalCustomers: 1200,
    cards: [
      {
        name: "Total Revenue",
        value: "₹12,50,000",
        icon: DollarSign,
        color: "from-blue-500 to-blue-600",
      },
      {
        name: "Total Orders",
        value: "450",
        icon: ShoppingCart,
        color: "from-green-500 to-green-600",
      },
      {
        name: "Total Customers",
        value: "1,200",
        icon: UserCheck,
        color: "from-purple-500 to-purple-600",
      },
    ]
  };

  // Static Orders Data
  const staticOrders = [
    {
      id: "1",
      orderId: "#ORD001",
      customer: "Rahul Sharma",
      product: "Premium Cotton T-Shirt",
      amount: "₹1,299",
      status: "Delivered",
      date: "12 Apr, 2026",
    },
    {
      id: "2",
      orderId: "#ORD002",
      customer: "Priya Patel",
      product: "Denim Jacket",
      amount: "₹3,499",
      status: "Processing",
      date: "13 Apr, 2026",
    },
    {
      id: "3",
      orderId: "#ORD003",
      customer: "Amit Singh",
      product: "Casual Sneakers",
      amount: "₹2,799",
      status: "Shipped",
      date: "13 Apr, 2026",
    },
    {
      id: "4",
      orderId: "#ORD004",
      customer: "Sneha Gupta",
      product: "Leather Wallet",
      amount: "₹899",
      status: "Pending",
      date: "13 Apr, 2026",
    },
    {
      id: "5",
      orderId: "#ORD005",
      customer: "Vikram Malhotra",
      product: "Summer Shorts",
      amount: "₹1,599",
      status: "Cancelled",
      date: "11 Apr, 2026",
    }
  ];

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "delivered":
        return "bg-green-100 text-green-700 border border-green-200";
      case "processing":
        return "bg-blue-100 text-blue-700 border border-blue-200";
      case "shipped":
        return "bg-purple-100 text-purple-700 border border-purple-200";
      case "pending":
        return "bg-yellow-100 text-yellow-700 border border-yellow-200";
      case "cancelled":
        return "bg-red-100 text-red-700 border border-red-200";
      default:
        return "bg-gray-100 text-gray-700 border border-gray-200";
    }
  };

  const getStatusIcon = (status) => {
    switch (status.toLowerCase()) {
      case "delivered":
        return <CheckCircle className="w-4 h-4" />;
      case "shipped":
        return <Package className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  return (
    <main className="flex-1 overflow-y-auto bg-gray-50 min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard Overview</h1>
          <p className="text-gray-600">Real-time business performance metrics.</p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {stats.cards.map((stat) => (
            <div key={stat.name} className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`bg-gradient-to-br ${stat.color} p-3 rounded-xl shadow-lg`}>
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                </div>
                <h3 className="text-gray-500 text-sm font-medium mb-1">{stat.name}</h3>
                <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
              </div>
              <div className={`h-1 bg-gradient-to-r ${stat.color}`}></div>
            </div>
          ))}
        </div>

        {/* Recent Orders Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center">
            <h2 className="text-xl font-bold text-gray-900">Recent Orders</h2>
            <button className="text-blue-600 hover:text-blue-700 text-sm font-semibold">View All</button>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 text-gray-700 text-xs uppercase font-bold">
                <tr>
                  <th className="px-6 py-4 text-left">Order ID</th>
                  <th className="px-6 py-4 text-left">Customer</th>
                  <th className="px-6 py-4 text-left">Product</th>
                  <th className="px-6 py-4 text-left">Amount</th>
                  <th className="px-6 py-4 text-left">Status</th>
                  <th className="px-6 py-4 text-left">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {staticOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-sm font-bold text-blue-600">{order.orderId}</td>
                    <td className="px-6 py-4 text-sm text-gray-900 font-medium">{order.customer}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{order.product}</td>
                    <td className="px-6 py-4 text-sm font-bold text-gray-900">{order.amount}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(order.status)}`}>
                        {getStatusIcon(order.status)}
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">{order.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Dashboard;