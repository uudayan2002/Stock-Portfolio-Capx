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
- A Twelve Data API key. To obtain an API key, follow these steps:
    - Go to **[Twelve Data API Key](https://www.twelvedata.com/signup)** and sign up for an account.
    - Once signed in, navigate to the API Key section and copy your key

### Running the Backend
1. Clone the repository:
```bash
git clone https://github.com/uudayan2002/Stock-portfolio-Capx.git
cd Stock-portfolio-Capx/server-portfolio
```

2. Update the configuration:
    Add your Twelve Data API key in the docker-compose.yml file in the server-portfolio directory:
```bash
TWELVE_DATA_API_KEY: your-example-api-key-here # Replace with your actual API key
```

3. Build and run the backend using Docker Compose:
```bash
docker-compose up --build
```
4. Manual API Key Injection: If the API key does not work via the docker-compose.yml, follow these steps:
    - Open the file src/main/java/com/example/stock-portfolio/service/impl/StockServiceImpl.java.
    - Add the @Value annotation to inject the API key:
```bash
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class StockServiceImpl implements StockService {

    #@Value("${TWELVE_DATA_API_KEY}")
    private final String apiKey = your-example-api-key-here; #Replace with your actual API key and remove the key from docker-compose.yml

    // Rest of your service implementation
    public StockServiceImpl() {
        // Constructor where apiKey can be used
        System.out.println("API Key: " + apiKey);  // Just to demonstrate usage (remove this line in production)
    }

    // Your methods that use apiKey
}
```
5. Run the backend again:
```bash
docker-compose up --build
```

