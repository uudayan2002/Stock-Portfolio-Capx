import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto'; // Importing Chart.js for rendering charts
import annotationPlugin from 'chartjs-plugin-annotation'; // Importing chart annotation plugin
import { Tabs, Tab, Box, FormControlLabel, Checkbox } from '@mui/material'; // Material UI components

import { Chart } from 'chart.js';
Chart.register(annotationPlugin); // Registering annotation plugin with Chart.js

function Insights({ stockData, stock }) {
  const [selectedStock, setSelectedStock] = useState(null); // State for selected stock
  const [showGrid, setShowGrid] = useState(true); // State for toggling grid visibility

  // useEffect hook to initialize selected stock when stock data is available
  useEffect(() => {
    const tickers = Object.keys(stockData); // Extract stock tickers from stockData
    if (tickers.length > 0) {
      setSelectedStock(tickers[0]); // Set the first stock as selected
    }
  }, [stockData]);

  // If no stock or stock data is available, show loading message
  if (!selectedStock || !stockData[selectedStock]?.values) {
    return <p>Loading...</p>;
  }

  const selectedStockData = stockData[selectedStock].values; // Get stock data for selected stock
  const selectedStockObject = stock.find((s) => s.ticker === selectedStock); // Find selected stock object
  const buyPrice = selectedStockObject?.buyPrice || 0; // Get buy price for the selected stock
  const currentPrice = selectedStockObject?.currentPrice || 0; // Get current price for the selected stock

  // Chart data configuration
  const chartData = {
    labels: selectedStockData.map((item) => item.datetime).reverse(), // Reversing datetime to display in chronological order
    datasets: [
      {
        label: `${selectedStock} Stock Price`, // Label for stock price dataset
        data: selectedStockData.map((item) => parseFloat(item.close)).reverse(), // Reversing and parsing close prices
        borderColor: 'rgba(75, 192, 192, 1)', // Line color for stock price
        fill: false, // Don't fill the area under the line
      },
    ],
  };

  // Chart options configuration
  const chartOptions = {
    responsive: true, // Make chart responsive
    plugins: {
      legend: {
        display: false, // Hide the default legend
      },
      annotation: {
        annotations: {
          buyPriceLine: {
            type: 'line', // Draw a line
            yMin: buyPrice, // Set line at buy price
            yMax: buyPrice, // Keep the line horizontal
            borderColor: 'rgba(255, 99, 132, 1)', // Red color for buy price line
            borderWidth: 2, // Line thickness
            borderDash: [6, 6], // Dashed line
            label: {
              display: true, // Show label for the line
              content: `Buy Price: ${buyPrice}`, // Label content with buy price
              position: 'start', // Position label at the start of the line
              color: '#ffffff', // White label color
              backgroundColor: 'rgba(255, 99, 132, 0.7)', // Background color for label
              font: {
                size: 12, // Font size for the label
              },
              padding: { top: 10, left: 10, right: 10, bottom: 5 }, // Padding for label placement
              yAdjust: -20, // Adjust label vertical position
            },
          },
          currentPriceLine: {
            type: 'line', // Draw a line
            yMin: currentPrice, // Set line at current price
            yMax: currentPrice, // Keep the line horizontal
            borderColor: 'rgba(75, 192, 192, 1)', // Blue color for current price line
            borderWidth: 2, // Line thickness
            borderDash: [6, 6], // Dashed line
            label: {
              display: true, // Show label for the line
              content: `Current Price: ${currentPrice}`, // Label content with current price
              position: 'end', // Position label at the end of the line
              color: '#ffffff', // White label color
              backgroundColor: 'rgba(75, 192, 192, 0.7)', // Background color for label
              font: {
                size: 12, // Font size for the label
              },
              padding: { top: 10, right: 10, left: 10, bottom: 5 }, // Padding for label placement
              yAdjust: 20, // Adjust label vertical position
            },
          },
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: showGrid, // Control grid visibility
          color: 'rgba(200, 200, 200, 0.5)', // Grid line color
          lineWidth: 1, // Grid line width
        },
        ticks: {
          color: 'rgba(200, 200, 200, 0.8)', // Tick color on x-axis
        },
      },
      y: {
        grid: {
          display: showGrid, // Control grid visibility
          color: 'rgba(200, 200, 200, 0.5)', // Grid line color
          lineWidth: 1, // Grid line width
          borderDash: [4, 4], // Dashed grid lines
        },
        ticks: {
          color: 'rgba(200, 200, 200, 0.8)', // Tick color on y-axis
        },
      },
    },
  };

  return (
    <div>
      <h1>Stock Insights</h1>

      {/* Tabs for selecting different stocks */}
      <Tabs
        value={selectedStock}
        onChange={(e, newValue) => setSelectedStock(newValue)} // Change selected stock on tab change
        variant="fullWidth"
      >
        {Object.keys(stockData).map((ticker) => (
          <Tab key={ticker} label={ticker} value={ticker} /> // Create a tab for each stock ticker
        ))}
      </Tabs>

      {/* Checkbox for toggling grid visibility */}
      <FormControlLabel
        control={
          <Checkbox
            checked={showGrid}
            onChange={(e) => setShowGrid(e.target.checked)} // Toggle grid visibility on change
          />
        }
        label="Show Grid" // Label for the checkbox
        sx={{ mt: 2 }} // Margin top for spacing
      />

      {/* Render chart with selected stock data */}
      <Box mt={2}>
        <Line data={chartData} options={chartOptions} /> {/* Line chart rendering with data and options */}
      </Box>
    </div>
  );
}

export default Insights;
