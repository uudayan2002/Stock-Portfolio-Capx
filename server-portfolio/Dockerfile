FROM eclipse-temurin:21-jdk-jammy

RUN apt-get update && \
    apt-get install -y maven && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY pom.xml .

COPY src ./src

RUN mvn clean package -DskipTests

EXPOSE 8085

CMD ["java", "-jar", "target/stock-portfolio-0.0.1-SNAPSHOT.jar"]