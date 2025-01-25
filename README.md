# Stock Portfolio App

## Overview
The **Stock Portfolio App** is a full-stack application designed to help users manage and track their stock investments efficiently. It consists of a **backend** built with Java (Spring Boot) and a **frontend** built with React (Vite). The app provides users with tools to manage their stock portfolios, view insights with performance graphs, and fetch live stock data from the **Twelve Data API**.

### Features
- **Backend:**
  - RESTful APIs for managing stock entities (CRUD operations).
  - Integration with the Twelve Data API to fetch live stock prices.
  - Scheduled tasks for periodic stock price updates.
  - Exception handling for a seamless user experience.

- **Frontend:**
  - Displays stock holdings in a clean, interactive table.
  - Insights tab with visualized stock performance (graphs).
  - Portfolio metrics summary.
  - Stock management forms for adding or editing stock data.

---

## Backend

### Prerequisites
To run the backend locally, ensure you have:
- **Docker** and **Docker Compose** installed on your system.

### Running the Backend
```bash
# Clone the repository
git clone https://github.com/your-username/stock-portfolio-app.git
cd stock-portfolio-app/server-portfolio

# Update the configuration:
# Ensure your `application.yml` contains the correct API key for the Twelve Data API 
# and other required environment variables.

# Build and run the backend using Docker Compose
docker-compose up --build
