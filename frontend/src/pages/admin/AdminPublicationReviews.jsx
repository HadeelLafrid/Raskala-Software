import { useState, useEffect } from "react";
import AdminSidebar from "../../components/admin/adminSidebar";
import AdminNavbar from "../../components/admin/adminNavbar";
import PublicationCard from "../../components/admin/PublicationCard";
import api from "../../api/axios"; //  Import axios

const TABS = [
  { key: "pending", label: "Pending Review", badge: 0 }, // ✅ Changed to lowercase to match backend
  {
    key: "need_more_info",
    label: "Need More Info",
    description: "Rejected users can submit complaints here",
  },
  {
    key: "company_offer",
    label: "Company Offer",
    description: "Items waiting for financial department review",
  },
  { key: "approved", label: "Approved" },
  { key: "rejected", label: "Rejected" },
  {
    key: "flagged",
    label: "Flagged by AI",
    description: "Potential spam; list is empty for now",
  },
];

const AdminPublicationReviews = () => {
  const [activeTab, setActiveTab] = useState("pending"); // ✅ Changed to lowercase
  const [publications, setPublications] = useState([]); // ✅ Real publications from API
  const [stats, setStats] = useState({}); // ✅ Product statistics
  const [loading, setLoading] = useState(true); // ✅ Loading state
  const [perPage] = useState(10); // ✅ Items per page

  // ✅ Fetch product statistics
  const fetchStats = async () => {
    try {
      const response = await api.get("/admin/products/stats");
      if (response.data.success) {
        setStats(response.data.stats);
        
        // Update badge count for "Pending Review"
        const pendingTab = TABS.find(t => t.key === "pending");
        if (pendingTab) {
          pendingTab.badge = response.data.stats.pending_review || 0;
        }
      }
    } catch (error) {
      console.error("Failed to fetch stats:", error);
    }
  };

  // ✅ Fetch publications from API
  const fetchPublications = async () => {
    setLoading(true);
    try {
      const response = await api.get("/admin/products", {
        params: {
          status: activeTab, // Send current tab as status filter
          per_page: perPage,
        },
      });

      if (response.data.success) {
        // ✅ Transform API data to match your card component format
        const transformedPublications = response.data.products.map((product) => ({
          id: product.product_id,
          title: product.title,
          price: `${product.price} DA`, // Format price with currency
          category: product.category.name,
          seller: product.user.name,
          postedAgo: formatDate(product.created_at),
          urgency: getUrgencyLabel(product.condition), // Map condition to urgency
          imageUrl: product.image || "https://via.placeholder.com/150", // Use first image or placeholder
          status: product.status,
          description: product.description,
          likes: product.likes,
          rawData: product, // Keep original data for actions
        }));

        setPublications(transformedPublications);
      }
    } catch (error) {
      console.error("Failed to fetch publications:", error);
      if (error.response?.status === 403) {
        alert("You don't have permission to view publications.");
      } else {
        alert("Failed to load publications. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  // ✅ Helper: Format date to "X time ago"
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);

    if (diffInSeconds < 60) return `${diffInSeconds}s ago`;
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)}d ago`;
    
    return date.toLocaleDateString();
  };

  // ✅ Helper: Map condition number to urgency label
  const getUrgencyLabel = (condition) => {
    const labels = {
      1: "Low",
      2: "Medium",
      3: "High",
      4: "Urgent",
    };
    return labels[condition] || "Normal";
  };

  // ✅ Handle approve action
  const handleApprove = async (publicationId) => {
    try {
      const response = await api.patch(`/admin/products/${publicationId}/status`, {
        status: "approved",
      });

      if (response.data.success) {
        alert("Publication approved successfully!");
        fetchPublications(); // Refresh list
        fetchStats(); // Update stats
      }
    } catch (error) {
      console.error("Failed to approve:", error);
      alert("Failed to approve publication. Please try again.");
    }
  };

  // ✅ Handle reject action
  const handleReject = async (publicationId) => {
    try {
      const response = await api.patch(`/admin/products/${publicationId}/status`, {
        status: "rejected",
      });

      if (response.data.success) {
        alert("Publication rejected successfully!");
        fetchPublications(); // Refresh list
        fetchStats(); // Update stats
      }
    } catch (error) {
      console.error("Failed to reject:", error);
      alert("Failed to reject publication. Please try again.");
    }
  };

  // ✅ Handle buy action (placeholder for now)
  const handleBuy = (publicationId) => {
    console.log("Buy clicked for publication:", publicationId);
    alert("Buy feature coming soon!");
  };

  // ✅ Fetch publications when tab changes
  useEffect(() => {
    fetchPublications();
  }, [activeTab]);

  // ✅ Fetch stats on component mount
  useEffect(() => {
    fetchStats();
  }, []);

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
                    {tab.key === "pending" && stats.pending_review > 0 && (
                      <span className="px-2 py-0.5 rounded-full text-xs bg-white/20 border border-white/40">
                        {stats.pending_review}
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

            {/* Loading state */}
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-gray-500">Loading publications...</div>
              </div>
            ) : (
              /* List of publications */
              <div className="space-y-3">
                {publications.length === 0 ? (
                  <div className="text-sm text-gray-400 py-8 text-center border border-dashed border-gray-200 rounded-xl">
                    No publications in this status yet.
                  </div>
                ) : (
                  publications.map((pub) => (
                    <PublicationCard
                      key={pub.id}
                      publication={pub}
                      onApprove={handleApprove}
                      onReject={handleReject}
                      onBuy={handleBuy}
                    />
                  ))
                )}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminPublicationReviews;