import React, { useState, useEffect, useRef } from 'react';
import { Grid, Paper, Typography, List, ListItem, ListItemText, Slider, Button, LinearProgress, TextField, Tooltip } from '@mui/material';
import { Clock, Droplet, Trash2, FileText } from 'lucide-react';

interface CleaningArea {
  id: string;
  name: string;
  priority: 'low' | 'medium' | 'high';
  lastCleaned: Date;
  utilizationScore: number;
}

interface SupplyArea {
  id: string;
  name: string;
  paperTowels: number;
  soap: number;
  toiletPaper: number;
  footTraffic: number;
  reorderThreshold: number;
}

const generateMockCleaningAreas = (): CleaningArea[] => {
  const areas = ['Lobby', 'ER Waiting Room', 'Cafeteria', 'Main Hallway', 'Pediatrics Ward', 'ICU'];
  return areas.map((area, index) => {
    const utilizationScore = Math.floor(Math.random() * 100) + 1;
    let priority: 'low' | 'medium' | 'high';
    if (utilizationScore <= 25) priority = 'low';
    else if (utilizationScore <= 70) priority = 'medium';
    else priority = 'high';
    return {
      id: `area-${index}`,
      name: area,
      priority,
      lastCleaned: new Date(Date.now() - Math.random() * 86400000), // Random time in the last 24 hours
      utilizationScore,
    };
  });
};

const generateMockSupplyAreas = (): SupplyArea[] => {
  const areas = ['Main Bathroom', 'ER Bathroom', 'Cafeteria Bathroom', 'Staff Bathroom', 'Visitor Bathroom', 'Outpatient Bathroom'];
  return areas.map((area, index) => ({
    id: `supply-${index}`,
    name: area,
    paperTowels: Math.floor(Math.random() * 5),
    soap: Math.floor(Math.random() * 10),
    toiletPaper: Math.floor(Math.random() * 15),
    footTraffic: Math.floor(Math.random() * 1000),
    reorderThreshold: 1500, // Default threshold
  }));
};

const FacilitiesManagement: React.FC = () => {
  const [cleaningAreas, setCleaningAreas] = useState<CleaningArea[]>(generateMockCleaningAreas());
  const [supplyAreas, setSupplyAreas] = useState<SupplyArea[]>(generateMockSupplyAreas());
  const [predictionFootTraffic, setPredictionFootTraffic] = useState<number>(500);

  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoProgress, setVideoProgress] = useState(0);
  const [videoDuration, setVideoDuration] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [videoError, setVideoError] = useState<string | null>(null);

  const handleVideoProgress = (event: React.ChangeEvent<HTMLInputElement>) => {
    const progress = parseFloat(event.target.value);
    setVideoProgress(progress);
    if (videoRef.current && videoDuration > 0) {
      videoRef.current.currentTime = (videoDuration / 100) * progress;
    }
  };

  const updateVideoProgress = () => {
    if (videoRef.current) {
      const progress = (videoRef.current.currentTime / videoRef.current.duration) * 100;
      setVideoProgress(progress);
    }
  };

  const togglePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play().catch(e => {
          console.error("Error playing video:", e);
          setVideoError("Failed to play video. Please try again.");
        });
      }
      setIsPlaying(!isPlaying);
    }
  };

  useEffect(() => {
    const videoElement = videoRef.current;
    if (videoElement) {
      const handlePlay = () => setIsPlaying(true);
      const handlePause = () => setIsPlaying(false);
      const handleEnded = () => setIsPlaying(false);
      const handleError = (e: Event) => {
        console.error("Video error:", e);
        setVideoError("An error occurred while loading the video.");
      };

      videoElement.addEventListener('play', handlePlay);
      videoElement.addEventListener('pause', handlePause);
      videoElement.addEventListener('ended', handleEnded);
      videoElement.addEventListener('error', handleError);

      return () => {
        videoElement.removeEventListener('play', handlePlay);
        videoElement.removeEventListener('pause', handlePause);
        videoElement.removeEventListener('ended', handleEnded);
        videoElement.removeEventListener('error', handleError);
      };
    }
  }, []);

  useEffect(() => {
    // Sort cleaning areas by priority (high first) and then by utilization score (highest first)
    const sortedAreas = [...cleaningAreas].sort((a, b) => {
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority] || b.utilizationScore - a.utilizationScore;
    });
    setCleaningAreas(sortedAreas);
  }, []);

  const getTimeSinceLastCleaned = (lastCleaned: Date): string => {
    const diff = Date.now() - lastCleaned.getTime();
    const hours = Math.floor(diff / 3600000);
    const minutes = Math.floor((diff % 3600000) / 60000);
    return `${hours}h ${minutes}m`;
  };

  const handlePredictionChange = (event: Event, newValue: number | number[]) => {
    setPredictionFootTraffic(newValue as number);
  };

  const calculateSupplies = (footTraffic: number) => {
    return {
      paperTowels: Math.floor(footTraffic / 200),
      soap: Math.floor((footTraffic / 200) * 2),
      toiletPaper: Math.floor((footTraffic / 200) * 3),
    };
  };

  const updatePredictedSupplies = () => {
    const updatedAreas = supplyAreas.map(area => {
      const supplies = calculateSupplies(predictionFootTraffic);
      return { ...area, ...supplies, footTraffic: predictionFootTraffic };
    });
    setSupplyAreas(updatedAreas);
  };

  const handleReorderThresholdChange = (id: string, value: number) => {
    const updatedAreas = supplyAreas.map(area => 
      area.id === id ? { ...area, reorderThreshold: value } : area
    );
    setSupplyAreas(updatedAreas);
  };

  const getStatusColor = (priority: string, utilizationScore: number): string => {
    if (priority === 'high' || utilizationScore > 70) return 'bg-red-100 border-red-500';
    if (priority === 'medium' || utilizationScore > 25) return 'bg-yellow-100 border-yellow-500';
    return 'bg-green-100 border-green-500';
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-green-700">Facilities Management</h2>
      
      {/* Paths Last 24 Hours Video */}
      <div className="bg-white p-6 rounded-lg shadow-md border border-green-500 mb-6">
        <h3 className="text-xl font-semibold mb-4 text-green-700">Paths Last 24 Hours</h3>
        <div className="relative" style={{ paddingBottom: '56.25%' }}> {/* 16:9 aspect ratio */}
          <video
            ref={videoRef}
            className="absolute top-0 left-0 w-full h-full"
            loop
            playsInline
          >
            <source src="/videos/path_renderings.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
        <div className="mt-4 flex items-center">
          <button
            onClick={togglePlayPause}
            className="bg-green-500 text-white px-4 py-2 rounded mr-4"
          >
            {isPlaying ? 'Pause' : 'Play'}
          </button>
          <input
            type="range"
            min="0"
            max="100"
            value={videoProgress}
            onChange={handleVideoProgress}
            className="w-full"
          />
        </div>
        {videoError && (
          <p className="text-red-500 mt-2">{videoError}</p>
        )}
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-md border border-green-500">
        <h3 className="text-xl font-semibold mb-4 text-green-700">Cleaning Schedule Optimizer</h3>
        <List>
          {cleaningAreas.map((area) => (
            <ListItem key={area.id} className={`mb-2 rounded ${getStatusColor(area.priority, area.utilizationScore)}`}>
              <ListItemText
                primary={area.name}
                secondary={
                  <React.Fragment>
                    <Typography component="span" variant="body2" className="text-green-600">
                      Priority: {area.priority} | Utilization: {area.utilizationScore}%
                    </Typography>
                    <br />
                    <Typography component="span" variant="body2" className="text-gray-500">
                      Last cleaned: {getTimeSinceLastCleaned(area.lastCleaned)} ago
                    </Typography>
                  </React.Fragment>
                }
              />
            </ListItem>
          ))}
        </List>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md border border-green-500">
        <h3 className="text-xl font-semibold mb-4 text-green-700">Resource and Supply Manager</h3>
        <Grid container spacing={2}>
          {supplyAreas.map((area) => (
            <Grid item xs={12} sm={6} md={4} key={area.id}>
              <Paper elevation={3} className="p-4">
                <Typography variant="h6" className="mb-2">{area.name}</Typography>
                <Typography variant="body2"><Droplet size={16} className="inline mr-1" /> Soap: {area.soap} L</Typography>
                <Typography variant="body2"><Trash2 size={16} className="inline mr-1" /> Paper Towels: {area.paperTowels} rolls</Typography>
                <Typography variant="body2"><FileText size={16} className="inline mr-1" /> Toilet Paper: {area.toiletPaper} rolls</Typography>
                <Typography variant="body2" className="mt-2">Foot Traffic: {area.footTraffic} paths</Typography>
                <Tooltip title="Set the number of foot traffic paths that trigger a reorder of supplies">
                  <TextField
                    label="Reorder Threshold (paths)"
                    type="number"
                    value={area.reorderThreshold}
                    onChange={(e) => handleReorderThresholdChange(area.id, Number(e.target.value))}
                    fullWidth
                    margin="normal"
                  />
                </Tooltip>
                <Typography variant="body2" className="mt-2">Progress to Reorder:</Typography>
                <LinearProgress 
                  variant="determinate" 
                  value={(area.footTraffic / area.reorderThreshold) * 100} 
                  className="mt-1"
                />
                <Typography variant="body2" className="mt-1">
                  Estimated Reorder Date: {new Date(Date.now() + ((area.reorderThreshold - area.footTraffic) / (area.footTraffic / 7)) * 86400000).toLocaleDateString()}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>

        <div className="mt-6">
          <Typography variant="h6" className="mb-2">Supply Prediction Tool</Typography>
          <Slider
            value={predictionFootTraffic}
            onChange={handlePredictionChange}
            aria-labelledby="foot-traffic-slider"
            valueLabelDisplay="auto"
            step={100}
            marks
            min={0}
            max={2000}
          />
          <Typography>Predicted Foot Traffic: {predictionFootTraffic} paths</Typography>
          <Button 
            variant="contained" 
            color="primary" 
            onClick={updatePredictedSupplies}
            className="mt-2"
          >
            Predict Supplies
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FacilitiesManagement;