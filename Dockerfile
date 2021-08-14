FROM node:lts-alpine3.13

ARG NODE_ENV=develpoment

WORKDIR /srv

COPY package.json .

RUN npm install

COPY . .
