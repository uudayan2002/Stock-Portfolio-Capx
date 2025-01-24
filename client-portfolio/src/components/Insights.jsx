import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';
import annotationPlugin from 'chartjs-plugin-annotation';
import { Tabs, Tab, Box, FormControlLabel, Checkbox } from '@mui/material';

import { Chart } from 'chart.js';
Chart.register(annotationPlugin);

function Insights({ stockData,stock }) {
  const [selectedStock, setSelectedStock] = useState(null);
  const [showGrid, setShowGrid] = useState(true); // State for grid toggle

  useEffect(() => {
    const tickers = Object.keys(stockData);
    if (tickers.length > 0) {
      setSelectedStock(tickers[0]);
    }
  }, [stockData]);

  if (!selectedStock || !stockData[selectedStock]?.values) {
    return <p>Loading...</p>;
  }

  const selectedStockData = stockData[selectedStock].values;
  const selectedStockObject = stock.find((s) => s.ticker === selectedStock);
  const buyPrice = selectedStockObject?.buyPrice || 0;
  const currentPrice = selectedStockObject?.currentPrice || 0;

  const chartData = {
    labels: selectedStockData.map((item) => item.datetime).reverse(),
    datasets: [
      {
        label: `${selectedStock} Stock Price`,
        data: selectedStockData.map((item) => parseFloat(item.close)).reverse(),
        borderColor: 'rgba(75, 192, 192, 1)',
        fill: false,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false, // Hide the default legend
      },
      annotation: {
        annotations: {
          buyPriceLine: {
            type: 'line',
            yMin: buyPrice, // Draw at the buyPrice value
            yMax: buyPrice, // Keep the line horizontal
            borderColor: 'rgba(255, 99, 132, 1)', // Distinct red color
            borderWidth: 2, // Thickness of the line
            borderDash: [6, 6], // Dashed line for better distinction
            label: {
              display: true,
              content: `Buy Price: ${buyPrice}`, // Display the buy price
              position: 'start', // Position of the label
              color: '#ffffff',
              backgroundColor: 'rgba(255, 99, 132, 0.7)',
              font: {
                size: 12, // Font size for the label
              },
              padding: { top: 7, left: 9 , right:10, bottom:5 }, // Adjust padding for placement outside
              yAdjust: -20, // Adjust vertical position outside (above the graph)
            },
          },
          currentPriceLine: {
            type: 'line',
            yMin: currentPrice, // Draw at the currentPrice value
            yMax: currentPrice, // Keep the line horizontal
            borderColor: 'rgba(75, 192, 192, 1)', // Distinct blue color for current price
            borderWidth: 2, // Thickness of the line
            borderDash: [6, 6], // Dashed line for better distinction
            label: {
              display: true,
              content: `Current Price: ${currentPrice}`, // Display the current price
              position: 'end', // Position of the label
              color: '#ffffff',
              backgroundColor: 'rgba(75, 192, 192, 0.7)', // A lighter color for current price
              font: {
                size: 12, // Font size for the label
              },
              padding: { top: 10, right: 10, left:10, bottom:5 }, // Adjust padding for placement outside
              yAdjust: 20, // Adjust vertical position outside (below the graph)
            },
          },
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: showGrid,
          color: 'rgba(200, 200, 200, 0.5)', // Darker grid lines
          lineWidth: 1, // Thicker grid lines
        },
        ticks: {
          color: 'rgba(200, 200, 200, 0.8)', // Darker tick labels for better visibility
        },
      },
      y: {
        grid: {
          display: showGrid,
          color: 'rgba(200, 200, 200, 0.5)', // Darker grid lines
          lineWidth: 1, // Thicker grid lines
          borderDash: [4, 4], // Dashed grid lines
        },
        ticks: {
          color: 'rgba(200, 200, 200, 0.8)', // Darker tick labels for better visibility
        },
      },
    },
  };
  

  return (
    <div>
      <h1>Stock Insights</h1>

      <Tabs
        value={selectedStock}
        onChange={(e, newValue) => setSelectedStock(newValue)}
        variant="fullWidth"
      >
        {Object.keys(stockData).map((ticker) => (
          <Tab key={ticker} label={ticker} value={ticker} />
        ))}
      </Tabs>

      {/* Checkbox for grid toggle */}
      <FormControlLabel
        control={
          <Checkbox
            checked={showGrid}
            onChange={(e) => setShowGrid(e.target.checked)}
          />
        }
        label="Show Grid"
        sx={{ mt: 2 }}
      />

      <Box mt={2}>
        <Line data={chartData} options={chartOptions} />
      </Box>
    </div>
  );
}

export default Insights;
