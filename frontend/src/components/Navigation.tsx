import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useProject } from '../contexts/ProjectContext';

import {
  LayoutDashboard,
  Package,
  Users,
  LogOut,
  FolderOpen,
  Building
} from 'lucide-react';

interface NavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const Navigation: React.FC<NavigationProps> = ({ activeTab, onTabChange }) => {
  const { logout, user } = useAuth();
  const { currentProject } = useProject();

  console.log("✅ Current project in Navigation:", currentProject);

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      logout();
    }
  };

  const navItems = [
    { id: 'projects', label: 'Projects', icon: FolderOpen },
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'materials', label: 'Materials', icon: Package },
    { id: 'staff', label: 'Staff', icon: Users }
  ];

  return (
    <header className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col md:flex-row justify-between items-center">
        {/* Logo and Title */}
        <div className="flex items-center gap-2">
          <Building className="w-8 h-8 text-blue-600" />
          <span className="text-2xl font-bold text-gray-800">Construction Manager</span>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex space-x-6 mt-4 md:mt-0">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isDisabled = item.id !== 'projects' && !currentProject;

            return (
              <button
                key={item.id}
                onClick={() => !isDisabled && onTabChange(item.id)}
                disabled={isDisabled}
                className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === item.id
                    ? 'bg-blue-100 text-blue-700'
                    : isDisabled
                    ? 'text-gray-400 cursor-not-allowed'
                    : 'text-gray-700 hover:text-blue-600 hover:bg-gray-100'
                }`}
              >
                <Icon className="w-4 h-4" />
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Right Side: Current Project + User Info */}
        <div className="flex flex-col md:flex-row items-center gap-3 mt-4 md:mt-0 text-sm text-gray-600">
          {currentProject && (
            <div>
              <span className="font-medium">Project:</span> {currentProject.projectName}
            </div>
          )}
          {user && (
            <div className="flex items-center gap-2">
              <span>Hello, {user.username}</span>
              <button
                onClick={handleLogout}
                className="flex items-center gap-1 px-2 py-1 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden border-t border-gray-200 pt-3 pb-2 px-4 flex overflow-x-auto space-x-3">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isDisabled = item.id !== 'projects' && !currentProject;

          return (
            <button
              key={item.id}
              onClick={() => !isDisabled && onTabChange(item.id)}
              disabled={isDisabled}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-md text-sm font-medium whitespace-nowrap transition-colors ${
                activeTab === item.id
                  ? 'bg-blue-100 text-blue-700'
                  : isDisabled
                  ? 'text-gray-400 cursor-not-allowed'
                  : 'text-gray-700 hover:text-blue-600 hover:bg-gray-100'
              }`}
            >
              <Icon className="w-4 h-4" />
              {item.label}
            </button>
          );
        })}
      </div>
    </header>
  );
};

export default Navigation;
