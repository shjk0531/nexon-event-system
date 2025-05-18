# ┌─────────────────────────
# │ 1) Build 스테이지: devDependencies 포함 전체 설치 후 빌드
# └─────────────────────────
FROM node:18-alpine AS builder
WORKDIR /app

# package.json + package-lock.json 복사하고 devDependencies 설치
COPY package*.json ./
RUN npm ci

# 소스 복사 및 NestJS 빌드
COPY . .
RUN npm run build

# ┌─────────────────────────
# │ 2) Production 스테이지: prod dependencies만 설치
# └─────────────────────────
FROM node:18-alpine AS runner
WORKDIR /app

# prod dependencies만 설치
COPY package*.json ./
RUN npm ci --only=production

# builder에서 빌드된 dist 디렉터리만 복사
COPY --from=builder /app/dist ./dist

# Gateway가 리스닝하는 포트
ENV PORT=3000
EXPOSE ${PORT}

# 직접 node로 실행하면 불필요한 CLI 의존성 제거
CMD ["node", "dist/main.js"]
