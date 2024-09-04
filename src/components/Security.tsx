import React, { useState, useEffect } from 'react';
import { AlertTriangle, UserX, Users, Lock, Shield, Sun, Cloud, CloudRain, Wind, AlertCircle, Bell, Camera } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const Security: React.FC = () => {
  const [alerts, setAlerts] = useState<any[]>([]);
  const [weatherForecast, setWeatherForecast] = useState<any[]>([]);
  const [externalEvents, setExternalEvents] = useState<any[]>([]);

  // Static foot traffic data
  const footTrafficData = [
    { hour: '00:00', traffic: 20 },
    { hour: '01:00', traffic: 15 },
    { hour: '02:00', traffic: 10 },
    { hour: '03:00', traffic: 8 },
    { hour: '04:00', traffic: 12 },
    { hour: '05:00', traffic: 25 },
    { hour: '06:00', traffic: 40 },
    { hour: '07:00', traffic: 60 },
    { hour: '08:00', traffic: 85 },
    { hour: '09:00', traffic: 95 },
    { hour: '10:00', traffic: 90 },
    { hour: '11:00', traffic: 85 },
    { hour: '12:00', traffic: 80 },
    { hour: '13:00', traffic: 75 },
    { hour: '14:00', traffic: 80 },
    { hour: '15:00', traffic: 85 },
    { hour: '16:00', traffic: 90 },
    { hour: '17:00', traffic: 80 },
    { hour: '18:00', traffic: 70 },
    { hour: '19:00', traffic: 60 },
    { hour: '20:00', traffic: 50 },
    { hour: '21:00', traffic: 40 },
    { hour: '22:00', traffic: 30 },
    { hour: '23:00', traffic: 25 },
  ];

  // Simulated real-time data updates for alerts
  useEffect(() => {
    const interval = setInterval(() => {
      const newAlert = generateRandomAlert();
      setAlerts(prevAlerts => [...prevAlerts.slice(-4), newAlert]);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // Simulated weather forecast and external events
  useEffect(() => {
    setWeatherForecast([
      { day: 'Today', temp: 72, icon: <Sun /> },
      { day: 'Tomorrow', temp: 68, icon: <Cloud /> },
      { day: 'Day 3', temp: 65, icon: <CloudRain /> },
      { day: 'Day 4', temp: 70, icon: <Sun /> },
      { day: 'Day 5', temp: 73, icon: <Wind /> },
    ]);

    setExternalEvents([
      { name: 'Local Concert', date: '2023-06-15', riskLevel: 'Medium' },
      { name: 'City Marathon', date: '2023-06-18', riskLevel: 'Low' },
      { name: 'Political Rally', date: '2023-06-20', riskLevel: 'High' },
    ]);
  }, []);

  const generateRandomAlert = () => {
    const alertTypes = [
      { type: 'Unusual Behavior', icon: <AlertTriangle className="text-yellow-500" />, severity: 'Medium' },
      { type: 'Unauthorized Access', icon: <UserX className="text-red-500" />, severity: 'High' },
      { type: 'Traffic Buildup', icon: <Users className="text-orange-500" />, severity: 'Low' },
    ];
    const randomType = alertTypes[Math.floor(Math.random() * alertTypes.length)];
    return {
      id: Date.now(),
      ...randomType,
      location: `Zone ${String.fromCharCode(65 + Math.floor(Math.random() * 6))}`,
      timestamp: new Date().toLocaleTimeString(),
    };
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-green-700">Security and Safety Monitor</h2>
      
      {/* Alert System */}
      <div className="bg-white p-6 rounded-lg shadow-md border border-green-500">
        <h3 className="text-xl font-semibold mb-4 text-green-700">Recent Alerts</h3>
        <div className="space-y-2">
          {alerts.map(alert => (
            <div key={alert.id} className={`flex items-center p-3 rounded-lg ${
              alert.severity === 'High' ? 'bg-red-100' :
              alert.severity === 'Medium' ? 'bg-yellow-100' : 'bg-orange-100'
            }`}>
              {alert.icon}
              <span className="ml-2 font-semibold">{alert.type}</span>
              <span className="ml-2">in {alert.location}</span>
              <span className="ml-auto text-sm text-gray-500">{alert.timestamp}</span>
            </div>
          ))}
        </div>
      </div>
      
      {/* Foot Traffic Analysis */}
      <div className="bg-white p-6 rounded-lg shadow-md border border-green-500">
        <h3 className="text-xl font-semibold mb-4 text-green-700">Foot Traffic Analysis (24-hour period)</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={footTrafficData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="hour" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="traffic" stroke="#8884d8" name="Foot Traffic" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Equipment Status */}
      <div className="bg-white p-6 rounded-lg shadow-md border border-green-500">
        <h3 className="text-xl font-semibold mb-4 text-green-700">Equipment Status</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-green-100 p-4 rounded-lg flex items-center">
            <Lock className="text-green-500 mr-2" />
            <span>Access control systems: Operational</span>
          </div>
          <div className="bg-yellow-100 p-4 rounded-lg flex items-center">
            <AlertCircle className="text-yellow-500 mr-2" />
            <span>Alarm systems: Maintenance required</span>
          </div>
          <div className="bg-green-100 p-4 rounded-lg flex items-center">
            <Shield className="text-green-500 mr-2" />
            <span>Firewall: Active, last updated 2 hours ago</span>
          </div>
        </div>
      </div>

      {/* Weather and External Events */}
      <div className="bg-white p-6 rounded-lg shadow-md border border-green-500">
        <h3 className="text-xl font-semibold mb-4 text-green-700">Weather and External Events</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold mb-2">Weather Forecast</h4>
            <div className="flex justify-between">
              {weatherForecast.map((day, index) => (
                <div key={index} className="text-center">
                  <p>{day.day}</p>
                  {day.icon}
                  <p>{day.temp}°F</p>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Upcoming Local Events</h4>
            <ul className="space-y-2">
              {externalEvents.map((event, index) => (
                <li key={index} className={`p-2 rounded ${
                  event.riskLevel === 'High' ? 'bg-red-100' :
                  event.riskLevel === 'Medium' ? 'bg-yellow-100' : 'bg-green-100'
                }`}>
                  <span className="font-semibold">{event.name}</span> - {event.date}
                  <span className="ml-2 text-sm">Risk: {event.riskLevel}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Mobile Alerts */}
      <div className="bg-white p-6 rounded-lg shadow-md border border-green-500">
        <h3 className="text-xl font-semibold mb-4 text-green-700">Mobile Alerts</h3>
        <div className="flex items-center">
          <Bell className="text-green-500 mr-2" />
          <span>Mobile alerts are active for all security personnel</span>
        </div>
        <p className="mt-2 text-sm text-gray-600">
          Critical security alerts are automatically sent to authorized personnel's mobile devices.
        </p>
      </div>
    </div>
  );
};

export default Security;