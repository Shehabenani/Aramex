FROM node:latest AS build

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run build --prod

FROM nginx:latest

COPY --from=build /app/dist/aramex /usr/share/nginx/html

EXPOSE 4000

CMD ["nginx", "-g", "daemon off;"]