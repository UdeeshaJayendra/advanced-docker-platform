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

EXPOSE 3000

CMD ["node", "src/server.js"]