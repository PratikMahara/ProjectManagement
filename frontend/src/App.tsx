import React, { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ProjectProvider } from './contexts/ProjectContext';
import Login from './components/Login';
import Navigation from './components/Navigation';
import ProjectSelector from './components/ProjectSelector';
import Dashboard from './components/Dashboard';
import MaterialsTable from './components/MaterialsTable';
import StaffTable from './components/StaffTable';

const AppContent: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState('projects');

  if (!isAuthenticated) {
    return <Login />;
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'projects':
        return <ProjectSelector />;
      case 'dashboard':
        return <Dashboard />;
      case 'materials':
        return <MaterialsTable />;
      case 'staff':
        return <StaffTable />;
      default:
        return <ProjectSelector />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation activeTab={activeTab} onTabChange={setActiveTab} />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderContent()}
      </main>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <ProjectProvider>
        <AppContent />
      </ProjectProvider>
    </AuthProvider>
  );
}

export default App;