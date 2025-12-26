
import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import AuthView from './components/AuthView';
import Dashboard from './components/Dashboard';
import AIAdvisor from './components/AIAdvisor';
import Architecture from './components/Architecture';
import FleetRegistry from './components/FleetRegistry';
import DriverManagement from './components/DriverManagement';
import TripManagement from './components/TripManagement';
import FuelManagement from './components/FuelManagement';
import MaintenanceManagement from './components/MaintenanceManagement';
import DocumentManagement from './components/DocumentManagement';
import AlertCenter from './components/AlertCenter';
import ReportsAnalytics from './components/ReportsAnalytics';
import Roadmap from './components/Roadmap';
import { UserRole } from './types';

const App: React.FC = () => {
  const [session, setSession] = useState<{ name: string; email: string; role: UserRole } | null>(null);
  const [activeTab, setActiveTab] = useState('dashboard');

  useEffect(() => {
    const savedSession = localStorage.getItem('fleetops_session');
    if (savedSession) {
      setSession(JSON.parse(savedSession));
    }
  }, []);

  const handleLogin = (role: UserRole) => {
    const user = {
      name: role === UserRole.ADMIN ? 'System Administrator' : role === UserRole.MANAGER ? 'Fleet Manager' : 'Fleet Driver',
      email: role === UserRole.ADMIN ? 'admin@fleetops.ai' : role === UserRole.MANAGER ? 'manager@fleetops.ai' : 'driver@fleetops.ai',
      role: role
    };
    setSession(user);
    localStorage.setItem('fleetops_session', JSON.stringify(user));
  };

  const handleLogout = () => {
    setSession(null);
    localStorage.removeItem('fleetops_session');
    setActiveTab('dashboard');
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return <Dashboard />;
      case 'alerts': return <AlertCenter />;
      case 'reports': return <ReportsAnalytics />;
      case 'ai': return <AIAdvisor />;
      case 'architecture': return <Architecture />;
      case 'roadmap': return <Roadmap />;
      case 'fleet': return <FleetRegistry />;
      case 'drivers': return <DriverManagement />;
      case 'trips': return <TripManagement />;
      case 'fuel': return <FuelManagement />;
      case 'maintenance': return <MaintenanceManagement />;
      case 'documents': return <DocumentManagement />;
      default: return <Dashboard />;
    }
  };

  if (!session) {
    return <AuthView onLogin={handleLogin} />;
  }

  return (
    <Layout 
      activeTab={activeTab} 
      setActiveTab={setActiveTab} 
      user={session} 
      onLogout={handleLogout}
    >
      {renderContent()}
    </Layout>
  );
};

export default App;
