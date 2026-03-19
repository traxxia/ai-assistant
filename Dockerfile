# ─────────────────────────────────────────
# Stage 2: Runtime
# ─────────────────────────────────────────
FROM node:22-alpine 

WORKDIR /app

# Only copy production deps manifest
COPY package*.json ./

# Install production dependencies only
RUN npm i --omit=dev && npm i -g tsx

# Copy source code
COPY src ./src

# Expose the app port
EXPOSE 4111

# Environment variables (overridden at runtime via Azure App Settings / Container Apps env)
# ENV NODE_ENV=production
ENV PORT=4111

# Start the server
CMD ["tsx", "src/server.ts"]
