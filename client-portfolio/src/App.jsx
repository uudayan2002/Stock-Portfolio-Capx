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
  getStockData, // Added import for fetching stock data
} from "./services/apiService";

const theme = createTheme({
  palette: {
    mode: "dark",
    background: {
      default: "#121212",
      paper: "#1e1e1e",
    },
    text: {
      primary: "#FFFFFF",
      secondary: "#B0B0B0",
    },
    primary: {
      main: "#BB86FC",
    },
    secondary: {
      main: "#03DAC5",
    },
  },
});

function App() {
  const [stocks, setStocks] = useState([]);
  const [stockToEdit, setStockToEdit] = useState(null);
  const [extractedDetails, setExtractedDetails] = useState({ stockName: "", buyPrice: "" });
  const [activeTab, setActiveTab] = useState("portfolio");
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const [stockData, setStockData] = useState({}); // State for stock data
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const handleMenuClick = (event) => {
    setMenuAnchorEl(event.currentTarget);
  };

  const handleMenuClose = (tab) => {
    if (tab) setActiveTab(tab);
    setMenuAnchorEl(null);
  };

  useEffect(() => {
    const fetchStocks = async () => {
      try {
        const data = await getAllStocks();
        setStocks(data);
      } catch (error) {
        console.error("Error fetching stocks:", error.message);
      }
    };

    fetchStocks();

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
    }, 600000);

    return () => clearInterval(intervalId);
  }, []);

  const handleFetchStockDetails = async (ticker) => {
    try {
      const details = await getStockDetails(ticker);
      setExtractedDetails(details);
    } catch (error) {
      console.error('Error fetching stock details:', error.message);
      setExtractedDetails({ stockName: '', buyPrice: '' });
    }
  };

  const handleAddStock = async (newStock) => {
    try {
      const addedStock = await addStock(newStock);
      setStocks((prevStocks) => [...prevStocks, addedStock]);
      setExtractedDetails({ stockName: '', buyPrice: '' });
    } catch (error) {
      console.error('Error adding stock:', error.message);
      alert(error.message);
    }
  };

  const handleUpdateStock = async (updatedStock) => {
    try {
      const updated = await updateStock(updatedStock);
      setStocks((prevStocks) =>
        prevStocks.map((stock) => (stock.id === updatedStock.id ? updated : stock))
      );
      setStockToEdit(null);
      setExtractedDetails({ stockName: '', buyPrice: '' });
    } catch (error) {
      console.error('Error updating stock:', error.message);
      alert(error.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteStock(id);
      setStocks((prevStocks) => prevStocks.filter((stock) => stock.id !== id));
    } catch (error) {
      console.error('Error deleting stock:', error.message);
      alert(error.message);
    }
  };

  const totalValue = useMemo(
    () => stocks.reduce((sum, stock) => sum + (stock.quantity || 0) * (stock.currentPrice || 0), 0),
    [stocks]
  );

  const totalStocks = useMemo(() => stocks.length, [stocks]);

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

  // Fetch stock data for selected stocks when tab changes to "insights"
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
          // console.log("Fetched Stock Data:", stockDataMap);
          
          setStockData(stockDataMap);
          
        } catch (error) {
          console.error('Error fetching stock data for insights:', error.message);
        }
      };
      fetchStockData();
    }
  }, [activeTab, stocks]);
  console.log("Stock Data State in App.jsx Before Render:", stockData);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppBar position="static">
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          <Box
            sx={{
              textAlign: "left",
              maxWidth: "100%",
              flexGrow: 0.6,
            }}
          >
            <Typography
              variant="h6"
              component="div"
              sx={{
                display: { xs: "block", sm: "none" },
              }}
            >
              Stock Portfolio
              <br />
              Dashboard
            </Typography>
            <Typography
              variant="h6"
              component="div"
              sx={{
                display: { xs: "none", sm: "block" },
              }}
            >
              Stock Portfolio Dashboard
            </Typography>
          </Box>
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
          <Insights stockData={stockData} stock={stocks} />
        )}
      </Container>
    </ThemeProvider>
  );
}

export default App;
