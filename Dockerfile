# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# Production stage
FROM node:20-alpine AS runner

WORKDIR /app

# Copy package files and install production deps only
COPY package*.json ./
RUN npm ci --omit=dev

# Copy built frontend and server files
COPY --from=builder /app/dist ./dist
COPY server.js ./

# Copy causes.json as a seed file
COPY causes.json /app/causes.seed.json

# Startup script: seed causes.json on first run if the volume file doesn't exist
RUN printf '#!/bin/sh\n[ ! -f /app/causes.json ] && cp /app/causes.seed.json /app/causes.json\nexec node server.js\n' > /app/start.sh && chmod +x /app/start.sh

# Create uploads directory (for cause images)
RUN mkdir -p /app/uploads

EXPOSE 3000

CMD ["/app/start.sh"]
