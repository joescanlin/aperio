import React, { useState, useCallback } from 'react';
import { Clock, User, Activity, MapPin, Bell, Users, TrendingUp } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ScatterChart, Scatter, ZAxis } from 'recharts';
import DecibelLevelChart from './DecibelLevelChart';

interface PatientData {
  roomNumber: string;
  patientName: string;
  lastCheckIn: Date;
  lastActivity: 'in bed' | 'on feet' | 'in bathroom' | 'absent';
  currentLocation: string;
  alerts: string[];
  activityTimeline: { time: string; activity: string }[];
}

const generateMockData = (): PatientData[] => {
  const activities: ('in bed' | 'on feet' | 'in bathroom' | 'absent')[] = ['in bed', 'on feet', 'in bathroom', 'absent'];
  return Array.from({ length: 25 }, (_, i) => ({
    roomNumber: `${100 + i}`,
    patientName: `Patient ${i + 1}`,
    lastCheckIn: new Date(Date.now() - Math.random() * 5400000), // Random time in the last 1.5 hours
    lastActivity: activities[Math.floor(Math.random() * activities.length)],
    currentLocation: ['Room', 'Hallway', 'Common Area', 'Examination Room'][Math.floor(Math.random() * 4)],
    alerts: Math.random() > 0.7 ? ['Medication due', 'Check-up required'] : [],
    activityTimeline: Array.from({ length: 10 }, (_, j) => ({
      time: `${j + 8}:00`,
      activity: ['Medication', 'Vital signs check', 'Physical therapy', 'Meal', 'Rest'][Math.floor(Math.random() * 5)]
    }))
  }));
};

const mockActivityTrends = [
  { week: 'Week 1', strideLength: 0.8, stepSymmetry: 85, walkingSpeed: 0.6 },
  { week: 'Week 2', strideLength: 0.85, stepSymmetry: 88, walkingSpeed: 0.65 },
  { week: 'Week 3', strideLength: 0.9, stepSymmetry: 90, walkingSpeed: 0.7 },
  { week: 'Week 4', strideLength: 0.95, stepSymmetry: 92, walkingSpeed: 0.75 },
  { week: 'Week 5', strideLength: 1.0, stepSymmetry: 94, walkingSpeed: 0.8 },
  { week: 'Week 6', strideLength: 1.05, stepSymmetry: 96, walkingSpeed: 0.85 },
];

const mockStaffEngagement = [
  { time: '00:00', engagement: 2 },
  { time: '04:00', engagement: 1 },
  { time: '08:00', engagement: 5 },
  { time: '12:00', engagement: 4 },
  { time: '16:00', engagement: 3 },
  { time: '20:00', engagement: 2 },
];

const mockMovementHeatMap = Array.from({ length: 50 }, () => ({
  x: Math.floor(Math.random() * 100),
  y: Math.floor(Math.random() * 100),
  value: Math.floor(Math.random() * 500)
}));

const mockActivityHistoryData = [
  { event: 'Medication Administered', time: '08:00 AM', notes: 'Pain medication given' },
  { event: 'Vital Signs Check', time: '10:30 AM', notes: 'BP: 120/80, HR: 72, Temp: 98.6°F' },
  { event: 'Physical Therapy', time: '11:45 AM', notes: 'Completed 30 min session' },
  { event: 'Meal', time: '12:30 PM', notes: 'Ate 75% of lunch' },
  { event: 'Visitor', time: '02:00 PM', notes: 'Family member visited for 1 hour' },
  { event: 'Doctor Round', time: '04:15 PM', notes: 'Dr. Smith checked in' },
  { event: 'Medication Administered', time: '08:00 PM', notes: 'Evening medication given' },
];

const mockDecibelData = Array.from({ length: 48 }, (_, i) => {
  const hour = Math.floor(i / 4);
  const minute = (i % 4) * 15;
  const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
  const level = Math.floor(Math.random() * 30) + 30; // Random decibel level between 30 and 60
  const peoplePresent = Math.floor(Math.random() * 5) + 1;
  
  let possibleCauses;
  if (level > 45) {
    possibleCauses = [
      'Staff conversation',
      'Equipment noise',
      'Patient distress',
      'Visitor activity',
      'Cleaning procedures'
    ].sort(() => 0.5 - Math.random()).slice(0, Math.floor(Math.random() * 3) + 1);
  }

  return {
    time,
    level,
    peoplePresent,
    possibleCauses
  };
});

const PatientRoomMonitoring: React.FC = () => {
  const [patients, setPatients] = useState<PatientData[]>(generateMockData());
  const [selectedPatient, setSelectedPatient] = useState<PatientData | null>(null);

  const handlePatientClick = useCallback((patient: PatientData) => {
    setSelectedPatient(patient);
  }, []);

  const getTimeSinceLastCheckIn = (lastCheckIn: Date): number => {
    return Math.floor((Date.now() - lastCheckIn.getTime()) / 60000);
  };

  const getStatusColor = (lastCheckIn: Date): string => {
    const timeSince = getTimeSinceLastCheckIn(lastCheckIn);
    if (timeSince >= 60) return 'bg-red-100 border-red-500';
    if (timeSince >= 30) return 'bg-yellow-100 border-yellow-500';
    return 'bg-green-100 border-green-500';
  };

  const PatientTile: React.FC<{ patient: PatientData; onClick: () => void }> = React.memo(({ patient, onClick }) => (
    <div 
      className={`p-4 border-2 rounded-lg cursor-pointer ${getStatusColor(patient.lastCheckIn)}`}
      onClick={onClick}
    >
      <h3 className="font-bold">{patient.roomNumber}</h3>
      <p><User size={14} className="inline mr-1" />{patient.patientName}</p>
      <p><Clock size={14} className="inline mr-1" />{getTimeSinceLastCheckIn(patient.lastCheckIn)} mins ago</p>
      <p><Activity size={14} className="inline mr-1" />{patient.lastActivity}</p>
    </div>
  ));

  const PatientDetail: React.FC<{ patient: PatientData; onBack: () => void }> = React.memo(({ patient, onBack }) => {
    const [selectedMetric, setSelectedMetric] = useState<string | null>(null);

    const handleMetricClick = useCallback((metric: string) => {
      setSelectedMetric(prev => prev === metric ? null : metric);
    }, []);

    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4">Room {patient.roomNumber} - {patient.patientName}</h2>
        
        {/* Alerts */}
        {patient.alerts.length > 0 && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4">
            <p className="font-bold">Alerts:</p>
            <ul className="list-disc pl-5">
              {patient.alerts.map((alert, index) => (
                <li key={index}>{alert}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Status Tiles */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div className="bg-blue-100 p-4 rounded-lg">
            <Clock className="inline-block mr-2 text-blue-600" />
            <span className="font-semibold">Last Check-in:</span> {getTimeSinceLastCheckIn(patient.lastCheckIn)} minutes ago
          </div>
          <div className="bg-green-100 p-4 rounded-lg">
            <Activity className="inline-block mr-2 text-green-600" />
            <span className="font-semibold">Last Activity:</span> {patient.lastActivity}
          </div>
          <div className="bg-purple-100 p-4 rounded-lg">
            <MapPin className="inline-block mr-2 text-purple-600" />
            <span className="font-semibold">Current Location:</span> {patient.currentLocation}
          </div>
        </div>

        {/* Activity History Log */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-xl font-semibold text-green-800 mb-4">Activity History Log</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
              <thead className="bg-green-100">
                <tr>
                  <th className="py-2 px-4 border-b border-green-200 text-left text-xs font-semibold text-green-600 uppercase tracking-wider">
                    Event
                  </th>
                  <th className="py-2 px-4 border-b border-green-200 text-left text-xs font-semibold text-green-600 uppercase tracking-wider">
                    Time
                  </th>
                  <th className="py-2 px-4 border-b border-green-200 text-left text-xs font-semibold text-green-600 uppercase tracking-wider">
                    Notes
                  </th>
                </tr>
              </thead>
              <tbody className="text-gray-700">
                {mockActivityHistoryData.map((activity, index) => (
                  <tr key={index} className={index % 2 === 0 ? 'bg-green-50' : 'bg-white'}>
                    <td className="py-2 px-4 border-b border-green-100">{activity.event}</td>
                    <td className="py-2 px-4 border-b border-green-100">{activity.time}</td>
                    <td className="py-2 px-4 border-b border-green-100">{activity.notes}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Movement Density Map */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-xl font-semibold text-green-800 mb-4">Movement Density Map</h2>
          <ResponsiveContainer width="100%" height={300}>
            <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
              <CartesianGrid />
              <XAxis type="number" dataKey="x" name="X-coordinate" />
              <YAxis type="number" dataKey="y" name="Y-coordinate" />
              <ZAxis type="number" dataKey="value" range={[0, 500]} name="Frequency" />
              <Tooltip cursor={{ strokeDasharray: '3 3' }} />
              <Scatter name="Movement Frequency" data={mockMovementHeatMap} fill="#8884d8" />
            </ScatterChart>
          </ResponsiveContainer>
        </div>

        {/* Activity Trends and Predictions */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h3 className="text-xl font-semibold text-green-800 mb-4">Activity Trends and Predictions</h3>
          <div className="flex space-x-4 mb-4">
            <button
              className={`px-4 py-2 rounded ${selectedMetric === 'strideLength' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
              onClick={() => handleMetricClick('strideLength')}
            >
              Stride Length
            </button>
            <button
              className={`px-4 py-2 rounded ${selectedMetric === 'stepSymmetry' ? 'bg-green-500 text-white' : 'bg-gray-200'}`}
              onClick={() => handleMetricClick('stepSymmetry')}
            >
              Step Symmetry
            </button>
            <button
              className={`px-4 py-2 rounded ${selectedMetric === 'walkingSpeed' ? 'bg-yellow-500 text-white' : 'bg-gray-200'}`}
              onClick={() => handleMetricClick('walkingSpeed')}
            >
              Walking Speed
            </button>
          </div>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={mockActivityTrends}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="week" />
              <YAxis yAxisId="left" domain={[0, 1.2]} label={{ value: 'Stride Length (m) / Walking Speed (m/s)', angle: -90, position: 'insideLeft' }} />
              <YAxis yAxisId="right" orientation="right" domain={[80, 100]} label={{ value: 'Step Symmetry (%)', angle: 90, position: 'insideRight' }} />
              <Tooltip />
              <Legend />
              {(!selectedMetric || selectedMetric === 'strideLength') && (
                <Line yAxisId="left" type="monotone" dataKey="strideLength" stroke="#8884d8" name="Stride Length (m)" />
              )}
              {(!selectedMetric || selectedMetric === 'stepSymmetry') && (
                <Line yAxisId="right" type="monotone" dataKey="stepSymmetry" stroke="#82ca9d" name="Step Symmetry (%)" />
              )}
              {(!selectedMetric || selectedMetric === 'walkingSpeed') && (
                <Line yAxisId="left" type="monotone" dataKey="walkingSpeed" stroke="#ffc658" name="Walking Speed (m/s)" />
              )}
            </LineChart>
          </ResponsiveContainer>
          <div className="mt-4">
            <p className="text-sm text-gray-600">
              Trend Analysis: {patient.patientName}'s gait metrics have shown consistent improvement over the past 6 weeks.
              {(!selectedMetric || selectedMetric === 'strideLength') && (
                <span>
                  Stride length has increased by {((mockActivityTrends[5].strideLength - mockActivityTrends[0].strideLength) / mockActivityTrends[0].strideLength * 100).toFixed(2)}%,{' '}
                </span>
              )}
              {(!selectedMetric || selectedMetric === 'stepSymmetry') && (
                <span>
                  step symmetry has improved by {(mockActivityTrends[5].stepSymmetry - mockActivityTrends[0].stepSymmetry).toFixed(2)}%,{' '}
                </span>
              )}
              {(!selectedMetric || selectedMetric === 'walkingSpeed') && (
                <span>
                  and walking speed has increased by {((mockActivityTrends[5].walkingSpeed - mockActivityTrends[0].walkingSpeed) / mockActivityTrends[0].walkingSpeed * 100).toFixed(2)}% 
                </span>
              )}
            </p>
            <p className="text-sm text-gray-600 mt-2">
              Recommendation: Continue with the current physical therapy plan, focusing on further improving {selectedMetric ? selectedMetric : 'all metrics'}.
            </p>
          </div>
        </div>

        {/* Staff Engagement Graph */}
        <div className="mb-4">
          <h3 className="text-xl font-bold mb-2">Staff Engagement</h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={mockStaffEngagement}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="engagement" stroke="#82ca9d" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Decibel Level Chart */}
        <DecibelLevelChart data={mockDecibelData} acceptableLevel={45} />

        <button 
          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
          onClick={onBack}
        >
          Back to Overview
        </button>
      </div>
    );
  });

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Patient Room Monitoring</h2>
      {selectedPatient ? (
        <PatientDetail 
          patient={selectedPatient} 
          onBack={() => setSelectedPatient(null)}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {patients.map((patient) => (
            <PatientTile 
              key={patient.roomNumber} 
              patient={patient} 
              onClick={() => handlePatientClick(patient)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default PatientRoomMonitoring;