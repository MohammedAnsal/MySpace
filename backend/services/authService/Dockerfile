FROM node:18

WORKDIR /app

COPY . .

RUN npm install

COPY . .

EXPOSE 7001

CMD [ "npm" , "start" ]