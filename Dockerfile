FROM node:23.6-alpine

WORKDIR /usr/src/misc-api

RUN npm install -g pm2

COPY . .

WORKDIR /usr/src/misc-api/app
RUN npm install

EXPOSE 3000

CMD npm install && pm2-runtime start app.js --name misc-api
