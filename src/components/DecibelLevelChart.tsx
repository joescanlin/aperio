import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell, ReferenceLine } from 'recharts';

interface DecibelData {
  time: string;
  level: number;
  peoplePresent?: number;
  possibleCauses?: string[];
}

interface DecibelLevelChartProps {
  data: DecibelData[];
  acceptableLevel: number;
}

const CustomTooltip: React.FC<any> = ({ active, payload, label, acceptableLevel }) => {
  if (active && payload && payload.length && payload[0].value > acceptableLevel) {
    const data = payload[0].payload as DecibelData;
    return (
      <div className="bg-white p-4 rounded shadow-md border border-gray-200">
        <p className="font-bold">{`Time: ${data.time}`}</p>
        <p>{`Noise Level: ${data.level} dB`}</p>
        <p>{`People Present: ${data.peoplePresent || 'Unknown'}`}</p>
        {data.possibleCauses && (
          <div>
            <p className="font-semibold mt-2">Possible Causes:</p>
            <ul className="list-disc list-inside">
              {data.possibleCauses.map((cause: string, index: number) => (
                <li key={index}>{cause}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  }
  return null;
};

const DecibelLevelChart: React.FC<DecibelLevelChartProps> = ({ data, acceptableLevel }) => {
  const [activeBar, setActiveBar] = useState<number | null>(null);

  const handleBarClick = (data: DecibelData, index: number) => {
    if (data.level > acceptableLevel) {
      setActiveBar(index);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-8">
      <h3 className="text-xl font-semibold text-green-800 mb-4">Room Noise Levels (Last 12 Hours)</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="time" />
          <YAxis label={{ value: 'Decibels (dB)', angle: -90, position: 'insideLeft' }} />
          <Tooltip content={<CustomTooltip acceptableLevel={acceptableLevel} />} />
          <Legend />
          <ReferenceLine y={acceptableLevel} stroke="red" strokeDasharray="3 3" />
          <Bar dataKey="level" fill="#8884d8" name="Noise Level" onClick={handleBarClick}>
            {data.map((entry, index) => (
              <Cell
                cursor={entry.level > acceptableLevel ? 'pointer' : 'default'}
                fill={entry.level > acceptableLevel ? '#ff7300' : '#8884d8'}
                key={`cell-${index}`}
                opacity={activeBar === index ? 0.8 : 1}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      <div className="mt-4">
        <p className="text-sm text-gray-600">
          Maintaining appropriate noise levels is crucial for patient recovery. Excessive noise can disrupt sleep,
          increase stress, and slow healing processes. Our goal is to keep noise levels below {acceptableLevel} dB
          to ensure a restful environment for our patients.
        </p>
        <p className="text-sm text-gray-600 mt-2">
          Recommendations:
          <ul className="list-disc list-inside mt-1">
            <li>Use quiet voices during night shifts</li>
            <li>Minimize equipment noise and alarms when possible</li>
            <li>Offer earplugs to light sleepers</li>
            <li>Implement "quiet hours" during peak sleep times</li>
          </ul>
        </p>
      </div>
    </div>
  );
};

export default DecibelLevelChart;