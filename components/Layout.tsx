import React from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { LayoutDashboard, Mail, PenTool, BookOpen, Settings, Menu, X } from 'lucide-react';

const SidebarItem = ({ to, icon: Icon, label }: { to: string, icon: any, label: string }) => {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
          isActive
            ? 'bg-slate-800 text-white'
            : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
        }`
      }
    >
      <Icon size={18} />
      <span>{label}</span>
    </NavLink>
  );
};

export const Layout: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const location = useLocation();

  React.useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-slate-50">
      {/* Mobile Header */}
      <div className="md:hidden bg-slate-900 text-white p-4 flex justify-between items-center z-20">
        <h1 className="font-bold text-lg tracking-tight">CELPIP Coach</h1>
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          {isMobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-10 w-64 bg-slate-900 text-white transform transition-transform duration-200 ease-in-out md:relative md:translate-x-0 ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-6 border-b border-slate-800">
          <h1 className="font-bold text-xl tracking-tight">CELPIP Coach</h1>
          <p className="text-xs text-slate-500 mt-1">Writing Mastery MVP</p>
        </div>
        <nav className="p-4 space-y-1">
          <SidebarItem to="/" icon={LayoutDashboard} label="Dashboard" />
          <SidebarItem to="/task-1" icon={Mail} label="Task 1 — Email" />
          <SidebarItem to="/task-2" icon={PenTool} label="Task 2 — Survey" />
          <SidebarItem to="/library" icon={BookOpen} label="Biblioteca" />
          <SidebarItem to="/settings" icon={Settings} label="Configurações" />
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto h-screen">
        <div className="p-4 md:p-8 max-w-[1600px] mx-auto">
          <Outlet />
        </div>
      </main>

      {/* Overlay for mobile */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-0 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </div>
  );
};