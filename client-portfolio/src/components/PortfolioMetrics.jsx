import React from 'react';
import { Paper, Grid, Typography } from '@mui/material';
import { ArrowUpward, ArrowDownward, Remove } from '@mui/icons-material';

function PortfolioMetrics({ totalValue, totalStocks, averageReturn }) {
  return (
    <Grid container spacing={3}>
      {/* Displaying Total Portfolio Value */}
      <Grid item xs={12} sm={4}>
        <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Typography component="h2" variant="h6" color="primary" gutterBottom>
            Total Portfolio Value
          </Typography>
          {/* Displaying the total value formatted with commas */}
          <Typography component="p" variant="h4">
            ${totalValue.toLocaleString()}
          </Typography>
        </Paper>
      </Grid>

      {/* Displaying Total Stocks */}
      <Grid item xs={12} sm={4}>
        <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Typography component="h2" variant="h6" color="primary" gutterBottom>
            Total Stocks
          </Typography>
          {/* Displaying the total number of stocks */}
          <Typography component="p" variant="h4">
            {totalStocks}
          </Typography>
        </Paper>
      </Grid>

      {/* Displaying Average Return with an icon to indicate positive, negative, or no return */}
      <Grid item xs={12} sm={4}>
        <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Typography component="h2" variant="h6" color="primary" gutterBottom>
            Average Return
          </Typography>
          <Typography
            component="p"
            variant="h4"
            sx={{
              display: 'flex',
              alignItems: 'center',
              color: averageReturn == 0 ? '#808080' : averageReturn > 0 ? '#33CC33' : '#FF6666', // Color change based on return
            }}
          >
            {/* Displaying the average return with a percentage sign */}
            {averageReturn}%
            
            {/* Displaying an up arrow for positive return, down arrow for negative return, and a remove icon for zero return */}
            {averageReturn > 0 ? (
              <ArrowUpward fontSize="small" sx={{ ml: 0.5 }} />
            ) : averageReturn < 0 ? (
              <ArrowDownward fontSize="small" sx={{ ml: 0.5 }} />
            ) : (
              <Remove fontSize="inherit" sx={{ ml: 0.5 }} />
            )}
          </Typography>
        </Paper>
      </Grid>
    </Grid>
  );
}

export default PortfolioMetrics;
