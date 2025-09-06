// components/LayoutComponents/Sidebar.jsx
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  Grid, 
  ShoppingCart, 
  Users, 
  Settings,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = React.useState(false);
  const location = useLocation();

  const menuItems = [
    { path: '/', icon: Home, label: 'Dashboard' },
    { path: '/categories', icon: Grid, label: 'Categories' },
    { path: '/products', icon: ShoppingCart, label: 'Products' },
    { path: '/customers', icon: Users, label: 'Customers' },
    { path: '/settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <div className={`bg-indigo-800 text-white transition-all duration-300 ${isCollapsed ? 'w-20' : 'w-64'}`}>
      <div className="flex items-center justify-between p-4 border-b border-indigo-700">
        {!isCollapsed && (
          <h1 className="text-xl font-semibold">TabernAdmin</h1>
        )}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-2 rounded-lg hover:bg-indigo-700 transition-colors"
        >
          {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>
      
      <nav className="mt-6">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center px-4 py-3 transition-colors ${
                isActive 
                  ? 'bg-indigo-900 border-r-4 border-white' 
                  : 'hover:bg-indigo-700'
              }`}
            >
              <Icon size={20} />
              {!isCollapsed && (
                <span className="ml-3">{item.label}</span>
              )}
            </Link>
          );
        })}
      </nav>
    </div>
  );
};

export default Sidebar;