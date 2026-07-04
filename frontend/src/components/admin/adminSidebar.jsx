// src/components/admin/AdminSidebar.jsx
import { TbLayoutGrid } from "react-icons/tb";
import { FaRegUser } from "react-icons/fa";
import { HiOutlineMail } from "react-icons/hi";
import { MdLogout, MdOutlineSettings, MdOutlineSummarize } from "react-icons/md";
import { BiNews } from "react-icons/bi"; 
import { useNavigate } from "react-router-dom";
import api from "../../api/axios"; // adjust path to your axios instance

const AdminSidebar = ({ active = "dashboard" }) => {
  const navigate = useNavigate();

  const baseLink =
    "flex items-center gap-3 px-3 py-2 rounded-md text-lg text-gray-700 hover:bg-gray-100";
  const activeLink = baseLink + " font-bold text-gray-900";

  const handleLogout = async () => {
    try {
      await api.post("/logout"); // call backend logout
      localStorage.removeItem("token"); // remove token from localStorage
      navigate("/LoginPage"); // redirect to login page
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  return (
    <aside className="w-56 bg-white border-r border-gray-200 h-screen flex flex-col">
      {/* Logo / Brand */}
      <div className="px-6 py-4 text-2xl font-semibold text-gray-800">
        Raskala
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-4 space-y-4">
        <a
          href="/admindashboard"
          className={active === "dashboard" ? activeLink : baseLink}
        >
          <TbLayoutGrid className="text-2xl text-gray-700" />
          <span>Dashboard</span>
        </a>

        <a
          href="/AdminReviews"
          className={active === "publication-reviews" ? activeLink : baseLink}
        >
          <BiNews className="text-2xl text-gray-700" />
          <span>Publication Reviews</span>
        </a>

        <a
          href="/admin-users"
          className={active === "users" ? activeLink : baseLink}
        >
          <FaRegUser className="text-2xl text-gray-700" />
          <span>Users</span>
        </a>

        <a
          href="/admin-messages"
          className={active === "messages" ? activeLink : baseLink}
        >
          <HiOutlineMail className="text-2xl text-gray-700" />
          <span>Messages</span>
        </a>

        <a
          href="/admin-reports"
          className={active === "reports" ? activeLink : baseLink}
        >
          <MdOutlineSummarize className="text-2xl text-gray-700" />
          <span>Reports</span>
        </a>

        <a
          href="/AdminSettings"
          className={active === "settings" ? activeLink : baseLink}
        >
          <MdOutlineSettings className="text-2xl text-gray-700" />
          <span>Settings</span>
        </a>
      </nav>

      {/* Logout Button */}
      <button
        onClick={handleLogout}
        className="flex items-center gap-3 px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100 mt-auto mx-4"
      >
        <MdLogout className="text-2xl text-gray-700" />
        <span>Logout</span>
      </button>
    </aside>
  );
};

export default AdminSidebar;
