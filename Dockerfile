FROM node:20.11.1

WORKDIR /app

COPY package.json package.json

RUN npm install

COPY . .

ENTRYPOINT [ "node", "index.js" ]