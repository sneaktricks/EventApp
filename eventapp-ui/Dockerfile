FROM node:lts-alpine

EXPOSE 3000

WORKDIR /app

ENV PATH /app/node_modules/.bin:$PATH

COPY *.json ./

RUN npm i

COPY . .

CMD npm run dev