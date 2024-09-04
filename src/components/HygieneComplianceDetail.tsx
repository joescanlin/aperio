import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface HygieneComplianceDetailProps {
  area: string;
  onBack: () => void;
}

const HygieneComplianceDetail: React.FC<HygieneComplianceDetailProps> = ({ area, onBack }) => {
  // Mock data for wash stations
  const washStationData = [
    { id: 1, name: 'Station 1', compliance: 85 },
    { id: 2, name: 'Station 2', compliance: 92 },
    { id: 3, name: 'Station 3', compliance: 78 },
    { id: 4, name: 'Station 4', compliance: 95 },
    { id: 5, name: 'Station 5', compliance: 70 },
  ];

  // Mock data for compliance by shift
  const shiftData = [
    { name: 'Morning', compliance: 88 },
    { name: 'Afternoon', compliance: 82 },
    { name: 'Night', compliance: 75 },
  ];

  // Mock data for compliance by role
  const roleData = [
    { name: 'Doctors', value: 90 },
    { name: 'Nurses', value: 85 },
    { name: 'Technicians', value: 80 },
    { name: 'Other Staff', value: 75 },
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-green-700">Hygiene Compliance: {area}</h2>
        <button onClick={onBack} className="bg-green-500 text-white px-4 py-2 rounded">Back to Summary</button>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md border border-green-500">
        <h3 className="text-xl font-semibold mb-4 text-green-700">Wash Station Compliance</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={washStationData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="compliance" fill="#4CAF50" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md border border-green-500">
        <h3 className="text-xl font-semibold mb-4 text-green-700">Compliance by Shift</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={shiftData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="compliance" fill="#2196F3" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md border border-green-500">
        <h3 className="text-xl font-semibold mb-4 text-green-700">Compliance by Role</h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={roleData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {roleData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default HygieneComplianceDetail;