# Sensor Data Visualizer Developer Guide

This guide provides information for team members who want to understand, modify, or extend the Sensor Data Visualizer.

## Project Structure

The entire application is contained in a single HTML file (`standalone-sensor-visualizer.html`) for simplicity. The file contains HTML, CSS (in a <style> tag), and JavaScript (in a <script> tag).

## Key Components

1. Data Loading and Parsing
2. Visualization Rendering
3. Playback Controls
4. Export Functions
5. Annotation System
6. Filtering
7. Visualization Modes

## Modifying the Visualizer

### Adding a New Visualization Mode

1. Add a new option to the visualization mode select element in the HTML.
2. Create a new drawing function (e.g., `drawNewMode(data)`).
3. Add a case for the new mode in the `drawFrame` function's switch statement.

### Extending Data Parsing

Modify the `parseData` function to handle new data formats or extract additional information from the log files.

### Adding New Controls

1. Add new HTML elements for the controls.
2. Create corresponding JavaScript functions to handle the control actions.
3. Add event listeners to connect the HTML elements with the JavaScript functions.

## Best Practices

1. Comment thoroughly, especially for complex algorithms.
2. Use meaningful variable and function names.
3. Provide feedback.
4. Optimize performance for large datasets.

## Testing

Currently, the project doesn't have automated tests. We could add unit tests for critical functions and integration tests for the overall functionality.

## Future Development Ideas

1. Modularize the code into separate files for better organization.
2. Implement a build process to minify and bundle the application.
3. Add support for real-time data streaming.
4. Develop a backend API for data storage and retrieval.
5. More detailed data descriptions
6. Frame Jumping
7. Save/Load State for allowing us to save current visualization state and load it later