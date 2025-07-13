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
    subgraph "CicarusBank System"
        user[Bank Customer]
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
    api_gateway --> naming_server

    naming_server --> auth_service
    naming_server --> account_service
    naming_server --> customer_service
    naming_server --> loan_service
    naming_server --> transaction_service
    naming_server --> currency_exchange_service
    naming_server --> notification_service
    naming_server --> card_service
    
    account_service --> transaction_service
    transaction_service --> notification_service
    loan_service --> account_service
    card_service --> account_service
```