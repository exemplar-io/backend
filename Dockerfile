FROM node:alpine3.14 AS development

WORKDIR /usr/src/app

COPY package*.json ./

RUN apk add git

RUN npm install glob rimraf

RUN npm install --only=development

COPY . .

RUN npm run build

FROM node:alpine3.14 as production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}
ARG APP_CLIENT_ID_ARG
ARG APP_SECRET_ARG
ENV APP_CLIENT_ID=$APP_CLIENT_ID_ARG
ENV APP_SECRET=$APP_SECRET_ARG

WORKDIR /usr/src/app

RUN apk add git
COPY package*.json ./

RUN npm install --only=production

COPY . .

COPY --from=development /usr/src/app/dist ./dist

CMD ["node", "dist/main"]
