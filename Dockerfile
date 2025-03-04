FROM node:18

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 8080

# seed db

RUN npm run seed

CMD ["npm", "start"]