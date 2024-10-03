# Sensor Data Visualizer User Guide

## Table of Contents
1. Introduction
2. Getting Started
3. User Interface
4. Features
   4.1. Data Loading
   4.2. Playback Controls
   4.3. Export Functions
   4.4. Annotation Tools
   4.5. Filtering
   4.6. Visualization Modes
5. Troubleshooting
6. Future Enhancements

## 1. Introduction

The Sensor Data Visualizer is a web-based tool designed to visualize and analyze sensor data from hardware sensors. It provides an interactive interface for playing back sensor data, visualizing it in various modes, and performing basic analysis tasks.

## 2. Getting Started

To use the Sensor Data Visualizer:
1. Clone the repository from Bitbucket.
2. Open the `standalone-sensor-visualizer.html` file in a web browser (Chrome, Firefox, Safari, or Edge recommended).
3. Use the file input to load the sensor data log file. 

## 3. User Interface

The user interface consists of several sections:

- File input (not shown in the HTML snippet)
- Visualizer area (main canvas)
- Playback controls
- Export controls
- Annotation controls
- Filter controls
- Visualization mode selector
- Frame information display
- Debug information area
- Raw data display

## 4. Features

### 4.1. Data Loading

The tool accepts log files containing sensor data. The data loading process is handled by JavaScript, parsing the log file and creating frame objects for visualization.

```javascript
function handleFileSelect(event) {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = function(e) {
        const content = e.target.result;
        frames = parseData(content);
        initializeVisualization();
    };

    reader.readAsText(file);
}

function parseData(content) {
    return content.split('\n')
        .map(line => {
            const match = line.match(/\{.*\}/);
            if (match) {
                try {
                    return JSON.parse(match[0]);
                } catch (error) {
                    console.error("Error parsing JSON:", error);
                    return null;
                }
            }
            return null;
        })
        .filter(frame => frame !== null);
};
```

### 4.2. Playback Controls

The playback controls allow users to:
- Play/pause the visualization
- Step forward/backward through frames
- Reset to the first frame
- Adjust playback speed

```javascript
function togglePlayPause() {
    isPlaying = !isPlaying;
    if (isPlaying) {
        playAnimation();
    } else {
        cancelAnimationFrame(animationId);
    }
}

function playAnimation() {
    if (isPlaying) {
        stepForward();
        animationId = requestAnimationFrame(playAnimation);
    }
}

function stepForward() {
    currentFrameIndex = (currentFrameIndex + 1) % frames.length;
    drawFrame(frames[currentFrameIndex]);
}

function stepBackward() {
    currentFrameIndex = (currentFrameIndex - 1 + frames.length) % frames.length;
    drawFrame(frames[currentFrameIndex]);
}

function reset() {
    currentFrameIndex = 0;
    drawFrame(frames[currentFrameIndex]);
}

function updateSpeed() {
    playbackSpeed = parseFloat(speedControl.value);
}
```



### 4.3. Export Functions

The tool allows exporting of:
- The current frame as an image
- The entire dataset as a CSV file

```javascript
function exportImage() {
    const link = document.createElement('a');
    link.download = `frame-${currentFrameIndex}.png`;
    link.href = canvas.toDataURL();
    link.click();
}

function exportCSV() {
    let csv = 'data:text/csv;charset=utf-8,';
    // Add headers and data rows
    const link = document.createElement('a');
    link.download = 'sensor_data.csv';
    link.href = encodeURI(csv);
    link.click();
}
```

### 4.4. Annotation Tools

Users can add and clear annotations on specific frames. These annotations can be used to mark points of interest in the data.

```javascript
let annotations = {};

function addAnnotation() {
    const text = prompt('Enter annotation:');
    if (text) {
        if (!annotations[currentFrameIndex]) {
            annotations[currentFrameIndex] = [];
        }
        annotations[currentFrameIndex].push({ x: mouseX, y: mouseY, text });
        drawFrame(frames[currentFrameIndex]);
    }
}

function clearAnnotations() {
    annotations = {};
    drawFrame(frames[currentFrameIndex]);
}

function drawAnnotations() {
    if (annotations[currentFrameIndex]) {
        annotations[currentFrameIndex].forEach(ann => {
            ctx.fillText(ann.text, ann.x, ann.y);
        });
    }
}
```


### 4.5. Filtering

An "activation filter" to allow choosing between showing:

1) only activated sensors (1s)
2) all data 
3) only non-activated sensors (0s). 
This filtering helps in identifying patterns of activation, isolating specific events, or focusing on areas of inactivity.

```javascript
function applyThresholdFilter(data, threshold) {
    return data.map(row => row.map(value => value >= threshold ? value : 0));
}

function updateThreshold() {
    threshold = parseFloat(thresholdInput.value);
    drawFrame(frames[currentFrameIndex]);
}
```


### 4.6. Visualization Modes

The tool supports multiple visualization modes:
- Default: Basic visualization of sensor data
- Heatmap: Color-coded representation of sensor intensities
- Contour: Contour lines representing sensor activation levels

```javascript
function drawFrame(frame) {
    const { data } = frame;
    const filteredData = applyThresholdFilter(data, threshold);

    switch (visualizationMode) {
        case 'default':
            drawDefault(filteredData);
            break;
        case 'heatmap':
            drawHeatmap(filteredData);
            break;
        case 'contour':
            drawContour(filteredData);
            break;
    }

    drawAnnotations();
}

function drawDefault(data) {
    // Implementation of default visualization
}

function drawHeatmap(data) {
    // Implementation of heatmap visualization
}

function drawContour(data) {
    // Implementation of contour visualization
}
```

### 6. Toubleshooting

Common issues and their solutions:

### 6.1. Data not loading

- Ensure the log file format matches the expected format.
- Check that the file is not too large for your browser.
- Verify that the file is properly formatted JSON within log entries.

### 6.2. Visualization not appearing

- Check the browser console for JavaScript errors.
- Ensure that the canvas element is properly sized and visible.
- Verift that the frame data contains valid sensor readings.

### 6.3. Playback not working or frozen

- Confirm that the `frames` array is properly populated with data.
- Check that the `playAnimationFrame` is supported in your browser.
- Ensure that `requestAnimationFrame` is supported in your browser.

### 6.4. Export function failing

- Verify that your browser supports the `download` attribute for anchor tags.

### 6.5. Annotations not showing

- Ensure that `drawAnnotations` function is being called in the render loop.
- Check that the annotations are being stored in the correct format.

### 6.6. Filtering not effective

- Verify that the threshold value is being properly updated and applied.
- Ensure that `applyThresholdFilter` functions is being called before rendering.
