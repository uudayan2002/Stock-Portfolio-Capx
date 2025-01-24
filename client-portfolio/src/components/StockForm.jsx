import React, { useState, useEffect } from 'react';
import { Paper, Typography, TextField, Button, Box } from '@mui/material';

function StockForm({
  stockToEdit,
  onAddStock,
  onUpdateStock,
  onFetchStockDetails,
  extractedDetails,
  isLoading,
  stocks,
}) {
  const [stock, setStock] = useState({
    stockName: '',
    ticker: '',
    quantity: '',
    buyPrice: '',
  });

  const [error, setError] = useState('');
  const [latestStock, setLatestStock] = useState(null);
  const [showDetails, setShowDetails] = useState(false); // New state to control visibility

  // Prefill stock form if editing
  useEffect(() => {
    if (stockToEdit) {
      setStock({
        stockName: stockToEdit.stockName,
        ticker: stockToEdit.ticker,
        quantity: stockToEdit.quantity.toString(),
        buyPrice: stockToEdit.buyPrice.toString(),
      });
    }
  }, [stockToEdit]);

  // Update latest stock when stocks array changes
  useEffect(() => {
    if (stocks && stocks.length > 0) {
      const stockWithHighestId = stocks.reduce((max, current) =>
        current.id > max.id ? current : max
      );
      setLatestStock(stockWithHighestId);
    }
  }, [stocks]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setStock({ ...stock, [name]: value });
    setError(''); // Clear errors when typing
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate required fields
    if (!stock.ticker) {
      setError('Please enter the Ticker name!');
      return;
    }

    try {
      // Fetch stock details first
      await onFetchStockDetails(stock.ticker);

      const payload = {
        id: stockToEdit ? stockToEdit.id : null,
        stockName: extractedDetails.stockName || stock.stockName,
        ticker: stock.ticker,
        quantity: parseInt(stock.quantity) || 0,
        buyPrice: parseFloat(extractedDetails.buyPrice || stock.buyPrice) || 0,
      };

      // Add or update stock
      if (stockToEdit) {
        await onUpdateStock(payload);
      } else {
        await onAddStock(payload);
      }

      // Show the details section
      setShowDetails(true);

      // Optionally reset form after submission
      if (!stockToEdit) {
        setStock({
          stockName: '',
          ticker: '',
          quantity: '',
          buyPrice: '',
        });
      }
    } catch (error) {
      setError('An error occurred while submitting the form.');
    }
  };

  return (
    <Paper sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        {stockToEdit ? 'Edit Stock' : 'Add Stock'}
      </Typography>
      {error && (
        <Typography color="error" variant="body2" gutterBottom>
          {error}
        </Typography>
      )}
      <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
        <TextField
          margin="normal"
          required
          fullWidth
          id="ticker"
          label="Ticker"
          name="ticker"
          value={stock.ticker}
          onChange={handleChange}
        />
        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
        >
          {stockToEdit ? 'Update Stock' : 'Add Stock'}
        </Button>
      </Box>

      {showDetails && ( // Render this section only after submit
        <Box sx={{ mt: 2 }}>
          {isLoading ? (
            <Typography variant="body1" color="textSecondary" align="center">
              Loading latest stock details...
            </Typography>
          ) : latestStock ? (
            <>
              <Typography variant="body1">
                <strong>Stock Name:</strong> {latestStock.stockName || 'N/A'}
              </Typography>
              <Typography variant="body1">
                <strong>Buy Price:</strong>{' '}
                {new Intl.NumberFormat('en-US', {
                  style: 'currency',
                  currency: 'USD',
                }).format(latestStock.buyPrice || 0)}
              </Typography>
              <Typography variant="body1">
                <strong>Quantity:</strong> {latestStock.quantity || 'N/A'}
              </Typography>
            </>
          ) : (
            <Typography variant="body1">No stocks available.</Typography>
          )}
        </Box>
      )}
    </Paper>
  );
}

export default StockForm;
