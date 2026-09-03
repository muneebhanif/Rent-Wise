import { useState, createContext, useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Users, 
  List, 
  FileText, 
  Settings, 
  X, 
  Menu, 
  ChevronRight, 
  ChevronLeft, 
  LogOut 
} from 'lucide-react';

// Create context for sidebar state
const SidebarContext = createContext();

// Provider component for sidebar state
const SidebarProvider = ({ children }) => {
  const [expanded, setExpanded] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);

  const toggleSidebar = () => {
    setExpanded(!expanded);
  };

  const toggleMobileSidebar = () => {
    setMobileOpen(!mobileOpen);
  };

  const closeMobileSidebar = () => {
    setMobileOpen(false);
  };

  return (
    <SidebarContext.Provider 
      value={{ 
        expanded, 
        mobileOpen, 
        toggleSidebar, 
        toggleMobileSidebar, 
        closeMobileSidebar 
      }}
    >
      {children}
    </SidebarContext.Provider>
  );
};

// Custom hook to use sidebar context
const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error('useSidebar must be used within a SidebarProvider');
  }
  return context;
};

// Logo and header component
const SidebarHeader = ({ expanded }) => {
  return (
    <div className={`p-6 ${expanded ? 'justify-start' : 'justify-center'} flex items-center`}>
      <img 
        src="/logo.svg" 
        alt="RentWise" 
        className={`h-8 ${expanded ? 'mr-3' : 'mx-auto'}`} 
      />
      {expanded && <span className="text-xl font-bold">RentWise</span>}
    </div>
  );
};

// Navigation menu component
const SidebarMenu = ({ children }) => {
  const { expanded } = useSidebar();
  
  return (
    <nav className="mt-8 px-4">
      <ul className="space-y-2">
        {children}
      </ul>
    </nav>
  );
};

// Individual menu item component
const SidebarMenuItem = ({ icon, title, to, isActive }) => {
  const { expanded, closeMobileSidebar } = useSidebar();
  
  return (
    <li>
      <Link
        to={to}
        className={`flex items-center p-3 rounded-lg transition-colors ${
          isActive
            ? 'bg-orange-100 text-orange-600'
            : 'text-gray-600 hover:bg-gray-100'
        } ${expanded ? 'justify-start' : 'justify-center'}`}
        onClick={closeMobileSidebar}
      >
        <span className="flex-shrink-0">{icon}</span>
        {expanded && <span className="ml-3">{title}</span>}
      </Link>
    </li>
  );
};

// Toggle button component
const SidebarMenuButton = () => {
  const { expanded, toggleSidebar } = useSidebar();
  
  return (
    <button
      className="hidden lg:flex absolute -right-3 top-20 bg-white rounded-full p-1 shadow-md border border-gray-200"
      onClick={toggleSidebar}
    >
      {expanded ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
    </button>
  );
};

// Main sidebar content component
const SidebarContent = ({ onLogout }) => {
  const location = useLocation();
  const { expanded, mobileOpen, toggleMobileSidebar, closeMobileSidebar } = useSidebar();

  const navItems = [
    {
      title: 'User Management',
      icon: <Users size={20} />,
      path: '/admin/users',
    },
    {
      title: 'Listing Management',
      icon: <List size={20} />,
      path: '/admin/listings',
    },
    {
      title: 'Reports',
      icon: <FileText size={20} />,
      path: '/admin/reports',
    },
    {
      title: 'Settings',
      icon: <Settings size={20} />,
      path: '/admin/settings',
    },
  ];

  const isActiveLink = (path) => {
    return location.pathname === path;
  };

  return (
    <>
      {/* Mobile menu button */}
      <button
        className="lg:hidden fixed top-4 right-4 z-30 p-2 rounded-md bg-orange-500 text-white"
        onClick={toggleMobileSidebar}
        aria-label="Toggle menu"
      >
        <Menu size={24} />
      </button>

      {/* Mobile sidebar overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={closeMobileSidebar}
        ></div>
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-50 h-full bg-white shadow-lg transition-all duration-300 ${
          expanded ? 'w-64' : 'w-20'
        } ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
      >
        {/* Close button (mobile only) */}
        <button
          className="lg:hidden absolute top-4 right-4 p-1 rounded-full hover:bg-gray-100"
          onClick={closeMobileSidebar}
        >
          <X size={20} />
        </button>

        {/* Logo - extracted to SidebarHeader */}
        <SidebarHeader expanded={expanded} />

        {/* Toggle button */}
        <SidebarMenuButton />

        {/* Navigation menu */}
        <SidebarMenu>
          {navItems.map((item) => (
            <SidebarMenuItem 
              key={item.path}
              icon={item.icon}
              title={item.title}
              to={item.path}
              isActive={isActiveLink(item.path)}
            />
          ))}
        </SidebarMenu>

        {/* Logout button (at bottom) - extracted to SidebarFooter */}
        <SidebarFooter expanded={expanded} onLogout={onLogout} />
      </aside>

      {/* Main content spacer */}
      <div className={`lg:pl-${expanded ? '64' : '20'}`}></div>
    </>
  );
};

// Separate component for the sidebar footer
const SidebarFooter = ({ expanded, onLogout }) => {
  return (
    <div className="absolute bottom-8 px-4 w-full">
      <button
        onClick={onLogout}
        className={`flex items-center p-3 rounded-lg transition-colors text-gray-600 hover:bg-gray-100 w-full ${
          expanded ? 'justify-start' : 'justify-center'
        }`}
      >
        <LogOut size={20} />
        {expanded && <span className="ml-3">Logout</span>}
      </button>
    </div>
  );
};

// The Sidebar component that combines all pieces
const Sidebar = (props) => {
  return (
    <SidebarProvider>
      <SidebarContent {...props} />
    </SidebarProvider>
  );
};

// Export all the components that AdminDashboard.jsx is importing
export { 
  SidebarProvider,
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton
};

// Add default export for backward compatibility
export default Sidebar;