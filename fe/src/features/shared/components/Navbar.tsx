import { useState } from "react";
import { useAuth } from "../../auth/hooks/useAuth";
import { Link } from "react-router-dom";

const Navbar = ({ onToggleSidebar, notifications = [] }) => {
  const { user, loading, logout } = useAuth();

  const [showUserMenu, setShowUserMenu] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;
  console.log("USER:", user);

  return (
    <nav className="bg-white border-b fixed top-0 left-0 right-0 z-50 h-16">
      <div className="px-4 h-full flex items-center justify-between">

        {/* LEFT */}
        <div className="flex items-center gap-4">
          <button
            onClick={onToggleSidebar}
            className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
          >
            ☰
          </button>

          <div className="flex items-center gap-2">
            <span className="text-2xl">📋</span>
            <h1 className="text-xl font-bold hidden sm:block">TaskBoard</h1>
          </div>
        </div>

        {/* RIGHT */}
        <div className="flex items-center gap-6">

          {/* 🔔 Notifications */}
          <div className="relative">
            <button className="p-1 hover:bg-gray-100 rounded-lg relative">
              🔔
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>
          </div>
          {user&&(
            <span className="hidden sm:block text-gray-800 font-medium">Xin chào,&nbsp;
                <span className="text-blue-500">{user.username}</span>
            </span>
          )}

          {/* 👤 User / Auth */}
          {user ? (
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(v => !v)}
                className="flex items-center gap-2 p-1 hover:bg-gray-100 rounded-lg"
              >
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white">
                  {loading ? "…" : user.username?.charAt(0).toUpperCase()|| "1"}
                </div>
              </button>
              
              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-md">
                  <Link
                    to="/profile/1"
                    className="block px-4 py-2 hover:bg-gray-100"
                  >
                    Hồ sơ
                  </Link>
                  <button
                    onClick={logout}
                    className="w-full text-left px-4 py-2 text-red-500 hover:bg-red-50"
                  >
                    Đăng xuất
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link
                to="/auth"
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                Đăng nhập
              </Link>
              <Link
                to="/auth"
                className="px-4 py-2 border border-blue-500 text-blue-500 rounded-lg hover:bg-blue-50"
              >
                Đăng ký
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
