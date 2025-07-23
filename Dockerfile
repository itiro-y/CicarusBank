# Usar uma imagem base do Node.js
FROM node:18-slim

# Definir o diretório de trabalho no contêiner
WORKDIR /usr/src/app

# Copiar o package.json e o package-lock.json (se existir)
COPY package*.json ./

# Instalar as dependências do projeto
RUN npm install

# Copiar os arquivos do servidor para o diretório de trabalho
COPY server.js .
COPY server2.js .

# Expor a porta que o servidor usará
EXPOSE 3001

# Comando para iniciar o servidor 1
CMD [ "npm", "run", "start:server1" ]
