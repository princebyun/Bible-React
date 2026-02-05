# ============================================================
# 1) 빌드 단계 - ARM(linux/arm64) / amd64(linux/amd64) 호환
# ARM 서버에서 docker build 시 해당 아키텍처 이미지 자동 사용
# ============================================================
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
# 프로덕션 API 주소 (빌드 시 주입)
# 예: docker build --build-arg VITE_API_BASE_URL=https://api.example.com .
ARG VITE_API_BASE_URL=
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL
RUN npm run build

# ============================================================
# 2) 실행 단계 - nginx (웹 서버)
# ============================================================
FROM nginx:alpine

RUN rm -f /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

# 포그라운드 실행 (컨테이너 유지)
CMD ["nginx", "-g", "daemon off;"]
