# CicarusBank

## About CicarusBank
CicarusBank is a collaborative project that implements a comprehensive banking system. It is designed and developed 
using a  microservices architecture.

## Tech Stack
This project utilizes the following key technologies:

*   **Frontend:** React
*   **Backend:** Spring Boot
*   **Containerization:** Docker
*   **Database:** MySQL


## How to Run

To run the CicarusBank application, follow these steps:

### Prerequisites
Before you begin, ensure you have the following installed:
*   **Docker** and **Docker Compose**: For containerizing and orchestrating the microservices.
*   **Maven**: For building the Spring Boot microservices.

### Running the Application

1.  **Navigate to the project root:**
    ```bash
    cd .../CicarusBank
    ```

2.  **Execute the `runapp.sh` script:**
    This script automates the process of building the microservices and starting the Docker containers.
    ```bash
    ./runapp.sh
    ```

    The script performs the following actions:
    *   Shuts down any currently running Docker containers for the project.
    *   Runs `mvnw clean package` to clean and package all Maven-based microservices.
    *   Builds and starts all services using `docker compose up --build -d` in detached mode.

3.  **Verify containers (Optional):**
    You can check the status of your running containers using:
    ```bash
    docker compose ps
    ```

## System Architecture Diagram
```mermaid
graph TD
    subgraph "CicarusBank System"
        user[Bank Customer]

        subgraph "Frontend Container"
            frontend[Frontend]
        end

        subgraph "API Gateway Container"
            api_gateway[API Gateway]
        end

        subgraph "Naming Server Container"
            naming_server[Naming Server]
        end

        subgraph "Auth Service Container"
            auth_service[Auth Service]
        end
        subgraph "Auth DB Container"
            auth_db[(Auth DB)]
        end

        subgraph "Account Service Container"
            account_service[Account Service]
        end
        subgraph "Account DB Container"
            account_db[(Account DB)]
        end

        subgraph "Customer Service Container"
            customer_service[Customer Service]
        end
        subgraph "Customer DB Container"
            customer_db[(Customer DB)]
        end

        subgraph "Loan Service Container"
            loan_service[Loan Service]
        end
        subgraph "Loan DB Container"
            loan_db[(Loan DB)]
        end

        subgraph "Transaction Service Container"
            transaction_service[Transaction Service]
        end
        subgraph "Transaction DB Container"
            transaction_db[(Transaction DB)]
        end

        subgraph "Currency Exchange Service Container"
            currency_exchange_service[Currency Exchange Service]
        end
        subgraph "Currency Exchange DB Container"
            currency_exchange_db[(Currency Exchange DB)]
        end

        subgraph "Notification Service Container"
            notification_service[Notification Service]
        end
        subgraph "Notification DB Container"
            notification_db[(Notification DB)]
        end

        subgraph "Card Service Container"
            card_service[Card Service]
        end
        subgraph "Card DB Container"
            card_db[(Card DB)]
        end

        subgraph "Statement Service Container"
            statement_service[Statement Service]
        end
        subgraph "Statement DB Container"
            statement_db[(Statement DB)]
        end
    end

    user --> frontend
    frontend --> api_gateway
    api_gateway --> naming_server

    naming_server --> auth_service
    naming_server --> account_service
    naming_server --> customer_service
    naming_server --> loan_service
    naming_server --> transaction_service
    naming_server --> currency_exchange_service
    naming_server --> notification_service
    naming_server --> card_service
    naming_server --> statement_service

    auth_service --> auth_db
    account_service --> account_db
    customer_service --> customer_db
    loan_service --> loan_db
    transaction_service --> transaction_db
    currency_exchange_service --> currency_exchange_db
    notification_service --> notification_db
    card_service --> card_db
    statement_service --> statement_db
```
docker-compose up mysql-auth mysql-customer mysql-emailModel mysql-statement mysql-currency mysql-account mysql-transaction mysql-loan mysql-card --build -d
