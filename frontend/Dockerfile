FROM node:20 as build

WORKDIR /app

COPY app/package.json .

RUN npm i

COPY app .
RUN npm run build

ENTRYPOINT ["npm","run","dev","--","--port=8000","--host=0.0.0.0"]
