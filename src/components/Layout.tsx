import { Link, useNavigate, useLocation } from "react-router-dom";
import { LogOut, FileText, Calendar, Tag } from "lucide-react";
import { useAuth } from "../hooks/useAuth";

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const isActive = (path: string) => location.pathname.startsWith(path);

  const navLinks = [
    { path: "/", label: "Dashboard", icon: FileText },
    { path: "/notes", label: "Notes", icon: FileText },
    { path: "/events", label: "Events", icon: Calendar },
    { path: "/tags", label: "Tags", icon: Tag },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <nav className="flex items-center gap-6">
              <div className="flex items-center gap-3 mr-6">
                <img src="/logo.png" alt="Logo" className="h-12" />
                <h1 className="text-xl font-bold text-blue-700">APOLONOTES</h1>
              </div>
              {navLinks.map((link) => {
                const Icon = link.icon;
                const active =
                  link.path === "/"
                    ? location.pathname === "/"
                    : isActive(link.path);
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                      active
                        ? "bg-blue-50 text-blue-700 font-medium"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{link.label}</span>
                  </Link>
                );
              })}
            </nav>

            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <LogOut className="w-5 h-5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>

      <footer className="bg-white border-t border-gray-200 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-gray-600 text-sm">
            Notes & Events Manager
          </p>
        </div>
      </footer>
    </div>
  );
};
