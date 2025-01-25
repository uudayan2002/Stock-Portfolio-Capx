# Use the official Node.js 20 image based on Alpine for a smaller footprint
FROM node:20-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy the package.json and package-lock.json to the container
# These files are needed to install dependencies
COPY package*.json ./

# Install the application dependencies inside the container
RUN npm install

# Copy the rest of the application files to the container
COPY . .

# Expose port 3000 to the host machine, typically used for a React app
EXPOSE 3000

# Define the command to start the application in development mode
CMD ["npm", "run", "dev"]
