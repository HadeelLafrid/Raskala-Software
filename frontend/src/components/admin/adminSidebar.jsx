// src/components/admin/AdminSidebar.jsx
import { TbLayoutGrid } from "react-icons/tb";
import { FaRegUser } from "react-icons/fa";
import { HiOutlineMail } from "react-icons/hi";
import { MdLogout } from "react-icons/md";

const AdminSidebar = () => {
  return (
    <aside className="w-56 bg-white border-r border-gray-200 h-screen flex flex-col">
      <div className="px-6 py-4 text-2xl font-semibold text-gray-800">
        Raskala
      </div>

      <nav className="flex-1 px-4 space-y-4 text-lg">
        <a
          href="#"
          className="flex items-center gap-3 px-3 py-2 rounded-md bg-gray-100 font-semibold text-gray-900"
        >
          <TbLayoutGrid className="text-2xl text-gray-700" />
          <span>Dashboard</span>
        </a>

        <a
          href="#"
          className="block px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100"
        >
          publication reviews
        </a>

        <a
          href="#"
          className="flex items-center gap-3 px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100"
        >
          <FaRegUser className="text-2xl text-gray-700" />
          <span>Users</span>
        </a>

        <a
          href="#"
          className="flex items-center gap-3 px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100"
        >
          <HiOutlineMail className="text-2xl text-gray-700" />
          <span>Messages</span>
        </a>

        <a
          href="#"
          className="block px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100"
        >
          Reports
        </a>

        <a
          href="#"
          className="block px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100"
        >
          Settings
        </a>
      </nav>

      <button
  type="button"
  className="mt-auto flex items-center gap-3 px-4 py-3 text-lg text-gray-500 hover:bg-gray-100"
>
  <span>Log Out</span>
  <MdLogout className="text-2xl text-gray-700" />
</button>

    </aside>
  );
};

export default AdminSidebar;
