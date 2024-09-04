import React, { useState } from 'react';
import './App.css';
import { Home, Users, Activity, LayoutDashboard, Droplet, BarChart2, Wrench, Shield, Zap } from 'lucide-react';

import WaitingRoomMetrics from './components/WaitingRoomMetrics';
import PatientRoomMonitoring from './components/PatientRoomMonitoring';
import HomeMonitoring from './components/HomeMonitoring';
import SpaceOptimization from './components/SpaceOptimization';
import HygieneCompliance from './components/HygieneCompliance';
import FacilitiesManagement from './components/FacilitiesManagement';
import RehabilitationRoom from './components/RehabilitationRoom';
import Security from './components/Security';
import EnergyManagement from './components/EnergyManagement';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState('dashboard');

  console.log("Current view:", currentView);

  const navItems = [
    { name: 'Dashboard', view: 'dashboard', icon: Home },
    { name: 'Waiting Rooms', view: 'waiting rooms', icon: Users },
    { name: 'Patient Rooms', view: 'patient rooms', icon: Activity },
    { name: 'Home Monitoring', view: 'home monitoring', icon: Home },
    { name: 'Space Optimization', view: 'space optimization', icon: LayoutDashboard },
    { name: 'Hygiene Compliance', view: 'hygiene compliance', icon: Droplet },
    { name: 'Facilities Management', view: 'facilities management', icon: Wrench },
    { name: 'Rehabilitation Room', view: 'rehabilitation room', icon: Activity },
    { name: 'Security', view: 'security', icon: Shield },
    { name: 'Energy Management', view: 'energy management', icon: Zap },
    { name: 'Analytics', view: 'analytics', icon: BarChart2 },
  ];

  return (
    <div className="App">
      <header className="app-header">
        <div className="logo">
          <img src="/scanalytics-logo.png" alt="Scanalytics Logo" className="h-8 mr-2" />
        </div>
        <h1>Hospital Spatial Intelligence Dashboard</h1>
      </header>
      <div className="app-content">
        <nav className="sidebar">
          {navItems.map((item) => (
            <button
              key={item.view}
              onClick={() => setCurrentView(item.view)}
              className={currentView === item.view ? 'active' : ''}
            >
              <item.icon size={18} />
              <span>{item.name}</span>
            </button>
          ))}
        </nav>
        <main className="main-content">
          {console.log("Rendering main content, currentView:", currentView)}
          {currentView === 'dashboard' && <h2>Overview Dashboard</h2>}
          {currentView === 'waiting rooms' && <WaitingRoomMetrics />}
          {currentView === 'patient rooms' && <PatientRoomMonitoring />}
          {currentView === 'home monitoring' && <HomeMonitoring />}
          {currentView === 'space optimization' && <SpaceOptimization />}
          {currentView === 'hygiene compliance' && <HygieneCompliance />}
          {currentView === 'facilities management' && <FacilitiesManagement />}
          {currentView === 'rehabilitation room' && <RehabilitationRoom />}
          {currentView === 'security' && <Security />}
          {currentView === 'energy management' && <EnergyManagement />}
          {currentView === 'analytics' && <h2>Advanced Analytics</h2>}
        </main>
      </div>
    </div>
  );
};

export default App;