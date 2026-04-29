# 建建階段
FROM node:20-alpine AS build

WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm install
COPY . .
RUN npm run build

# 生產階段
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html

# Nginx 設定（API 代理）
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
