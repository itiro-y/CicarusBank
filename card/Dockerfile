# Use a Java 21 runtime as a base image
FROM eclipse-temurin:21-jre-jammy

# The JAR file will be copied to this name inside the container
ARG JAR_FILE=target/*.jar
COPY ${JAR_FILE} app.jar

#CHECKPOINT
# Run the application
ENTRYPOINT ["java","-jar","/app.jar"]