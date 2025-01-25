import React, { useState } from 'react';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  IconButton,
  Menu,
  MenuItem
} from '@mui/material';
import { ArrowUpward, ArrowDownward, MoreVert, Remove } from '@mui/icons-material';

function StockTable({ stocks, onDelete, onEdit, isLoading }) {
  // State to manage the anchor element for the menu
  const [anchorEl, setAnchorEl] = useState(null);
  // State to keep track of the selected stock for actions
  const [selectedStock, setSelectedStock] = useState(null);

  // Handle the opening of the menu, with the stock passed in for actions
  const handleMenuOpen = (event, stock) => {
    setAnchorEl(event.currentTarget); // Set the anchor for the menu
    setSelectedStock(stock); // Set the selected stock
  };

  // Close the menu
  const handleMenuClose = () => {
    setAnchorEl(null); // Clear the anchor element
    setSelectedStock(null); // Clear the selected stock
  };

  // Handle the edit action for the selected stock
  const handleEdit = () => {
    if (selectedStock) {
      onEdit(selectedStock); // Call the passed in onEdit handler with selected stock
    }
    handleMenuClose(); // Close the menu after edit action
  };

  // Handle the delete action for the selected stock
  const handleDelete = () => {
    if (
      selectedStock &&
      window.confirm(`Are you sure you want to delete ${selectedStock.stockName}?`) // Confirmation before deleting
    ) {
      onDelete(selectedStock.id); // Call the passed in onDelete handler with stock ID
    }
    handleMenuClose(); // Close the menu after delete action
  };

  return (
    <Paper sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        Current Holdings
      </Typography>
      {isLoading ? (
        <Typography variant="body1" color="textSecondary" align="center">
          Loading stocks...
        </Typography>
      ) : (
        <TableContainer sx={{ overflowX: 'auto', width: '100%', maxHeight: '400px' }}>
          <Table aria-label="stock table">
            <TableHead>
              <TableRow>
                <TableCell>Stock Name</TableCell>
                <TableCell>Ticker</TableCell>
                <TableCell>Quantity</TableCell>
                <TableCell>Buy Price ($)</TableCell>
                <TableCell>Current Price ($)</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {stocks.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    <Typography variant="body1" color="textSecondary">
                      No stocks available. Please add some stocks.
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                // Map through the stocks and display each stock in a table row
                stocks.map((stock) => (
                  <TableRow key={stock.id}>
                    <TableCell>{stock.stockName}</TableCell>
                    <TableCell>{stock.ticker}</TableCell>
                    <TableCell>{stock.quantity}</TableCell>
                    <TableCell>
                      {new Intl.NumberFormat('en-US').format(stock.buyPrice)} // Format buy price
                    </TableCell>
                    <TableCell>
                      <Typography
                        variant="body2"
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          // Set color based on price change
                          color: stock.currentPrice === stock.buyPrice
                            ? '#808080' // Grey if price is the same
                            : stock.currentPrice > stock.buyPrice
                            ? '#33CC33' // Green if price is higher
                            : '#FF6666', // Red if price is lower
                        }}
                      >
                        {new Intl.NumberFormat('en-US').format(stock.currentPrice)} {/* Format current price */}
                        {stock.currentPrice > stock.buyPrice ? (
                          <ArrowUpward fontSize="small" sx={{ ml: 0.5 }} /> // Upward arrow for price increase
                        ) : stock.currentPrice < stock.buyPrice ? (
                          <ArrowDownward fontSize="small" sx={{ ml: 0.5 }} /> // Downward arrow for price decrease
                        ) : (
                          <Remove fontSize="inherit" sx={{ ml: 0.5 }} /> // No change indicator
                        )}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <IconButton
                        onClick={(event) => handleMenuOpen(event, stock)} // Open menu on click
                      >
                        <MoreVert /> {/* More options icon */}
                      </IconButton>
                      <Menu
                        anchorEl={anchorEl}
                        open={Boolean(anchorEl) && selectedStock?.id === stock.id} // Check if the menu should be open
                        onClose={handleMenuClose} // Close menu
                      >
                        <MenuItem onClick={handleEdit}>Edit</MenuItem> {/* Edit menu item */}
                        <MenuItem onClick={handleDelete}>Delete</MenuItem> {/* Delete menu item */}
                      </Menu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Paper>
  );
}

export default StockTable;
