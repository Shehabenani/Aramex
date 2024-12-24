FROM node:20-alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run build

EXPOSE 4000

CMD ["npm", "run", "serve:ssr:Aramex"]