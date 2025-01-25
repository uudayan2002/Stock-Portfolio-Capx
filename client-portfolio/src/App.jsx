// Importing required React hooks and Material-UI components
import React, { useState, useEffect, useMemo } from "react";
import {
  ThemeProvider,
  createTheme,
  CssBaseline,
  Container,
  Grid,
  AppBar,
  Toolbar,
  Typography,
  Tabs,
  Tab,
  IconButton,
  Menu,
  MenuItem,
  useMediaQuery,
  Box,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import PortfolioMetrics from "./components/PortfolioMetrics";
import StockForm from "./components/StockForm";
import StockTable from "./components/StockTable";
import Insights from "./components/Insights";
import {
  getAllStocks,
  getStockDetails,
  addStock,
  updateStock,
  deleteStock,
  refreshPrices,
  getStockData, // Function for fetching detailed stock data
} from "./services/apiService";

// Creating a custom dark theme using Material-UI's `createTheme` function
const theme = createTheme({
  palette: {
    mode: "dark", // Dark mode theme
    background: {
      default: "#121212",
      paper: "#1e1e1e",
    },
    text: {
      primary: "#FFFFFF", // Primary text color
      secondary: "#B0B0B0", // Secondary text color
    },
    primary: {
      main: "#BB86FC", // Primary theme color
    },
    secondary: {
      main: "#03DAC5", // Secondary theme color
    },
  },
});

// Main application component
function App() {
  // State variables
  const [stocks, setStocks] = useState([]); // List of stocks
  const [stockToEdit, setStockToEdit] = useState(null); // Stock being edited
  const [extractedDetails, setExtractedDetails] = useState({ stockName: "", buyPrice: "" }); // Extracted stock details
  const [activeTab, setActiveTab] = useState("portfolio"); // Active tab (portfolio or insights)
  const [menuAnchorEl, setMenuAnchorEl] = useState(null); // Anchor for mobile menu
  const [stockData, setStockData] = useState({}); // Data for insights tab
  const isMobile = useMediaQuery(theme.breakpoints.down("sm")); // Detect if the screen size is mobile

  // Handle opening of the mobile menu
  const handleMenuClick = (event) => {
    setMenuAnchorEl(event.currentTarget);
  };

  // Handle closing of the mobile menu and setting the active tab
  const handleMenuClose = (tab) => {
    if (tab) setActiveTab(tab);
    setMenuAnchorEl(null);
  };

  // Fetching all stocks and setting up periodic price updates
  useEffect(() => {
    const fetchStocks = async () => {
      try {
        const data = await getAllStocks(); // API call to fetch stocks
        setStocks(data);
      } catch (error) {
        console.error("Error fetching stocks:", error.message);
      }
    };

    fetchStocks();

    // Setting up a periodic refresh of stock prices every 10 minutes
    const intervalId = setInterval(async () => {
      try {
        const updatedPrices = await refreshPrices();
        setStocks((prevStocks) =>
          prevStocks.map((stock) => {
            const updatedStock = updatedPrices.find((s) => s.ticker === stock.ticker);
            return updatedStock ? { ...stock, currentPrice: updatedStock.currentPrice } : stock;
          })
        );
      } catch (error) {
        console.error("Error refreshing stock prices:", error.message);
      }
    }, 600000); // 10 minutes

    // Cleanup interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  // Fetch details for a specific stock by ticker
  const handleFetchStockDetails = async (ticker) => {
    try {
      const details = await getStockDetails(ticker); // API call to fetch stock details
      setExtractedDetails(details);
    } catch (error) {
      console.error("Error fetching stock details:", error.message);
      setExtractedDetails({ stockName: "", buyPrice: "" });
    }
  };

  // Add a new stock to the portfolio
  const handleAddStock = async (newStock) => {
    try {
      const addedStock = await addStock(newStock); // API call to add stock
      setStocks((prevStocks) => [...prevStocks, addedStock]);
      setExtractedDetails({ stockName: "", buyPrice: "" });
    } catch (error) {
      console.error("Error adding stock:", error.message);
      alert(error.message);
    }
  };

  // Update an existing stock's information
  const handleUpdateStock = async (updatedStock) => {
    try {
      const updated = await updateStock(updatedStock); // API call to update stock
      setStocks((prevStocks) =>
        prevStocks.map((stock) => (stock.id === updatedStock.id ? updated : stock))
      );
      setStockToEdit(null);
      setExtractedDetails({ stockName: "", buyPrice: "" });
    } catch (error) {
      console.error("Error updating stock:", error.message);
      alert(error.message);
    }
  };

  // Delete a stock from the portfolio
  const handleDelete = async (id) => {
    try {
      await deleteStock(id); // API call to delete stock
      setStocks((prevStocks) => prevStocks.filter((stock) => stock.id !== id));
    } catch (error) {
      console.error("Error deleting stock:", error.message);
      alert(error.message);
    }
  };

  // Calculating total portfolio value
  const totalValue = useMemo(
    () => stocks.reduce((sum, stock) => sum + (stock.quantity || 0) * (stock.currentPrice || 0), 0),
    [stocks]
  );

  // Total number of stocks
  const totalStocks = useMemo(() => stocks.length, [stocks]);

  // Calculating average return across all stocks
  const averageReturn = useMemo(
    () =>
      totalStocks > 0
        ? stocks.reduce(
            (sum, stock) =>
              sum + ((stock.currentPrice - stock.buyPrice) / stock.buyPrice) * 100 || 0,
            0
          ) / totalStocks
        : 0,
    [stocks, totalStocks]
  );

  // Fetch stock data for insights tab
  useEffect(() => {
    if (activeTab === "insights") {
      const fetchStockData = async () => {
        try {
          const stockDataPromises = stocks.map((stock) => getStockData(stock.ticker));
          const stockDataResponses = await Promise.all(stockDataPromises);
          const stockDataMap = stockDataResponses.reduce((acc, data, idx) => {
            acc[stocks[idx].ticker] = data;
            return acc;
          }, {});
          setStockData(stockDataMap);
        } catch (error) {
          console.error("Error fetching stock data for insights:", error.message);
        }
      };
      fetchStockData();
    }
  }, [activeTab, stocks]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppBar position="static">
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          {/* App title with responsive layout */}
          <Box sx={{ textAlign: "left", maxWidth: "100%", flexGrow: 0.6 }}>
            <Typography variant="h6" component="div" sx={{ display: { xs: "block", sm: "none" } }}>
              Stock Portfolio
              <br />
              Dashboard
            </Typography>
            <Typography variant="h6" component="div" sx={{ display: { xs: "none", sm: "block" } }}>
              Stock Portfolio Dashboard
            </Typography>
          </Box>
          {/* Mobile menu for small screens */}
          {isMobile ? (
            <>
              <IconButton color="inherit" onClick={handleMenuClick}>
                <MenuIcon />
              </IconButton>
              <Menu
                anchorEl={menuAnchorEl}
                open={Boolean(menuAnchorEl)}
                onClose={() => handleMenuClose()}
              >
                <MenuItem onClick={() => handleMenuClose("portfolio")}>Portfolio</MenuItem>
                <MenuItem onClick={() => handleMenuClose("insights")}>Insights</MenuItem>
              </Menu>
            </>
          ) : (
            // Desktop tabs for navigation
            <Tabs
              value={activeTab}
              onChange={(e, newValue) => setActiveTab(newValue)}
              textColor="inherit"
              TabIndicatorProps={{
                style: { backgroundColor: theme.palette.primary.main, height: "4px" },
              }}
              sx={{
                flexGrow: 1,
                display: "flex",
                justifyContent: "center",
                "& .MuiTab-root": {
                  fontSize: "1rem",
                  fontWeight: "bold",
                },
                "& .Mui-selected": {
                  color: theme.palette.primary.main,
                },
              }}
            >
              <Tab label="Portfolio" value="portfolio" />
              <Tab label="Insights" value="insights" />
            </Tabs>
          )}
        </Toolbar>
      </AppBar>
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        {/* Conditional rendering based on active tab */}
        {activeTab === "portfolio" ? (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <PortfolioMetrics
                totalValue={totalValue}
                totalStocks={totalStocks}
                averageReturn={averageReturn.toFixed(2)}
              />
            </Grid>
            <Grid item xs={12} md={5.5}>
              <StockForm
                stockToEdit={stockToEdit}
                stocks={stocks}
                onAddStock={handleAddStock}
                onUpdateStock={handleUpdateStock}
                onFetchStockDetails={handleFetchStockDetails}
                extractedDetails={extractedDetails}
              />
            </Grid>
            <Grid item xs={12} md={6.5}>
              <StockTable
                stocks={stocks}
                onDelete={handleDelete}
                onEdit={(stock) => setStockToEdit(stock)}
              />
            </Grid>
          </Grid>
        ) : (
          // Insights tab
          <Insights stockData={stockData} stock={stocks} />
        )}
      </Container>
    </ThemeProvider>
  );
}

export default App;
