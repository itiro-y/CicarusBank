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
    Component(frontend, "CicarusBank Web App")
    Component(api_gateway, "API Gateway")

    Component(auth_service, "Auth Service")
    Component(account_service, "Account Service")
    Component(customer_service, "Customer Service")
    Component(loan_service, "Loan Service")
    Component(transaction_service, "Transaction Service")
    Component(currency_exchange_service, "Currency Exchange Service")
    Component(notification_service, "Notification Service")
    Component(card_service, "Card Service")
    Component(naming_server, "Naming Server")
    Component(external_exchange_api, "External Exchange Rate API")

    Rel(frontend, api_gateway)

    Rel(api_gateway, auth_service)
    Rel(api_gateway, account_service)
    Rel(api_gateway, customer_service)
    Rel(api_gateway, loan_service)
    Rel(api_gateway, transaction_service)
    Rel(api_gateway, currency_exchange_service)
    Rel(api_gateway, notification_service)
    Rel(api_gateway, card_service)
    Rel(api_gateway, naming_server)

    Rel(currency_exchange_service, external_exchange_api)

    Rel(account_service, transaction_service)
    Rel(transaction_service, notification_service)
    Rel(loan_service, account_service)
    Rel(card_service, account_service)
```