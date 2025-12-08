// src/pages/admin/adminTemplate.jsx
import AdminSidebar from "../../components/admin/adminSidebar";
import AdminNavbar from "../../components/admin/adminNavbar";

const AdminTemplate = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <AdminSidebar />

      {/* Main area */}
      <div className="flex-1 flex flex-col">
        {/* Top navbar */}
        <AdminNavbar />

        {/* Page content placeholder */}
        <main className="flex-1 bg-gray-100 p-6">

            {/* Remaaaaaaark */}
            
          {/* Put page-specific content here in the copies of this template */}

        </main>
      </div>
    </div>
  );
};

export default AdminTemplate;
