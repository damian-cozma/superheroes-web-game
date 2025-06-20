# Dockerfile pentru server Node.js
FROM node:20-alpine

WORKDIR /usr/src/app

COPY server/package*.json ./server/
WORKDIR /usr/src/app/server
RUN npm install
WORKDIR /usr/src/app

# Copiaza tot proiectul
COPY . .

WORKDIR /usr/src/app/server
RUN npm install -g nodemon
EXPOSE 3000
CMD ["nodemon", "index.js"]
