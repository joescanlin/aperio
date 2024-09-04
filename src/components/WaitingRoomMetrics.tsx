import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';

const occupancyData = [
  { name: 'ER', current: 15, capacity: 25 },
  { name: 'Cardiology', current: 8, capacity: 15 },
  { name: 'Pediatrics', current: 10, capacity: 20 },
  { name: 'Orthopedics', current: 5, capacity: 10 },
];

const flowData = [
  { time: '08:00', inflow: 5, outflow: 2 },
  { time: '09:00', inflow: 8, outflow: 4 },
  { time: '10:00', inflow: 12, outflow: 6 },
  { time: '11:00', inflow: 10, outflow: 8 },
  { time: '12:00', inflow: 6, outflow: 10 },
];

const WaitingRoomMetrics: React.FC = () => {
  return (
    <div>
      <h2>Waiting Room Metrics</h2>
      <div className="card">
        <h3>Waiting Room Occupancy</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={occupancyData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="current" fill="#8884d8" name="Current Occupancy" />
            <Bar dataKey="capacity" fill="#82ca9d" name="Capacity" />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="card">
        <h3>Patient Flow</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={flowData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="time" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="inflow" stroke="#8884d8" name="Inflow" />
            <Line type="monotone" dataKey="outflow" stroke="#82ca9d" name="Outflow" />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="card">
        <h3>Insights</h3>
        <ul>
          <li>ER is nearing capacity (60% full)</li>
          <li>Pediatrics has the highest turnover rate</li>
          <li>Peak inflow occurs around 10:00 AM</li>
          <li>Suggested staff increase between 9:00 AM and 11:00 AM</li>
        </ul>
      </div>
    </div>
  );
};

export default WaitingRoomMetrics;