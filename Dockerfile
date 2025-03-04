# Build stage
FROM node:20-alpine AS build

WORKDIR /app

# Copy toàn bộ source code vào container
COPY package*.json ./
RUN npm install --legacy-peer-deps

COPY . .

# Build ứng dụng
RUN npm run build

# Production stage
FROM nginx:1.23-alpine

# Copy file build vào Nginx
COPY --from=build /app/build /usr/share/nginx/html

# Expose port
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
