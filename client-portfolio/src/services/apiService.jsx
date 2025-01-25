import axios from 'axios';

// Define the base URL for API requests
const API_BASE_URL = 'http://localhost:8085/api/stocks';

/**
 * Fetches all stocks from the API.
 * @returns {Promise<Array>} - Returns a promise that resolves to a list of all stocks.
 */
export const getAllStocks = async () => {
  try {
    const response = await axios.get(API_BASE_URL); // Sends GET request to fetch all stocks
    return response.data; // Returns the data (list of stocks) from the response
  } catch (error) {
    throw new Error(error.response?.data?.message || error.message); // Handles any errors that occur during the request
  }
};

/**
 * Fetches detailed information for a specific stock using its ticker symbol.
 * @param {string} ticker - The ticker symbol of the stock.
 * @returns {Promise<Object>} - Returns a promise that resolves to the stock's details.
 */
export const getStockDetails = async (ticker) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/details?ticker=${ticker}`); // Sends GET request to fetch details of a specific stock by ticker
    return response.data; // Returns the stock details from the response
  } catch (error) {
    throw new Error(error.response?.data?.message || error.message); // Handles any errors that occur during the request
  }
};

/**
 * Adds a new stock to the portfolio.
 * @param {Object} newStock - The stock to be added, with at least a ticker property.
 * @returns {Promise<Object>} - Returns a promise that resolves to the added stock.
 */
export const addStock = async (newStock) => {
  try {
    const response = await axios.post(API_BASE_URL, { ticker: newStock.ticker }); // Sends POST request to add a new stock
    return response.data; // Returns the added stock from the response
  } catch (error) {
    throw new Error(error.response?.data?.message || error.message); // Handles any errors that occur during the request
  }
};

/**
 * Updates an existing stock's information.
 * @param {Object} updatedStock - The stock with updated information, including its ID.
 * @returns {Promise<Object>} - Returns a promise that resolves to the updated stock.
 */
export const updateStock = async (updatedStock) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/${updatedStock.id}`, updatedStock); // Sends PUT request to update stock by ID
    return response.data; // Returns the updated stock from the response
  } catch (error) {
    throw new Error(error.response?.data?.message || error.message); // Handles any errors that occur during the request
  }
};

/**
 * Fetches additional data for a specific stock using its ticker symbol.
 * @param {string} ticker - The ticker symbol of the stock.
 * @returns {Promise<Object>} - Returns a promise that resolves to the additional stock data.
 */
export const getStockData = async (ticker) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/${ticker}/data`); // Sends GET request to fetch additional data for a specific stock
    return response.data; // Returns the additional stock data from the response
  } catch (error) {
    throw new Error(error.response?.data?.message || error.message); // Handles any errors that occur during the request
  }
};

/**
 * Deletes a stock from the portfolio by its ID.
 * @param {string} id - The ID of the stock to be deleted.
 */
export const deleteStock = async (id) => {
  try {
    await axios.delete(`${API_BASE_URL}/${id}`); // Sends DELETE request to remove stock by ID
  } catch (error) {
    throw new Error(error.response?.data?.message || error.message); // Handles any errors that occur during the request
  }
};

/**
 * Refreshes the stock prices by fetching all stocks again from the API.
 * @returns {Promise<Array>} - Returns a promise that resolves to the updated list of stocks with refreshed prices.
 */
export const refreshPrices = async () => {
  try {
    const response = await axios.get(API_BASE_URL); // Sends GET request to fetch updated stock prices
    return response.data; // Returns the updated stock prices from the response
  } catch (error) {
    throw new Error(error.response?.data?.message || error.message); // Handles any errors that occur during the request
  }
};
