# React Frontend - Build Stage
FROM node:18-slim AS builder

WORKDIR /app

# Copy package.json and lock file
COPY frontend/package.json frontend/package-lock.json ./

# Install dependencies
RUN npm install

# Copy source files
COPY frontend/ .

# Build the React app (assumes Vite or Create React App)
RUN npm run build

# Production Stage - Nginx
FROM nginx:alpine

# Copy build output to Nginx's public folder
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy custom Nginx config
COPY docker/frontend/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]