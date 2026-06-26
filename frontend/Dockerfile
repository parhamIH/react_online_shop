# Build stage
FROM node:22-alpine AS build

WORKDIR /app

ARG VITE_API_BASE_URL=/api
ARG VITE_USE_API=true
ARG VITE_BASE_PATH=/

ENV VITE_API_BASE_URL=$VITE_API_BASE_URL \
    VITE_USE_API=$VITE_USE_API \
    VITE_BASE_PATH=$VITE_BASE_PATH

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build

# Production stage
FROM nginx:1.27-alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
