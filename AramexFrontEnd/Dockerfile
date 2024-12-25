FROM node:20.15-alpine AS build

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

FROM nginx:alpine

COPY --from=build /app/dist/aramex /usr/share/nginx/html

EXPOSE 4000

CMD ["nginx", "-g", "daemon off;"]