import axios from 'axios';

const API_BASE_URL = 'http://localhost:8085/api/stocks';

export const getAllStocks = async () => {
  try {
    const response = await axios.get(API_BASE_URL);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || error.message);
  }
};

export const getStockDetails = async (ticker) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/details?ticker=${ticker}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || error.message);
  }
};

export const addStock = async (newStock) => {
  try {
    const response = await axios.post(API_BASE_URL, { ticker: newStock.ticker });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || error.message);
  }
};

export const updateStock = async (updatedStock) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/${updatedStock.id}`, updatedStock);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || error.message);
  }
};

export const getStockData = async (ticker) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/${ticker}/data`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || error.message);
  }
};

export const deleteStock = async (id) => {
  try {
    await axios.delete(`${API_BASE_URL}/${id}`);
  } catch (error) {
    throw new Error(error.response?.data?.message || error.message);
  }
};

export const refreshPrices = async () => {
  try {
    const response = await axios.get(API_BASE_URL);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || error.message);
  }
};
