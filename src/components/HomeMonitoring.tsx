import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { day: 'Mon', bedroom: 14, livingRoom: 5, kitchen: 3, bathroom: 2 },
  { day: 'Tue', bedroom: 13, livingRoom: 6, kitchen: 4, bathroom: 1 },
  { day: 'Wed', bedroom: 12, livingRoom: 7, kitchen: 4, bathroom: 2 },
  { day: 'Thu', bedroom: 14, livingRoom: 5, kitchen: 3, bathroom: 3 },
  { day: 'Fri', bedroom: 13, livingRoom: 6, kitchen: 4, bathroom: 2 },
  { day: 'Sat', bedroom: 11, livingRoom: 8, kitchen: 5, bathroom: 1 },
  { day: 'Sun', bedroom: 12, livingRoom: 7, kitchen: 4, bathroom: 2 },
];

const HomeMonitoring = () => {
  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Home Activity Distribution</h2>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="day" />
            <YAxis />
            <Tooltip />
            <Area type="monotone" dataKey="bedroom" stackId="1" stroke="#8884d8" fill="#8884d8" name="Bedroom" />
            <Area type="monotone" dataKey="livingRoom" stackId="1" stroke="#82ca9d" fill="#82ca9d" name="Living Room" />
            <Area type="monotone" dataKey="kitchen" stackId="1" stroke="#ffc658" fill="#ffc658" name="Kitchen" />
            <Area type="monotone" dataKey="bathroom" stackId="1" stroke="#ff8042" fill="#ff8042" name="Bathroom" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Patient Recovery Insights</h2>
        <ul className="list-disc pl-5">
          <li>Increased living room activity suggests improved mobility</li>
          <li>Consistent kitchen visits indicate regular meal preparation</li>
          <li>Stable bathroom usage pattern, no concerns noted</li>
        </ul>
      </div>
    </div>
  );
};

export default HomeMonitoring;