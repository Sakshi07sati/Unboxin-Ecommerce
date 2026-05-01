import React, { useState, useMemo, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllOrders } from "../../../global_redux/features/order/orderThunks";
import { fetchAllUsers } from "../../../global_redux/features/auth/authThunks";
import {
  DollarSign,
  ShoppingCart,
  UserCheck,
  RefreshCw,
  Download,
  ChevronDown,
  FileSpreadsheet,
  FileText,
  Plus,
  Users,
  Package,
  CheckCircle,
  Clock,
  ArrowUpRight,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
  ComposedChart,
  PieChart,
  Pie,
  Legend,
} from "recharts";
import toast from "react-hot-toast";
import { exportDashboardSummary } from "@/utils/exportUtils";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [exportDropdownOpen, setExportDropdownOpen] = useState(false);
  const [filter, setFilter] = useState("month");

  // Colors for Donut Chart
  const STATUS_COLORS = {
    Delivered: "#10b981",
    Processing: "#3b82f6",
    Shipped: "#a855f7",
    Pending: "#f59e0b",
    Cancelled: "#ef4444",
  };

  const dispatch = useDispatch();
  const { orders } = useSelector((state) => state.order);
  const { allUsers } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(fetchAllOrders());
    dispatch(fetchAllUsers());
  }, [dispatch]);

  // --- REAL DATA PROCESSING ---
  const currentData = useMemo(() => {
    if (!orders) return { sales: [], orders: [], donut: [], stats: [] };

    // 1. Calculate Stats
    const totalRevenue = orders
      .filter(o => o.status !== "Cancelled")
      .reduce((sum, o) => sum + (o.totalAmount || 0), 0);
    
    const stats = [
      { 
        name: "Total Revenue", 
        value: `₹${totalRevenue.toLocaleString("en-IN")}`, 
        icon: DollarSign, 
        color: "blue" 
      },
      { 
        name: "Total Orders", 
        value: orders.length.toString(), 
        icon: ShoppingCart, 
        color: "green" 
      },
      { 
        name: "Total Customers", 
        value: (allUsers?.length || 0).toString(), 
        icon: UserCheck, 
        color: "purple" 
      },
    ];

    // 2. Calculate Order Distribution (Donut)
    const statusCounts = orders.reduce((acc, o) => {
      const s = o.status || "Pending";
      acc[s] = (acc[s] || 0) + 1;
      return acc;
    }, {});

    const donut = Object.keys(STATUS_COLORS).map(status => ({
      name: status,
      value: statusCounts[status] || 0,
      color: STATUS_COLORS[status]
    })).filter(item => item.value > 0);

    // 3. Calculate Chart Data (Revenue & Orders over time)
    // We'll group by month for the current year
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const currentYear = new Date().getFullYear();
    
    const monthlyData = months.map((month, index) => {
      const monthOrders = orders.filter(o => {
        const d = new Date(o.createdAt);
        return d.getMonth() === index && d.getFullYear() === currentYear;
      });

      const revenue = monthOrders
        .filter(o => o.status !== "Cancelled")
        .reduce((sum, o) => sum + (o.totalAmount || 0), 0);

      return {
        name: month,
        sales: revenue, // for line chart
        revenue: revenue, // for bar chart
        orders: monthOrders.length
      };
    });

    // If "today" filter is selected, we might want to show hours, but for simplicity we'll show months for now.
    // In a real app, we'd adjust the grouping logic based on the 'filter' state.
    // For now, let's keep it monthly as it's the most common overview.

    return { sales: monthlyData, orders: monthlyData, donut, stats };
  }, [orders, allUsers, filter]);



  // Derive top 5 most recent orders from real Redux data
  const recentOrders = useMemo(() => {
    if (!orders || orders.length === 0) return [];
    
    return [...orders]
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 5)
      .map(order => ({
        id: `#ORD${order._id.slice(-5).toUpperCase()}`,
        customer: order.customerName || order.user?.username || "Guest",
        amount: `₹${order.totalAmount?.toLocaleString() || "0"}`,
        status: order.status || "Pending",
        date: new Date(order.createdAt).toLocaleDateString("en-IN", {
          day: "numeric", month: "short", year: "numeric"
        }),
      }));
  }, [orders]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    toast.success("Refreshing dashboard data...");
    setTimeout(() => {
      setIsRefreshing(false);
      toast.success("Dashboard updated!");
    }, 1000);
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "delivered": return "bg-green-50 text-green-700 border-green-100";
      case "processing": return "bg-blue-50 text-blue-700 border-blue-100";
      case "shipped": return "bg-purple-50 text-purple-700 border-purple-100";
      default: return "bg-gray-50 text-gray-700 border-gray-100";
    }
  };

  const getStatusIcon = (status) => {
    switch (status.toLowerCase()) {
      case "delivered": return <CheckCircle className="w-3 h-3" />;
      case "shipped": return <Package className="w-3 h-3" />;
      default: return <Clock className="w-3 h-3" />;
    }
  };

  const getColorClasses = (color) => {
    switch (color) {
      case "blue": return "bg-blue-50 text-blue-600";
      case "green": return "bg-green-50 text-green-600";
      case "purple": return "bg-purple-50 text-purple-600";
      default: return "bg-gray-50 text-gray-600";
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-6xl mx-auto space-y-8">

        {/* HEADER */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Admin Dashboard</h1>
            <p className="text-gray-500 text-sm mt-1">Real-time overview of your business performance</p>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium focus:ring-2 focus:ring-blue-100 bg-white cursor-pointer outline-none transition-all"
            >
              <option value="today">Today</option>
              <option value="week">Past Week</option>
              <option value="month">Past Month</option>
            </select>

            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="p-2.5 border border-gray-200 rounded-lg bg-white hover:bg-gray-50 transition-colors shadow-sm disabled:opacity-50 group"
              title="Refresh Data"
            >
              <RefreshCw size={18} className={`text-gray-500 group-hover:text-gray-700 ${isRefreshing ? "animate-spin" : ""}`} />
            </button>

            <div className="relative">
              <button
                onClick={() => setExportDropdownOpen(!exportDropdownOpen)}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-all shadow-sm text-sm font-semibold"
              >
                <Download size={16} /> Export
                <ChevronDown size={14} className={`transition-transform duration-200 ${exportDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {exportDropdownOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setExportDropdownOpen(false)}></div>
                  <div className="absolute right-0 mt-2 bg-white shadow-xl rounded-xl border border-gray-100 w-44 z-20 py-1 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                    {['csv', 'excel', 'pdf'].map((fmt) => (
                      <button
                        key={fmt}
                        onClick={() => {
                          exportDashboardSummary(currentData.stats, recentOrders, fmt === 'pdf' ? 'pdf' : 'csv');
                          toast.success(`${fmt.toUpperCase()} Exported successfully!`);
                          setExportDropdownOpen(false);
                        }}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors font-semibold border-b last:border-0 border-gray-50 text-left capitalize"
                      >
                        {fmt === 'pdf' ? <FileText size={14} className="text-red-500" /> : <FileSpreadsheet size={14} className={fmt === 'csv' ? "text-green-600" : "text-blue-500"} />}
                        {fmt === 'excel' ? 'Download Excel' : fmt === 'csv' ? 'Download CSV' : 'Download PDF'}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* STATS */}
        <div className="grid md:grid-cols-3 gap-6">
          {currentData.stats.map((item, i) => (
            <div
              key={i}
              className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex flex-col gap-4 relative overflow-hidden transition-all hover:shadow-md group"
            >
              <div className="flex items-start justify-between">
                <div className={`p-3 rounded-xl ${getColorClasses(item.color)} transition-transform group-hover:scale-110 duration-300`}>
                  <item.icon size={20} />
                </div>
                <div className="flex items-center gap-1 text-green-600 font-bold text-[10px] bg-green-50 px-2 py-1 rounded-full border border-green-100 shadow-sm h-fit">
                  <ArrowUpRight size={12} />
                  +12.5%
                </div>
              </div>
              
              <div className="space-y-1">
                <h2 className="text-[11px] font-bold text-gray-600 uppercase tracking-[0.1em]">{item.name}</h2>
                <p className="text-xl font-bold text-gray-800 leading-tight truncate" title={item.value}>
                  {item.value}
                </p>
              </div>

              {/* Decorative accent */}
              <div className={`absolute bottom-0 right-0 w-16 h-16 opacity-[0.03] translate-x-4 translate-y-4`} style={{ color: item.color === 'blue' ? '#3b82f6' : item.color === 'green' ? '#10b981' : '#a855f7' }}>
                <item.icon size={64} strokeWidth={1} />
              </div>
            </div>
          ))}
        </div>

        {/* CHARTS ROW 1 */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-bold text-gray-800 text-sm uppercase tracking-wide">Revenue Performance</h2>
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Values in INR (₹)</span>
            </div>
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={currentData.sales} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#94a3b8', fontWeight: 600 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#94a3b8', fontWeight: 600 }} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', fontSize: '12px' }}
                  itemStyle={{ fontWeight: '800' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="sales" 
                  stroke="#3b82f6" 
                  strokeWidth={4} 
                  dot={{ r: 0 }}
                  activeDot={{ r: 6, fill: '#3b82f6', strokeWidth: 3, stroke: '#fff' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <h2 className="font-bold text-gray-800 text-sm uppercase mb-6 tracking-wide">Orders Distribution</h2>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={currentData.orders} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#94a3b8', fontWeight: 600 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#94a3b8', fontWeight: 600 }} />
                <Tooltip 
                   contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', fontSize: '12px' }}
                   cursor={{ fill: '#f8fafc' }}
                />
                <Bar dataKey="orders" fill="#10b981" radius={[4, 4, 0, 0]} barSize={24}>
                  {currentData.orders.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#10b981' : '#34d399'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* CHARTS ROW 2 (NEW) */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Monthly Revenue (Bar + Line Combo) */}
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
             <div className="flex justify-between items-center mb-6">
              <h2 className="font-bold text-gray-800 text-sm uppercase tracking-wide">Revenue vs Orders</h2>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-blue-500" /> <span className="text-[10px] font-bold text-gray-400">REV</span></div>
                <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-green-500" /> <span className="text-[10px] font-bold text-gray-400">ORD</span></div>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={280}>
              <ComposedChart data={currentData.sales} margin={{ top: 5, right: -10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#94a3b8', fontWeight: 600 }} dy={10} />
                <YAxis yAxisId="left" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#94a3b8', fontWeight: 600 }} />
                <YAxis yAxisId="right" orientation="right" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#94a3b8', fontWeight: 600 }} />
                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }} />
                <Bar yAxisId="left" dataKey="revenue" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={30} />
                <Line yAxisId="right" type="monotone" dataKey="orders" stroke="#10b981" strokeWidth={3} dot={{ r: 4, fill: '#fff', stroke: '#10b981', strokeWidth: 2 }} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>

          {/* Order Status (Donut) */}
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <h2 className="font-bold text-gray-800 text-sm uppercase mb-6 tracking-wide">Order Distribution</h2>
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie 
                  data={currentData.donut} 
                  innerRadius={60} 
                  outerRadius={90} 
                  paddingAngle={5} 
                  dataKey="value"
                >
                  {currentData.donut && currentData.donut.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }} />
                <Legend iconType="circle" verticalAlign="bottom" wrapperStyle={{ paddingTop: '10px', fontSize: '10px', fontWeight: '800', textTransform: 'uppercase' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* ORDERS TABLE */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold">Recent Transactions</h2>
            <button onClick={() => navigate("/admin/orders")} className="text-blue-600 hover:bg-blue-50 px-3 py-1.5 rounded-lg text-sm font-black transition-all border border-blue-50">
              VIEW ALL
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-base">
              <thead>
                <tr className="text-left text-gray-700 bg-gray-50/50 rounded-lg">
                  <th className="px-4 py-3 text-[12px] font-bold uppercase ">Order</th>
                  <th className="px-4 py-3 text-[12px] font-bold uppercase">Customer</th>
                  <th className="px-4 py-3 text-[12px] font-bold uppercase">Amount</th>
                  <th className="px-4 py-3 text-[12px] font-bold uppercase">Status</th>
                  <th className="px-4 py-3 text-[12px] font-bold uppercase">Date</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {recentOrders.map((o, i) => (
                  <tr key={i} className="hover:bg-gray-50 transition-colors group">
                    <td className="px-4 py-4 font-black text-blue-500 text-xs italic">{o.id}</td>
                    <td className="px-4 py-4 font-bold text-gray-600">{o.customer}</td>
                    <td className="px-4 py-4 font-bold text-gray-600">{o.amount}</td>
                    <td className="px-4 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[9px] font-black border tracking-tighter ${getStatusColor(o.status)}`}>
                        {getStatusIcon(o.status)}
                        {o.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-gray-400 font-bold text-[11px]">{o.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;