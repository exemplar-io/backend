# pull official base image
# FROM node:alpine3.14

# # set working directory
# WORKDIR /app

# # add `/app/node_modules/.bin` to $PATH
# ENV PATH /app/node_modules/.bin:$PATH

# # install app dependencies
# RUN apk add git
# COPY package.json ./
# COPY package-lock.json ./
# RUN npm install


# # add app
# COPY . ./

# # start app
# CMD ["nest", "start", "--watch"]

FROM node:15.4 as build

WORKDIR /app
COPY package*.json .
RUN npm install 
COPY . . 
RUN npm run build 

FROM node:15.4
WORKDIR /app
COPY package.json . 
RUN npm install --only=production
COPY --from=build /app/dist ./dist
CMD npm run start:prod
