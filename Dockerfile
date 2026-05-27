FROM node:lts AS builder

WORKDIR /app

COPY . . 

RUN npm install
RUN npm run build

CDM ["node", "dist/index.js"]