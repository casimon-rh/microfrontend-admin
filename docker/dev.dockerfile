FROM node:11 AS b
WORKDIR /usr/src/app
COPY package.json yarn.lock ./
RUN yarn
EXPOSE 3000
COPY . .
RUN yarn start