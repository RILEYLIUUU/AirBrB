import React from 'react';
import Box from '@mui/material/Box';
import Plot from 'react-plotly.js';

const ProfitGraph = ({ xAxis, yAxis }) => {
  // set coloum text properties
  const profitText = Array.isArray(yAxis)
    ? yAxis.map((profit) => `$${(profit || 0).toFixed(2)}`)
    : [];

  return (
    <Box
      sx={{
        width: '100%',
        ccheight: '100%',
        padding: '20px',
        borderRadius: '12px',
        boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)',
        backgroundColor: '#ffffff',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Plot
        data={[
          {
            x: xAxis,
            y: yAxis,
            type: 'bar',
            text: profitText, // Display profit values on the bars
            marker: { color: '#4CAF50' }, // Change color to a vibrant green
          },
        ]}
        layout={{
          autosize: true,
          title: {
            text: 'Your Listing Profits',
            font: {
              size: 20,
              family: 'Arial, sans-serif',
              color: '#333',
              weight: 1000,
            },
          },
          xaxis: {
            title: 'Days Ago',
            showgrid: false,
            showline: true,
            linecolor: '#ddd',
            linewidth: 2,
            tickfont: {
              size: 12,
              color: '#555',
              weight: 'bold',
              family: 'Arial, sans-serif',
            },
          },
          yaxis: {
            title: 'Total Profit ($)',
            showgrid: true,
            gridcolor: '#f0f0f0', // Light gray grid lines
            showline: true,
            linecolor: '#ddd',
            linewidth: 2,
            tickfont: {
              size: 12,
              color: '#555',
            },
          },
          paper_bgcolor: '#ffffff', // White background color
        }}
        useResizeHandler={true}
        style={{ width: '100%', height: '100%' }}
      />
    </Box>
  );
};

export default ProfitGraph;
