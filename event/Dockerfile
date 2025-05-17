# ┌─────────────────────────
# │ 1) Build 스테이지
# └─────────────────────────
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# ┌─────────────────────────
# │ 2) Production 스테이지
# └─────────────────────────
FROM node:18-alpine AS runner
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY --from=builder /app/dist ./dist

ENV PORT=3002
EXPOSE ${PORT}
CMD ["node", "dist/main.js"]
