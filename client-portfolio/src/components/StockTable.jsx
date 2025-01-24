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
import { ArrowUpward, ArrowDownward, MoreVert,Remove } from '@mui/icons-material';

function StockTable({ stocks, onDelete, onEdit, isLoading }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedStock, setSelectedStock] = useState(null);

  const handleMenuOpen = (event, stock) => {
    setAnchorEl(event.currentTarget);
    setSelectedStock(stock);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedStock(null);
  };

  const handleEdit = () => {
    if (selectedStock) {
      onEdit(selectedStock);
    }
    handleMenuClose();
  };

  const handleDelete = () => {
    if (
      selectedStock &&
      window.confirm(`Are you sure you want to delete ${selectedStock.stockName}?`)
    ) {
      onDelete(selectedStock.id);
    }
    handleMenuClose();
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
                stocks.map((stock) => (
                  <TableRow key={stock.id}>
                    <TableCell>{stock.stockName}</TableCell>
                    <TableCell>{stock.ticker}</TableCell>
                    <TableCell>{stock.quantity}</TableCell>
                    <TableCell>
                      {new Intl.NumberFormat('en-US').format(stock.buyPrice)}
                    </TableCell>
                    <TableCell>
                    <Typography
                      variant="body2"
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        color: stock.currentPrice === stock.buyPrice
                        ? '#808080'
                        : stock.currentPrice > stock.buyPrice
                        ? '#33CC33'
                        : '#FF6666',
                      }}
                    >
                      {new Intl.NumberFormat('en-US').format(stock.currentPrice)}
                      {stock.currentPrice > stock.buyPrice ? (
                        <ArrowUpward fontSize="small" sx={{ ml: 0.5 }} />
                        ) : stock.currentPrice < stock.buyPrice ? (
                        <ArrowDownward fontSize="small" sx={{ ml: 0.5 }} />
                        ) : (
                        <Remove fontSize="inherit" sx={{ ml: 0.5 }} />
                      )}
                    </Typography>

                    </TableCell>
                    <TableCell>
                      <IconButton
                        onClick={(event) => handleMenuOpen(event, stock)}
                      >
                        <MoreVert />
                      </IconButton>
                      <Menu
                        anchorEl={anchorEl}
                        open={Boolean(anchorEl) && selectedStock?.id === stock.id}
                        onClose={handleMenuClose}
                      >
                        <MenuItem onClick={handleEdit}>Edit</MenuItem>
                        <MenuItem onClick={handleDelete}>Delete</MenuItem>
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
