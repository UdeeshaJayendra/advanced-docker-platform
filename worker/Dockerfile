FROM node:22-alpine

WORKDIR /app

COPY package*.json ./

RUN npm ci --omit=dev

COPY src ./src

HEALTHCHECK --interval=10s --timeout=5s --retries=5 \
  CMD node -e "process.exit(0)"

CMD ["node", "src/worker.js"]