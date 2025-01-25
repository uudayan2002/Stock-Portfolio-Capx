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

### Deployed Site
You can access the live version of the Stock Portfolio App at:
**[Stock Portfolio App](https://portfoliostock.netlify.app/)**

## Important Notes for Users:
- Mixed Content Issue:
    - The backend of this app is deployed over HTTP, while the frontend is served over HTTPS. Many modern browsers block HTTP requests from HTTPS pages due to security restrictions.
    - To avoid this issue, allow insecure access to the site in your browser's settings:
        - In Chrome, navigate to the address bar and click on the padlock icon, then click on "Site settings" and allow insecure content for the site.
        - Alternatively, you can bypass this issue by using a secure connection (HTTPS) for the backend or configuring the frontend to communicate with the backend over HTTPS.
- API Call Limit: The Twelve Data API has a limit of 8 API calls per minute. To avoid hitting this limit and ensure smooth functioning of the app, please do not refresh the page more than once within a minute.

## Backend

### Prerequisites
To run the backend locally, ensure you have:
- **Docker** and **Docker Compose** installed on your system.
- A Twelve Data API key. To obtain an API key, follow these steps:
    - Go to **[Twelve Data API Key](https://twelvedata.com/register)** and sign up for an account.
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
Once the container is running, the frontend will be available at:
```bash
http://localhost:8085
```

## Frontend

### Prerequisites
To run the frontend locally, ensure you have:
- Docker and Docker Compose installed on your system.

### Running the Frontend
1. Navigate to the client-portfolio directory:
```bash
cd stock-portfolio-app/client-portfolio
```

2. Build and run the frontend using Docker Compose:
```bash
docker-compose up --build
```

Once the container is running, the frontend will be available at:
```bash
http://localhost:5173
```

## Testing the Frontend
- Open the app in your browser and explore its features.
- Ensure the backend is running and reachable for API integration.