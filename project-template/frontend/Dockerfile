FROM node:12.19.0-alpine3.9 as build-deps
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build