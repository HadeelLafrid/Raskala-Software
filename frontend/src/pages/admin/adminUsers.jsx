// src/pages/admin/AdminUsers.jsx
// import { useState, useMemo, useEffect } from "react";
import { useState,  useEffect } from "react";
import AdminSidebar from "../../components/admin/adminSidebar";
import AdminNavbar from "../../components/admin/adminNavbar";
import { HiOutlineMail, HiOutlineDotsVertical } from "react-icons/hi";
import { FiPhone } from "react-icons/fi";
import api from "../../api/axios"; //Import axios

const AdminUsers = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [statusFilter, setStatusFilter] = useState("All");
  const [searchTerm, setSearchTerm] = useState(""); //Add search state
  const [users, setUsers] = useState([]); //  Real users from API
  const [pagination, setPagination] = useState({}); // Pagination info
  const [loading, setLoading] = useState(true); //  Loading state

  //  Fetch users from API
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await api.get("/admin/users", {
        params: {
          page: currentPage,
          per_page: pageSize,
          search: searchTerm,
          status: statusFilter === "All" ? "" : statusFilter.toLowerCase(),
        },
      });

      if (response.data.success) {
        setUsers(response.data.users);
        setPagination(response.data.pagination);
      }
    } catch (error) {
      console.error("Failed to fetch users:", error);
      if (error.response?.status === 403) {
        alert("You don't have permission to view users.");
      } else {
        alert("Failed to load users. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  // Fetch users when page/filters change
  useEffect(() => {
    fetchUsers();
  }, [currentPage, pageSize, statusFilter]);

  //  Debounced search (wait 500ms after user stops typing)
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      setCurrentPage(1); // Reset to page 1 when searching
      fetchUsers();
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [searchTerm]);

  //Helper functions
  const getInitials = (name) => {
    if (!name) return "??";
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  const getStatusBadge = (isActive) => {
    return isActive
      ? "bg-green-100 text-green-700"
      : "bg-gray-100 text-gray-700";
  };

  const getStatusText = (isActive) => {
    return isActive ? "Active" : "Inactive";
  };

  //  Calculate total pages from API pagination
  const totalPages = pagination.last_page || 1;
  const totalItems = pagination.total || 0;

  const handlePrev = () => {
    setCurrentPage((p) => Math.max(p - 1, 1));
  };

  const handleNext = () => {
    setCurrentPage((p) => Math.min(p + 1, totalPages));
  };

  const handlePageSizeChange = (e) => {
    setPageSize(Number(e.target.value));
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">
      <AdminSidebar active="users" />

      <div className="flex-1 flex flex-col">
        <AdminNavbar />

        <main className="flex-1 bg-gray-100 p-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col h-[540px]">
            {/* Top controls */}
            <div className="px-6 py-4 flex flex-col gap-4 md:flex-row md:items-center md:justify-between border-b border-gray-100">
              <h2 className="text-base font-semibold text-gray-800">
                All Customers
              </h2>

              <div className="flex flex-1 gap-3 md:justify-end">
                {/* Search input */}
                <div className="relative flex-1 max-w-xs">
                  <input
                    type="text"
                    placeholder="Search..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full rounded-lg border border-gray-200 pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-300"
                  />
                  <span className="absolute left-3 top-2.5 text-gray-400 text-sm">
                    🔍
                  </span>
                </div>

                {/* Status filter */}
                <select
                  className="rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-600 bg-white"
                  value={statusFilter}
                  onChange={(e) => {
                    setStatusFilter(e.target.value);
                    setCurrentPage(1);
                  }}
                >
                  <option value="All">All status</option>
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
            </div>

            {/* Scrollable table area */}
            <div className="flex-1 overflow-y-auto px-4">
              {loading ? (
                <div className="flex items-center justify-center h-64">
                  <div className="text-gray-500">Loading users...</div>
                </div>
              ) : (
                <table className="w-full text-sm text-left">
                  <thead className="text-xs uppercase text-gray-400 border-b">
                    <tr>
                      <th className="py-3 px-2">user</th>
                      <th className="py-3 px-2">Contact</th>
                      <th className="py-3 px-2">Role</th>
                      <th className="py-3 px-2">Status</th>
                      <th className="py-3 px-2">User ID</th>
                      <th className="py-3 px-2 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.length === 0 ? (
                      <tr>
                        <td
                          colSpan="6"
                          className="py-8 text-center text-gray-500"
                        >
                          No users found
                        </td>
                      </tr>
                    ) : (
                      users.map((user) => (
                        <tr
                          key={user.user_id}
                          className="border-b last:border-b-0 hover:bg-gray-50"
                        >
                          {/* User column */}
                          <td className="py-4 px-2">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center text-sm font-semibold">
                                {getInitials(user.name)}
                              </div>
                              <div>
                                <div className="font-semibold text-gray-900">
                                  {user.name}
                                </div>
                                <div className="text-xs text-gray-400">
                                  Joined {formatDate(user.created_at)}
                                </div>
                              </div>
                            </div>
                          </td>

                          {/* Contact */}
                          <td className="py-4 px-2 text-gray-600">
                            <div className="flex items-center gap-2">
                              <HiOutlineMail className="text-gray-500" />
                              <span className="text-xs">{user.email}</span>
                            </div>
                            {user.phone && (
                              <div className="flex items-center gap-2 text-xs mt-1">
                                <FiPhone className="text-gray-500" />
                                <span>{user.phone}</span>
                              </div>
                            )}
                          </td>

                          {/* Role */}
                          <td className="py-4 px-2">
                            <span
                              className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${
                                user.role === "admin"
                                  ? "bg-purple-100 text-purple-700"
                                  : "bg-blue-100 text-blue-700"
                              }`}
                            >
                              {user.role}
                            </span>
                          </td>

                          {/* Status */}
                          <td className="py-4 px-2">
                            <span
                              className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${getStatusBadge(
                                user.is_active
                              )}`}
                            >
                              {getStatusText(user.is_active)}
                            </span>
                          </td>

                          {/* User ID (shortened) */}
                          <td className="py-4 px-2 text-gray-600 text-xs font-mono">
                            {user.user_id.substring(0, 8)}...
                          </td>

                          {/* Actions */}
                          <td className="py-4 px-2 text-right">
                            <button className="p-2 rounded-full hover:bg-gray-100 text-gray-500">
                              <HiOutlineDotsVertical />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              )}
            </div>

            {/* Footer / pagination */}
            <div className="mt-4 px-4 py-3 flex flex-col gap-3 md:flex-row md:items-center md:justify-between text-xs text-gray-500 border-t border-gray-100">
              <span>
                Showing {pagination.from || 0}-{pagination.to || 0} of{" "}
                {totalItems} results
              </span>

              <div className="flex items-center gap-2">
                <button
                  className="px-3 py-1 rounded-lg border border-gray-200 bg-white disabled:opacity-50"
                  onClick={handlePrev}
                  disabled={currentPage === 1 || loading}
                >
                  Previous
                </button>

                {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
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
                      onClick={() => setCurrentPage(pageNum)}
                      className={`px-3 py-1 rounded-lg border ${
                        pageNum === currentPage
                          ? "bg-blue-500 text-white border-blue-500"
                          : "bg-white text-gray-700 border-gray-200"
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}

                <button
                  className="px-3 py-1 rounded-lg border border-gray-200 bg-white disabled:opacity-50"
                  onClick={handleNext}
                  disabled={currentPage === totalPages || totalPages === 0 || loading}
                >
                  Next
                </button>

                <select
                  className="ml-2 rounded-lg border border-gray-200 px-2 py-1 bg-white"
                  value={pageSize}
                  onChange={handlePageSizeChange}
                >
                  <option value={5}>5 per page</option>
                  <option value={10}>10 per page</option>
                  <option value={20}>20 per page</option>
                  <option value={50}>50 per page</option>
                </select>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminUsers;