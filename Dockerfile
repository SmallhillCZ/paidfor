FROM node:latest

WORKDIR /user/src/app

COPY ./app/package.json ./package.json

RUN npm i

COPY ./app .

# RUN npm run test

RUN npm run build


FROM nginx:alpine

WORKDIR /usr/share/nginx/html

COPY --from=0 /user/src/app/dist .

COPY ./projects ./projects

COPY ./nginx.conf /etc/nginx/nginx.conf
