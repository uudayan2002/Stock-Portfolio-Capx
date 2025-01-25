# Use the Eclipse Temurin 21 JDK image as the base image for the application
FROM eclipse-temurin:21-jdk-jammy

# Update package lists and install Maven, then clean up the apt cache to reduce image size
RUN apt-get update && \
    apt-get install -y maven && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Set the working directory inside the container to /app
WORKDIR /app

# Copy the pom.xml file into the container's /app directory
COPY pom.xml .

# Copy the source code (src folder) into the container's /app/src directory
COPY src ./src

# Run Maven to clean and package the application, skipping tests to speed up the build
RUN mvn clean package -DskipTests

# Expose port 8085 to allow traffic to reach the application
EXPOSE 8085

# Define the command to run the application (Java JAR file) when the container starts
CMD ["java", "-jar", "target/stock-portfolio-0.0.1-SNAPSHOT.jar"]
