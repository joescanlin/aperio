import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import HygieneComplianceDetail from './HygieneComplianceDetail';

const data = [
  { name: 'ER', compliance: 85 },
  { name: 'ICU', compliance: 92 },
  { name: 'General Ward', compliance: 78 },
  { name: 'Operating Rooms', compliance: 95 },
  { name: 'Outpatient', compliance: 70 },
];

const HygieneCompliance: React.FC = () => {
  const [selectedArea, setSelectedArea] = useState<string | null>(null);

  const handleAreaClick = (area: string) => {
    setSelectedArea(area);
  };

  if (selectedArea) {
    return <HygieneComplianceDetail area={selectedArea} onBack={() => setSelectedArea(null)} />;
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-green-700">Hygiene Compliance</h2>
      <div className="bg-white p-6 rounded-lg shadow-md border border-green-500">
        <h3 className="text-xl font-semibold mb-4 text-green-700">Overall Compliance by Area</h3>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="compliance" fill="#4CAF50" onClick={(data) => handleAreaClick(data.name)} cursor="pointer" />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-md border border-green-500">
        <h3 className="text-xl font-semibold mb-4 text-green-700">Compliance Summary</h3>
        <ul className="space-y-2">
          {data.map((item) => (
            <li key={item.name} className="flex justify-between items-center cursor-pointer hover:bg-green-50 p-2 rounded" onClick={() => handleAreaClick(item.name)}>
              <span>{item.name}</span>
              <span className={`font-bold ${item.compliance >= 80 ? 'text-green-600' : 'text-red-600'}`}>
                {item.compliance}%
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default HygieneCompliance;