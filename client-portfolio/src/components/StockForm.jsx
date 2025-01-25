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
  // State to manage stock form data
  const [stock, setStock] = useState({
    stockName: '',
    ticker: '',
    quantity: '',
    buyPrice: '',
  });

  // State to manage form errors
  const [error, setError] = useState('');

  // State to hold the latest stock added
  const [latestStock, setLatestStock] = useState(null);

  // State to control the visibility of the stock details section after form submission
  const [showDetails, setShowDetails] = useState(false);

  // Prefill the stock form if stockToEdit prop is provided (editing an existing stock)
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

  // Update latestStock state when stocks array changes
  useEffect(() => {
    if (stocks && stocks.length > 0) {
      const stockWithHighestId = stocks.reduce((max, current) =>
        current.id > max.id ? current : max
      );
      setLatestStock(stockWithHighestId); // Set the stock with the highest ID
    }
  }, [stocks]);

  // Handle changes in form input fields
  const handleChange = (e) => {
    const { name, value } = e.target;
    setStock({ ...stock, [name]: value });
    setError(''); // Clear error messages when typing
  };

  // Handle form submission (either adding or updating a stock)
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate if ticker is entered
    if (!stock.ticker) {
      setError('Please enter the Ticker name!');
      return;
    }

    try {
      // Fetch stock details based on the ticker entered
      await onFetchStockDetails(stock.ticker);

      // Prepare the payload for adding or updating the stock
      const payload = {
        id: stockToEdit ? stockToEdit.id : null, // If editing, include the existing stock's ID
        stockName: extractedDetails.stockName || stock.stockName,
        ticker: stock.ticker,
        quantity: parseInt(stock.quantity) || 0,
        buyPrice: parseFloat(extractedDetails.buyPrice || stock.buyPrice) || 0,
      };

      // Add or update the stock based on whether we're editing or adding
      if (stockToEdit) {
        await onUpdateStock(payload);
      } else {
        await onAddStock(payload);
      }

      // After submission, show the stock details section
      setShowDetails(true);

      // Optionally reset the form after adding a new stock
      if (!stockToEdit) {
        setStock({
          stockName: '',
          ticker: '',
          quantity: '',
          buyPrice: '',
        });
      }
    } catch (error) {
      setError('An error occurred while submitting the form.'); // Handle error during submission
    }
  };

  return (
    <Paper sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        {stockToEdit ? 'Edit Stock' : 'Add Stock'}
      </Typography>
      {error && (
        <Typography color="error" variant="body2" gutterBottom>
          {error} {/* Display any form validation or submission errors */}
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
          {stockToEdit ? 'Update Stock' : 'Add Stock'} {/* Button text based on adding or editing */}
        </Button>
      </Box>

      {showDetails && ( // Render this section only after successful form submission
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
