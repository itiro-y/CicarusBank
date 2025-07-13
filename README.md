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
    Component(frontend, "Frontend")
    Component(api_gateway, "API Gateway")
    Component(auth_service, "Auth")
    Component(account_service, "Account")
    Component(customer_service, "Customer")
    Component(loan_service, "Loan")
    Component(transaction_service, "Transaction")
    Component(currency_exchange_service, "Currency Exchange")
    Component(notification_service, "Notification")
    Component(card_service, "Card")
    Component(naming_server, "Naming Server")
    Component(external_exchange_api, "External Exchange API")

    Rel(frontend, api_gateway, "")
    Rel(api_gateway, naming_server, "")
    Rel(naming_server, account_service, "")
    Rel(naming_server, customer_service, "")
    Rel(naming_server, loan_service, "")
    Rel(naming_server, transaction_service, "")
    Rel(naming_server, currency_exchange_service, "")
    Rel(naming_server, notification_service, "")
    Rel(naming_server, card_service, "")
    Rel(naming_server, naming_server, "")
    Rel(naming_server, auth_service, "")

```