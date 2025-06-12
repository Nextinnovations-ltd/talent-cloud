# React Frontend
FROM node:18-slim AS builder

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install
COPY . .
RUN npm run build

# Production stage (Nginx)
FROM nginx:alpine

# Copy React build files
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy Nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]