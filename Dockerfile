FROM node:18

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY .env ./.env

COPY  prisma ./prisma

RUN npx prisma generate

COPY . .

RUN npm run build

EXPOSE 3000

CMD [ "sh", "-c", "npx prisma migrate deploy && npm run start:prod" ]