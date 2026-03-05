# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files and install ALL deps (including devDependencies for build)
COPY package*.json ./
RUN npm ci

# Copy source and build the React app
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
COPY causes.json ./

EXPOSE 3000

CMD ["node", "server.js"]
