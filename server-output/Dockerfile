FROM node:23-alpine

ENV IS_DOCKER_CONTAINER=true

WORKDIR /app

COPY ./package*.json ./
RUN npm install

COPY ./usrcode /usrcode

COPY . .


EXPOSE 3000



CMD ["npm", "start"]
