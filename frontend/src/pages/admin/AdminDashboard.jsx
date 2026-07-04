import { useState, useEffect } from 'react';
import AdminSidebar from "../../components/admin/adminSidebar";
import AdminNavbar from "../../components/admin/adminNavbar";
import { Users, List, CheckSquare, Clock } from "lucide-react";
import { COLORS } from "../../constants/colors";
import api from "../../api/axios";

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    total_users: 0,
    total_products: 0,
    approved_products: 0,
    pending_products: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      const response = await api.get('/admin/dashboard-stats');
      
      if (response.data.success) {
        setStats(response.data.data);
      }
    } catch (err) {
      console.error('Error fetching dashboard stats:', err);
      setError('Failed to load dashboard statistics');
    } finally {
      setLoading(false);
    }
  };

  const formatNumber = (num) => {
    return num.toLocaleString();
  };

  const statsCards = [
    {
      title: "Members",
      count: formatNumber(stats.total_users),
      icon: <Users className="w-32 h-32 text-white" />,
      bgColor: COLORS.primary.lime,
      textColor: "text-gray-800",
    },
    {
      title: "Publications",
      count: formatNumber(stats.total_products),
      icon: <List className="w-32 h-32 text-white" />,
      bgColor: COLORS.primary.yellow,
      textColor: "text-gray-800",
    },
    {
      title: "Approved",
      count: formatNumber(stats.approved_products),
      icon: <CheckSquare className="w-32 h-32 text-white" />,
      bgColor: COLORS.primary.pink,
      textColor: "text-gray-800",
    },
    {
      title: "Pending",
      count: formatNumber(stats.pending_products),
      icon: <Clock className="w-32 h-32 text-white" />,
      bgColor: COLORS.primary.blue,
      textColor: "text-gray-800",
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex">
        <AdminSidebar />
        <div className="flex-1 flex flex-col">
          <AdminNavbar />
          <main className="flex-1 bg-white p-6 flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading dashboard statistics...</p>
            </div>
          </main>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white flex">
        <AdminSidebar />
        <div className="flex-1 flex flex-col">
          <AdminNavbar />
          <main className="flex-1 bg-white p-6 flex items-center justify-center">
            <div className="text-center">
              <p className="text-red-600 mb-4">{error}</p>
              <button
                onClick={fetchDashboardStats}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Retry
              </button>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex">
      {/* Sidebar */}
      <AdminSidebar />

      {/* Main area */}
      <div className="flex-1 flex flex-col">
        {/* Top navbar */}
        <AdminNavbar />

        {/* Page content */}
        <main className="flex-1 bg-white p-6">
          <div className="mb-6 flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>
            <button
              onClick={fetchDashboardStats}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Refresh
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {statsCards.map((stat, index) => (
              <div
                key={index}
                style={{ backgroundColor: stat.bgColor }}
                className="rounded-xl p-4 shadow-sm flex flex-col justify-between aspect-square relative overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="z-10 relative">
                  <h3
                    className={`text-3xl font-medium ${stat.textColor} opacity-80`}
                  >
                    {stat.title}
                  </h3>
                  <p
                    className={`text-6xl font-bold ${stat.textColor} mt-4`}
                  >
                    {stat.count}
                  </p>
                </div>
                <div className="absolute bottom-3 right-3 bg-white/20 p-2 rounded-lg backdrop-blur-sm">
                  {stat.icon}
                </div>
              </div>
            ))}
          </div>

          {/* Additional Stats Summary */}
          <div className="mt-8 bg-gray-50 rounded-xl p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Summary</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white p-4 rounded-lg">
                <p className="text-sm text-gray-600">Approval Rate</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.total_products > 0 
                    ? Math.round((stats.approved_products / stats.total_products) * 100)
                    : 0}%
                </p>
              </div>
              <div className="bg-white p-4 rounded-lg">
                <p className="text-sm text-gray-600">Pending Rate</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.total_products > 0 
                    ? Math.round((stats.pending_products / stats.total_products) * 100)
                    : 0}%
                </p>
              </div>
              <div className="bg-white p-4 rounded-lg">
                <p className="text-sm text-gray-600">Avg Products/User</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.total_users > 0 
                    ? (stats.total_products / stats.total_users).toFixed(1)
                    : 0}
                </p>
              </div>
              <div className="bg-white p-4 rounded-lg">
                <p className="text-sm text-gray-600">Active Listings</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatNumber(stats.approved_products)}
                </p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;