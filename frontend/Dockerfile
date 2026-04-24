FROM node:lts as build

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM nginx:stable-alpine
# https://github.com/docker/buildx/issues/415

RUN rm /etc/nginx/conf.d/default.conf
RUN rm -rf /var/www/html/*

COPY --from=build /app/dist /var/www/html
COPY nginx.conf /etc/nginx/conf.d

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

