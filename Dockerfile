FROM node:20

WORKDIR /api

COPY . .

RUN npm install

RUN npm run build

CMD ["npm", "start"]
