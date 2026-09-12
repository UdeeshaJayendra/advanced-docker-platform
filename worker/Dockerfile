FROM node:22-alpine

WORKDIR /app

COPY package*.json ./

RUN npm ci --omit=dev

COPY src ./src

RUN addgroup -S appgroup && adduser -S appuser -G appgroup

USER appuser

HEALTHCHECK --interval=10s --timeout=5s --start-period=5s --retries=3 \
  CMD pgrep -f "node src/worker.js" > /dev/null || exit 1

CMD ["node", "src/worker.js"]