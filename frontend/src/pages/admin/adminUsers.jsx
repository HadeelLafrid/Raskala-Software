// src/pages/admin/AdminUsers.jsx
import { useState, useMemo } from "react";
import AdminSidebar from "../../components/admin/adminSidebar";
import AdminNavbar from "../../components/admin/adminNavbar";
import { mockUsers } from "../../data/mockUsers";
import { HiOutlineMail, HiOutlineDotsVertical } from "react-icons/hi";
import { FiPhone } from "react-icons/fi";

const AdminUsers = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [statusFilter, setStatusFilter] = useState("All");

  // 1) filter by status
  const filteredUsers = useMemo(() => {
    if (statusFilter === "All") return mockUsers;
    return mockUsers.filter((u) => u.status === statusFilter);
  }, [statusFilter]);

  // 2) pagination numbers based on filtered users
  const totalItems = filteredUsers.length;
  const totalPages = Math.ceil(totalItems / pageSize);

  // 3) slice current page data
  const currentPageUsers = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return filteredUsers.slice(startIndex, endIndex);
  }, [filteredUsers, currentPage, pageSize]);

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
      <AdminSidebar />

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
                {/* Search input (static for now) */}
                <div className="relative flex-1 max-w-xs">
                  <input
                    type="text"
                    placeholder="Search..."
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
                  <option value="Verified">Verified</option>
                  <option value="Blocked">Blocked</option>
                </select>
              </div>
            </div>

            {/* Scrollable table area */}
            <div className="flex-1 overflow-y-auto px-4">
              <table className="w-full text-sm text-left">
                <thead className="text-xs uppercase text-gray-400 border-b">
                  <tr>
                    <th className="py-3 px-2">user</th>
                    <th className="py-3 px-2">Contact</th>
                    <th className="py-3 px-2">Publications</th>
                    <th className="py-3 px-2">Status</th>
                    <th className="py-3 px-2">Reports</th>
                    <th className="py-3 px-2 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {currentPageUsers.map((user) => (
                    <tr
                      key={user.id}
                      className="border-b last:border-b-0 hover:bg-gray-50"
                    >
                      {/* User column */}
                      <td className="py-4 px-2">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center text-sm font-semibold">
                            {user.initials}
                          </div>
                          <div>
                            <div className="font-semibold text-gray-900">
                              {user.firstName} {user.lastName}
                            </div>
                            <div className="text-xs text-gray-400">
                              Joined {user.joined}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Contact */}
                      <td className="py-4 px-2 text-gray-600">
                        <div className="flex items-center gap-2">
                          <HiOutlineMail className="text-gray-500" />
                          <span>{user.email}</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs mt-1">
                          <FiPhone className="text-gray-500" />
                          <span>{user.phone}</span>
                        </div>
                      </td>

                      {/* Publications */}
                      <td className="py-4 px-2 text-gray-800">
                        {user.publications}
                      </td>

                      {/* Status */}
                      <td className="py-4 px-2">
                        <span
                          className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${
                            user.status === "Verified"
                              ? "bg-green-100 text-green-700"
                              : user.status === "Blocked"
                              ? "bg-red-100 text-red-700"
                              : "bg-gray-100 text-gray-700"
                          }`}
                        >
                          {user.status}
                        </span>
                      </td>

                      {/* Reports */}
                      <td className="py-4 px-2">
                        <span
                          className={`text-sm font-medium ${
                            user.reports > 0 ? "text-red-500" : "text-gray-700"
                          }`}
                        >
                          {user.reports}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-2 text-right">
                        <button className="p-2 rounded-full hover:bg-gray-100 text-gray-500">
                          <HiOutlineDotsVertical />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Footer / pagination */}
            <div className="mt-4 px-4 py-3 flex flex-col gap-3 md:flex-row md:items-center md:justify-between text-xs text-gray-500 border-t border-gray-100">
              <span>
                Showing {(currentPage - 1) * pageSize + 1}-
                {Math.min(currentPage * pageSize, totalItems)} of {totalItems}{" "}
                results
              </span>

              <div className="flex items-center gap-2">
                <button
                  className="px-3 py-1 rounded-lg border border-gray-200 bg-white disabled:opacity-50"
                  onClick={handlePrev}
                  disabled={currentPage === 1}
                >
                  Previous
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`px-3 py-1 rounded-lg border ${
                        page === currentPage
                          ? "bg-blue-500 text-white border-blue-500"
                          : "bg-white text-gray-700 border-gray-200"
                      }`}
                    >
                      {page}
                    </button>
                  )
                )}

                <button
                  className="px-3 py-1 rounded-lg border border-gray-200 bg-white disabled:opacity-50"
                  onClick={handleNext}
                  disabled={currentPage === totalPages || totalPages === 0}
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
