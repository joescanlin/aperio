import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button } from '@mui/material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface Patient {
  id: number;
  name: string;
  age: number;
  condition: string;
  admissionDate: string;
}

interface GaitMeasurement {
  date: string;
  strideLength: number;
  stepSymmetry: number;
  walkingSpeed: number;
}

const generateMockPatients = (): Patient[] => {
  return Array.from({ length: 25 }, (_, i) => ({
    id: i + 1,
    name: `Patient ${i + 1}`,
    age: Math.floor(Math.random() * 50) + 20,
    condition: ['Stroke', 'Hip Replacement', 'Knee Surgery', 'Spinal Cord Injury'][Math.floor(Math.random() * 4)],
    admissionDate: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  }));
};

const generateMockGaitData = (): GaitMeasurement[] => {
  const baselineDate = new Date();
  return Array.from({ length: 10 }, (_, i) => {
    const measurementDate = new Date(baselineDate);
    measurementDate.setDate(measurementDate.getDate() - (9 - i) * 3);
    return {
      date: measurementDate.toISOString().split('T')[0],
      strideLength: Math.random() * 0.3 + 0.7, // Random value between 0.7 and 1.0
      stepSymmetry: Math.random() * 20 + 80, // Random value between 80 and 100
      walkingSpeed: Math.random() * 0.5 + 0.5, // Random value between 0.5 and 1.0
    };
  });
};

const RehabilitationRoom: React.FC = () => {
  const [patients] = useState<Patient[]>(generateMockPatients());
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [gaitData, setGaitData] = useState<GaitMeasurement[]>([]);

  const handlePatientClick = (patient: Patient) => {
    setSelectedPatient(patient);
    setGaitData(generateMockGaitData());
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-green-700">Rehabilitation Room</h2>
      
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Age</TableCell>
              <TableCell>Condition</TableCell>
              <TableCell>Admission Date</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {patients.map((patient) => (
              <TableRow key={patient.id}>
                <TableCell>{patient.id}</TableCell>
                <TableCell>{patient.name}</TableCell>
                <TableCell>{patient.age}</TableCell>
                <TableCell>{patient.condition}</TableCell>
                <TableCell>{patient.admissionDate}</TableCell>
                <TableCell>
                  <Button variant="contained" color="primary" onClick={() => handlePatientClick(patient)}>
                    View Progress
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {selectedPatient && (
        <div className="bg-white p-6 rounded-lg shadow-md border border-green-500">
          <h3 className="text-xl font-semibold mb-4 text-green-700">
            Rehabilitation Progress for {selectedPatient.name}
          </h3>
          <p>Condition: {selectedPatient.condition}</p>
          <p>Admission Date: {selectedPatient.admissionDate}</p>

          <div className="mt-6">
            <h4 className="text-lg font-semibold mb-2">Gait Measurements Over Time</h4>
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={gaitData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="strideLength" stroke="#8884d8" name="Stride Length (m)" />
                <Line type="monotone" dataKey="stepSymmetry" stroke="#82ca9d" name="Step Symmetry (%)" />
                <Line type="monotone" dataKey="walkingSpeed" stroke="#ffc658" name="Walking Speed (m/s)" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-6">
            <h4 className="text-lg font-semibold mb-2">Analysis</h4>
            <p>
              Based on the sensor data, {selectedPatient.name}'s gait has shown improvement over time. 
              The stride length has increased by {((gaitData[gaitData.length - 1].strideLength - gaitData[0].strideLength) / gaitData[0].strideLength * 100).toFixed(2)}%, 
              step symmetry has improved by {((gaitData[gaitData.length - 1].stepSymmetry - gaitData[0].stepSymmetry) / gaitData[0].stepSymmetry * 100).toFixed(2)}%, 
              and walking speed has increased by {((gaitData[gaitData.length - 1].walkingSpeed - gaitData[0].walkingSpeed) / gaitData[0].walkingSpeed * 100).toFixed(2)}% 
              since the initial assessment.
            </p>
            <p className="mt-2">
              Recommendation: Continue with the current physical therapy plan, focusing on further improving step symmetry.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default RehabilitationRoom;