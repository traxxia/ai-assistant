# ─────────────────────────────────────────
# Stage 1: Builder
# ─────────────────────────────────────────
FROM node:22-alpine AS builder

WORKDIR /app

# Copy dependency files first (layer caching)
COPY package*.json ./

# Install all dependencies (including devDependencies for build)
RUN npm ci

# Copy source
COPY . .

# Build the Mastra app
RUN npm run build

# ─────────────────────────────────────────
# Stage 2: Runtime
# ─────────────────────────────────────────
FROM node:22-alpine AS runner

WORKDIR /app

# Only copy production deps manifest
COPY package*.json ./

# Install production dependencies only
RUN npm ci --omit=dev

# Copy built output from builder stage
COPY --from=builder /app/.mastra ./.mastra
COPY --from=builder /app/src ./src

# Expose the app port
EXPOSE 4111

# Environment variables (overridden at runtime via Azure App Settings / Container Apps env)
ENV NODE_ENV=production
ENV PORT=4111

# Start the server
CMD ["npm", "run", "start:server"]
