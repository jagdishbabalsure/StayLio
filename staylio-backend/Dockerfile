# Stage 1: Build the application
FROM maven:3.9.6-eclipse-temurin-17 AS build
WORKDIR /app

# Copy the project files
COPY pom.xml .
COPY src ./src

# Build the application (skip tests to save time)
RUN mvn clean package -DskipTests

# Stage 2: Run the application
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app

# Copy the JAR file from the build stage
# The jar is located in /app/target/ and typically named staylio-backend-0.0.1-SNAPSHOT.jar
COPY --from=build /app/target/*.jar app.jar

# Expose the correct port
EXPOSE 8083

# Run the application
ENTRYPOINT ["java", "-jar", "app.jar"]
