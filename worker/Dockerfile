FROM node:22-alpine AS builder

WORKDIR /app

RUN apk update && apk upgrade --no-cache

COPY package*.json ./

RUN npm ci --omit=dev

COPY src ./src


FROM node:22-alpine AS runtime

WORKDIR /app

RUN apk update && apk upgrade --no-cache \
    && rm -rf /usr/local/lib/node_modules/npm \
    && rm -f /usr/local/bin/npm /usr/local/bin/npx

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/src ./src

RUN addgroup -S appgroup && adduser -S appuser -G appgroup

USER appuser

HEALTHCHECK --interval=10s --timeout=5s --start-period=5s --retries=3 \
  CMD pgrep -f "node src/worker.js" > /dev/null || exit 1

CMD ["node", "src/worker.js"]