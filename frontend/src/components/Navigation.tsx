import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useProject } from '../contexts/ProjectContext';
import { 
  LogOut, 
  LayoutDashboard, 
  Package, 
  Users, 
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

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      logout();
    }
  };

  const navItems = [
    { id: 'projects', label: 'Projects', icon: FolderOpen },
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'materials', label: 'Materials', icon: Package },
    { id: 'staff', label: 'Staff', icon: Users },
  ];

  return (
    <div className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-2">
              <Building className="w-8 h-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">Construction Manager</h1>
            </div>
            
            <nav className="hidden md:flex space-x-8">
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
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {item.label}
                  </button>
                );
              })}
            </nav>
          </div>

          <div className="flex items-center gap-4">
            {currentProject && (
              <div className="hidden md:block text-sm text-gray-600">
                <span className="font-medium">Current Project:</span> {currentProject.name}
              </div>
            )}
            
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Welcome, {user?.username}</span>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden border-t border-gray-200 pt-4 pb-3">
          <div className="flex space-x-4 overflow-x-auto">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isDisabled = item.id !== 'projects' && !currentProject;
              
              return (
                <button
                  key={item.id}
                  onClick={() => !isDisabled && onTabChange(item.id)}
                  disabled={isDisabled}
                  className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium whitespace-nowrap transition-colors ${
                    activeTab === item.id
                      ? 'bg-blue-100 text-blue-700'
                      : isDisabled
                      ? 'text-gray-400 cursor-not-allowed'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navigation;