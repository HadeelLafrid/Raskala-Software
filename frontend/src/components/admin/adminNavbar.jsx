// src/components/admin/AdminNavbar.jsx
const AdminNavbar = () => {
    return (
      <header className="h-16 border-b border-gray-200 bg-white flex items-center justify-between px-6">
        <h1 className="text-lg font-semibold text-gray-800">Hello Admin.</h1>
  
        <div className="w-10 h-10 rounded-full overflow-hidden border border-gray-300">
          {/* Replace src with real avatar later */}
          <img
            src="https://via.placeholder.com/80x80"
            alt="Admin avatar"
            className="w-full h-full object-cover"
          />
        </div>
      </header>
    );
  };
  
  export default AdminNavbar;
  