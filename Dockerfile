# Step 1: Фронтенд (остается без изменений)
FROM node:22-alpine AS frontend-builder
WORKDIR /project/frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ .
RUN npm run build

# Step 2: Используем 32-битный образ ARM для сборки (никаких кросс-компиляторов!)
FROM arm32v7/golang:1.23 AS backend-builder
# Добавляем нужные библиотеки для GUI
RUN apt-get update && apt-get install -y \
    libgtk-3-dev \
    libwebkit2gtk-4.0-dev \
    build-essential \
    pkg-config

RUN go install github.com/wailsapp/wails/v2/cmd/wails@latest

WORKDIR /project
COPY . .
COPY --from=frontend-builder /project/frontend/dist ./frontend/dist

# Здесь мы уже находимся внутри 32-битной среды, поэтому CGO будет работать нативно
RUN CGO_ENABLED=1 \
    GOOS=linux \
    GOARCH=arm \
    GOARM=7 \
    CC=arm-linux-gnueabihf-gcc \
    CXX=arm-linux-gnueabihf-g++ \
    go build -mod=readonly -ldflags="-linkmode external -extldflags '-static -static-libgcc -static-libstdc++'" -o solmix-app-linux ./main.go