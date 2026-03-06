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

# NOTE: causes.json is NOT baked into the image.
# Mount it as a persistent volume in your container orchestrator at /app/causes.json
# so it survives redeployments. On first run the server will start with an empty list.

# Create uploads directory (for cause images)
RUN mkdir -p /app/uploads

EXPOSE 3000

CMD ["node", "server.js"]
