import { useState, useMemo } from "react";
import AdminSidebar from "../../components/admin/adminSidebar";
import AdminNavbar from "../../components/admin/adminNavbar";
import PublicationCard from "../../components/admin/PublicationCard";
import { mockPublications } from "../../data/mockPublications";

const TABS = [
  { key: "Pending Review", label: "Pending Review", badge: 47 },
  {
    key: "Need More Info",
    label: "Need More Info",
    description: "Rejected users can submit complaints here",
  },
  {
    key: "Company Offer",
    label: "Company Offer",
    description: "Items waiting for financial department review",
  },
  { key: "Approved", label: "Approved" },
  { key: "Rejected", label: "Rejected" },
  {
    key: "Flagged by AI",
    label: "Flagged by AI",
    description: "Potential spam; list is empty for now",
  },
];

const AdminPublicationReviews = () => {
  const [activeTab, setActiveTab] = useState("Pending Review");

  const filteredPublications = useMemo(() => {
    if (activeTab === "Flagged by AI") {
      // empty for now by requirement
      return [];
    }
    return mockPublications.filter((p) => p.status === activeTab);
  }, [activeTab]);

  return (
    <div className="min-h-screen bg-gray-100 flex">
        <AdminSidebar active="publication-reviews" />

      <div className="flex-1 flex flex-col">
        <AdminNavbar />

        <main className="flex-1 bg-gray-100 p-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
            {/* Title */}
            <h2 className="text-base font-semibold text-gray-900 mb-4">
              Publications Review
            </h2>

            {/* Tabs */}
            <div className="flex flex-wrap gap-3 bg-gray-50 rounded-xl p-2 mb-5">
              {TABS.map((tab) => {
                const isActive = activeTab === tab.key;

                return (
                  <button
                    key={tab.key}
                    type="button"
                    onClick={() => setActiveTab(tab.key)}
                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm border transition
                    ${
                      isActive
                        ? "bg-blue-500 text-white border-blue-500 shadow-sm"
                        : "bg-white text-gray-600 border-gray-200 hover:bg-gray-100"
                    }`}
                  >
                    <span>{tab.label}</span>
                    {tab.key === "Pending Review" && (
                      <span className="px-2 py-0.5 rounded-full text-xs bg-white/20 border border-white/40">
                        {tab.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Optional tab explanation */}
            {TABS.find((t) => t.key === activeTab)?.description && (
              <p className="mb-4 text-xs text-gray-500">
                {TABS.find((t) => t.key === activeTab)?.description}
              </p>
            )}

            {/* List of publications */}
            <div className="space-y-3">
              {filteredPublications.length === 0 ? (
                <div className="text-sm text-gray-400 py-8 text-center border border-dashed border-gray-200 rounded-xl">
                  No publications in this status yet.
                </div>
              ) : (
                filteredPublications.map((pub) => (
                  <PublicationCard key={pub.id} publication={pub} />
                ))
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminPublicationReviews;
