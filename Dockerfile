# ---- Build Stage ----
FROM node:22-alpine AS builder

WORKDIR /app

# Copy package files and install all dependencies (including dev)
COPY package.json package-lock.json ./
RUN npm install

# Copy source and build
COPY . .
RUN npm run build

# ---- Production Stage ----
FROM node:22-alpine AS production

WORKDIR /app

ENV NODE_ENV=production

# Copy package files and install production dependencies only
COPY package.json package-lock.json ./
RUN npm install --omit=dev

# Copy built output from builder stage
COPY --from=builder /app/.mastra/output ./.mastra/output

EXPOSE 4111

CMD ["node", ".mastra/output/index.mjs"]
