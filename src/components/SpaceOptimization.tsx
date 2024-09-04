import React, { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Select, MenuItem, FormControl, InputLabel, Button, SelectChangeEvent, Grid } from '@mui/material';
import { Clock, Users, TrendingUp } from 'lucide-react';
import PathfinderVisualization from './PathfinderVisualization';

// Mock data for hospital spaces
const hospitalSpaces = [
  { id: 'er', name: 'Emergency Room' },
  { id: 'cardiology', name: 'Cardiology Waiting Room' },
  { id: 'pediatrics', name: 'Pediatrics Waiting Room' },
];

// Mock data for space utilization
const generateUtilizationData = (days: number) => {
  return Array.from({ length: days * 24 }, (_, i) => ({
    time: `${Math.floor(i / 24)}d ${i % 24}h`,
    occupancy: Math.floor(Math.random() * 100),
  }));
};

const SpaceOptimization: React.FC = () => {
  const [selectedSpace, setSelectedSpace] = useState('');
  const [showPrediction, setShowPrediction] = useState(false);
  const [utilizationData, setUtilizationData] = useState(generateUtilizationData(7));
  const [dailyData, setDailyData] = useState<any[]>([]);

  const handleSpaceChange = (event: SelectChangeEvent<string>) => {
    setSelectedSpace(event.target.value);
    setShowPrediction(false);
    setUtilizationData(generateUtilizationData(7));
  };

  const handlePredictionToggle = () => {
    setShowPrediction(!showPrediction);
    if (!showPrediction) {
      const actualData = generateUtilizationData(7);
      const predictionData = actualData.map(item => ({
        ...item,
        prediction: Math.min(100, Math.max(0, item.occupancy + (Math.random() - 0.5) * 20))
      }));
      setUtilizationData(predictionData);
    } else {
      setUtilizationData(generateUtilizationData(7));
    }
  };

  useEffect(() => {
    const groupedData = utilizationData.reduce((acc: any[], item: any) => {
      const day = parseInt(item.time.split('d')[0]);
      if (!acc[day]) acc[day] = [];
      acc[day].push(item);
      return acc;
    }, []);
    setDailyData(groupedData);
  }, [utilizationData]);

  console.log('SpaceOptimization rendering', { selectedSpace, showPrediction });

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-green-700">Space Optimization</h2>
      
      <FormControl fullWidth>
        <InputLabel id="space-select-label">Select Space</InputLabel>
        <Select
          labelId="space-select-label"
          value={selectedSpace}
          label="Select Space"
          onChange={handleSpaceChange}
        >
          {hospitalSpaces.map((space) => (
            <MenuItem key={space.id} value={space.id}>{space.name}</MenuItem>
          ))}
        </Select>
      </FormControl>

      {selectedSpace && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-lg shadow border border-green-500">
              <Clock className="inline-block mr-2 text-green-600" />
              <span className="font-semibold text-green-700">Average Wait Time:</span> 25 minutes
            </div>
            <div className="bg-white p-4 rounded-lg shadow border border-green-500">
              <Users className="inline-block mr-2 text-green-600" />
              <span className="font-semibold text-green-700">Average Occupancy Rate:</span> 75%
            </div>
            <div className="bg-white p-4 rounded-lg shadow border border-green-500">
              <TrendingUp className="inline-block mr-2 text-green-600" />
              <span className="font-semibold text-green-700">Peak Hours:</span> 10:00 AM - 2:00 PM
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md border border-green-500">
            <h3 className="text-xl font-semibold mb-4 text-green-700">Utilization Trends (7 Days)</h3>
            <Button
              variant="contained"
              style={{ backgroundColor: '#4CAF50', color: 'white' }}
              onClick={handlePredictionToggle}
              className="mb-4"
            >
              {showPrediction ? 'Hide Prediction' : 'Show Prediction'}
            </Button>
            {!showPrediction ? (
              <div style={{ height: '400px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={utilizationData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis />
                    <Tooltip />
                    <Area type="monotone" dataKey="occupancy" stroke="#4CAF50" fill="#A5D6A7" name="Actual Occupancy %" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <Grid container spacing={2}>
                {dailyData.map((dayData, index) => (
                  <Grid item xs={12} md={6} lg={4} key={index}>
                    <h4 className="text-lg font-semibold mb-2 text-green-700">Day {index + 1}</h4>
                    <ResponsiveContainer width="100%" height={200}>
                      <AreaChart data={dayData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="time" tickFormatter={(value) => value.split(' ')[1]} />
                        <YAxis />
                        <Tooltip />
                        <Area type="monotone" dataKey="occupancy" stroke="#4CAF50" fill="#A5D6A7" name="Actual Occupancy %" />
                        <Area type="monotone" dataKey="prediction" stroke="#2E7D32" fill="#C8E6C9" name="Predicted Occupancy %" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </Grid>
                ))}
              </Grid>
            )}
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md border border-green-500">
            <h3 className="text-xl font-semibold mb-4 text-green-700">Walking Path Patterns</h3>
            <PathfinderVisualization 
              width={600} 
              height={400} 
            />
          </div>
        </>
      )}
    </div>
  );
};

export default SpaceOptimization;