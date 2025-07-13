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
graph TD
    subgraph "External"
        user[Bank Customer]
        external_exchange_api[External Exchange API]
    end

    subgraph "CicarusBank System"
        frontend[Frontend]
        api_gateway[API Gateway]
        auth_service[Auth]
        account_service[Account]
        customer_service[Customer]
        loan_service[Loan]
        transaction_service[Transaction]
        currency_exchange_service[Currency Exchange]
        notification_service[Notification]
        card_service[Card]
        naming_server[Naming Server]
    end

    user --> frontend
    frontend --> api_gateway

    api_gateway --> auth_service
    api_gateway --> account_service
    api_gateway --> customer_service
    api_gateway --> loan_service
    api_gateway --> transaction_service
    api_gateway --> currency_exchange_service
    api_gateway --> notification_service
    api_gateway --> card_service
    api_gateway --> naming_server

    currency_exchange_service --> external_exchange_api

    account_service --> transaction_service
    transaction_service --> notification_service
    loan_service --> account_service
    card_service --> account_service
```