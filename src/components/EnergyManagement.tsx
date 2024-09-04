import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area } from 'recharts';
import { TrendingUp, TrendingDown } from 'lucide-react';

const EnergyManagement: React.FC = () => {
  // Mock data for 'At A Glance' summary
  const atAGlanceData = {
    savingsToday: { value: 7.40, change: 3.2 },
    kwhSaved: { value: 46.28, change: 2.1 },
    co2Saved: { value: 0.03, change: 0.0 }
  };

  // Mock data for HVAC Savings Graph
  const hvacData = Array.from({ length: 24 }, (_, i) => ({
    time: `${i}:00`,
    baselineHVAC: i >= 7 && i < 20 ? 100 : 50,
    occupancy: getOccupancy(i),
    occupancyBasedHVAC: getOccupancyBasedHVAC(i)
  }));

  function getOccupancy(hour: number): number {
    if (hour >= 6 && hour < 9) return Math.min(77, (hour - 6) * 25);
    if (hour >= 9 && hour < 16) return 65 + Math.sin((hour - 9) * Math.PI / 7) * 5;
    if (hour >= 16 && hour < 18) return Math.max(0, 77 - (hour - 16) * 38.5);
    return 0;
  }

  function getOccupancyBasedHVAC(hour: number): number {
    if (hour >= 7 && hour < 18) return Math.min(100, getOccupancy(hour) * 1.1 + 5);
    return 55;
  }

  const SummaryTile: React.FC<{ title: string; value: number; change: number; unit: string }> = ({ title, value, change, unit }) => (
    <div className="bg-white p-4 rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-2xl font-bold mb-1">{unit}{value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
      <div className={`flex items-center ${change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
        {change >= 0 ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
        <span className="ml-1">{Math.abs(change)}% vs yesterday</span>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-green-700">Energy Management</h2>
      
      {/* At A Glance Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <SummaryTile title="Savings Today" value={atAGlanceData.savingsToday.value} change={atAGlanceData.savingsToday.change} unit="$" />
        <SummaryTile title="Kilowatt-Hours Saved Today" value={atAGlanceData.kwhSaved.value} change={atAGlanceData.kwhSaved.change} unit="" />
        <SummaryTile title="Tons of CO2 Saved Today" value={atAGlanceData.co2Saved.value} change={atAGlanceData.co2Saved.change} unit="" />
      </div>

      {/* HVAC Savings Graph */}
      <div className="bg-white p-6 rounded-lg shadow-md border border-green-500">
        <h3 className="text-xl font-semibold mb-4 text-green-700">HVAC Savings Graph</h3>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={hvacData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="time" />
            <YAxis label={{ value: '% of Max Capacity', angle: -90, position: 'insideLeft' }} domain={[0, 100]} />
            <Tooltip />
            <Legend />
            {/* Highlight area between Baseline HVAC and Occupancy Based HVAC */}
            <Area type="monotone" dataKey="baselineHVAC" fill="#8884d8" stroke="none" />
            <Area type="monotone" dataKey="occupancyBasedHVAC" fill="#ffc658" stroke="none" />
            {/* Lines */}
            <Line type="stepAfter" dataKey="baselineHVAC" stroke="#8884d8" name="Baseline HVAC" strokeWidth={2} />
            <Line type="monotone" dataKey="occupancy" stroke="#82ca9d" name="Occupancy" strokeWidth={2} />
            <Line type="monotone" dataKey="occupancyBasedHVAC" stroke="#ffc658" name="Occupancy Based HVAC" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default EnergyManagement;