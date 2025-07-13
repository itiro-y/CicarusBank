# CicarusBank
Projeto de microsserviços simulando um banco

# To do
  - Eureka Server
    - Client (em cada micro e fazer apontar pro server)
    - Server (subir no docker)
  - Comunicacao entre os micros por HTTP
    - Fazer o Filtro pro JWT em cada micro e determinar qual funcao vai ser USER/ADMIN
  - API Gateway
    - Fazer o tratamento dos endpoints de cada Client pelo Servidor
  - Adicionar mais micros
  - Front-end (BOMBA)

# Para roda bancos + eureka no docker
- navegar para CicarusBank/naming-server
- rodar ``./mvnw clean package``
- voltar para a raiz do projeto com ``cd ..`` 
- navegar para CicarusBank/api-gateway
- rodar ``./mvnw clean package``
- voltar para a raiz do projeto com ``cd ..``
- rodar ``docker-compose up --build -d``
- verificar usando ``docker compose ps``

## System Architecture Diagram

```mermaid
C4Container
    title CicarusBank System Architecture

    Person(user, "Bank Customer", "Uses the CicarusBank web application to manage finances.")

    Container(frontend, "CicarusBank Web App", "React Application", "Allows customers to view accounts, make transactions, exchange currency, etc.")
    Container(api_gateway, "API Gateway", "Spring Cloud Gateway", "Routes requests to appropriate microservices and handles cross-cutting concerns like authentication.")

    Container(auth_service, "Auth Service", "Spring Boot Microservice", "Handles user authentication and authorization.")
    Container(account_service, "Account Service", "Spring Boot Microservice", "Manages customer bank accounts.")
    Container(customer_service, "Customer Service", "Spring Boot Microservice", "Manages customer personal information.")
    Container(loan_service, "Loan Service", "Spring Boot Microservice", "Manages loan applications and approvals.")
    Container(transaction_service, "Transaction Service", "Spring Boot Microservice", "Handles all financial transactions.")
    Container(currency_exchange_service, "Currency Exchange Service", "Spring Boot Microservice", "Manages currency exchange operations.")
    Container(notification_service, "Notification Service", "Spring Boot Microservice", "Sends notifications to users (e.g., email, SMS).")
    Container(card_service, "Card Service", "Spring Boot Microservice", "Manages debit and credit cards.")
    Container(naming_server, "Naming Server", "Spring Boot (Eureka)", "Service discovery for microservices.")

    System_Ext(external_exchange_api, "External Exchange Rate API", "Third-party API", "Provides real-time currency exchange rates (e.g., open.er-api.com, frankfurter.app).")

    Rel(user, frontend, "Uses", "HTTPS")
    Rel(frontend, api_gateway, "Makes API calls to", "HTTPS")

    Rel(api_gateway, auth_service, "Authenticates/Authorizes requests with")
    Rel(api_gateway, account_service, "Routes requests to")
    Rel(api_gateway, customer_service, "Routes requests to")
    Rel(api_gateway, loan_service, "Routes requests to")
    Rel(api_gateway, transaction_service, "Routes requests to")
    Rel(api_gateway, currency_exchange_service, "Routes requests to")
    Rel(api_gateway, notification_service, "Routes requests to")
    Rel(api_gateway, card_service, "Routes requests to")

    Rel(auth_service, naming_server, "Registers with and discovers services from")
    Rel(account_service, naming_server, "Registers with and discovers services from")
    Rel(customer_service, naming_server, "Registers with and discovers services from")
    Rel(loan_service, naming_server, "Registers with and discovers services from")
    Rel(transaction_service, naming_server, "Registers with and discovers services from")
    Rel(currency_exchange_service, naming_server, "Registers with and discovers services from")
    Rel(notification_service, naming_server, "Registers with and discovers services from")
    Rel(card_service, naming_server, "Registers with and discovers services from")

    Rel(currency_exchange_service, external_exchange_api, "Fetches rates from", "HTTPS")

    Rel(account_service, transaction_service, "")
    Rel(transaction_service, notification_service, "Sends transaction alerts to")
    Rel(loan_service, account_service, "Updates account balances")
    Rel(card_service, account_service, "Manages card-related account operations")
```