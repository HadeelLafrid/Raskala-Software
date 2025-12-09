// src/pages/admin/AdminSettings.jsx
import AdminSidebar from "../../components/admin/adminSidebar";
import AdminNavbar from "../../components/admin/adminNavbar";
import { useState } from "react";

const AdminSettings = () => {
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(false);

  return (
    <div className="min-h-screen bg-gray-100 flex">
      <AdminSidebar active="settings" />

      <div className="flex-1 flex flex-col">
        <AdminNavbar />

        <main className="flex-1 bg-gray-100 p-6">
          <div className="max-w-4xl space-y-6">
            {/* Account settings */}
            <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-base font-semibold text-gray-900 mb-4">
                Account Settings
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Full name
                  </label>
                  <input
                    type="text"
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Admin Name"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Email address
                  </label>
                  <input
                    type="email"
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="admin@example.com"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Phone number
                  </label>
                  <input
                    type="text"
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="+213 ..."
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Language
                  </label>
                  <select className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option>English</option>
                    <option>French</option>
                    <option>Arabic</option>
                  </select>
                </div>
              </div>

              <div className="mt-4 flex justify-end gap-2">
                <button className="px-4 py-2 text-sm rounded-lg border border-gray-200 text-gray-700 bg-white hover:bg-gray-50">
                  Cancel
                </button>
                <button className="px-4 py-2 text-sm rounded-lg bg-blue-600 text-white hover:bg-blue-700">
                  Save changes
                </button>
              </div>
            </section>

            {/* Security */}
            <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-base font-semibold text-gray-900 mb-4">
                Security
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Current password
                  </label>
                  <input
                    type="password"
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    New password
                  </label>
                  <input
                    type="password"
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Confirm password
                  </label>
                  <input
                    type="password"
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="mt-4 flex justify-end">
                <button className="px-4 py-2 text-sm rounded-lg bg-blue-600 text-white hover:bg-blue-700">
                  Update password
                </button>
              </div>
            </section>

            {/* Notifications */}
            <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-base font-semibold text-gray-900 mb-4">
                Notifications
              </h2>

              <div className="space-y-3 text-sm text-gray-700">
                <label className="flex items-center justify-between gap-4">
                  <span>
                    Email notifications
                    <span className="block text-xs text-gray-400">
                      Receive an email when a publication needs review or when
                      status changes.
                    </span>
                  </span>
                  <button
                    type="button"
                    onClick={() => setEmailNotifications((v) => !v)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      emailNotifications ? "bg-blue-500" : "bg-gray-300"
                    }`}
                  >
                    <span
                      className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${
                        emailNotifications ? "translate-x-5" : "translate-x-1"
                      }`}
                    />
                  </button>
                </label>

                <label className="flex items-center justify-between gap-4">
                  <span>
                    SMS notifications
                    <span className="block text-xs text-gray-400">
                      Receive SMS alerts for critical account events.
                    </span>
                  </span>
                  <button
                    type="button"
                    onClick={() => setSmsNotifications((v) => !v)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      smsNotifications ? "bg-blue-500" : "bg-gray-300"
                    }`}
                  >
                    <span
                      className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${
                        smsNotifications ? "translate-x-5" : "translate-x-1"
                      }`}
                    />
                  </button>
                </label>
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminSettings;
