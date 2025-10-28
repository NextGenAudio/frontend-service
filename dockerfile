# -------------------------------
# 1️⃣ Build Stage — install deps & compile Next.js
# -------------------------------
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Install dependencies efficiently
COPY package.json package-lock.json* yarn.lock* ./
RUN if [ -f yarn.lock ]; then yarn install --frozen-lockfile; \
    elif [ -f package-lock.json ]; then npm ci; \
    else npm install; fi

# Copy project files
COPY . .

# Build the Next.js app
RUN npm run build

# -------------------------------
# 2️⃣ Runtime Stage — lightweight production server
# -------------------------------
FROM node:18-alpine AS runner

# Set environment variables for production
ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1

# Set working directory
WORKDIR /app

# Copy only the necessary files from the builder stage
COPY --from=builder /app/package.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public

# Expose the Next.js port
EXPOSE 3000

# Add default environment variables (can be overridden at runtime)
ENV NEXT_PUBLIC_MUSIC_LIBRARY_SERVICE_URL=http://54.157.158.119:8080 \
    NEXT_PUBLIC_USER_MANAGEMENT_SERVICE_URL=http://100.25.40.94:3020 \
    NEXT_PUBLIC_PLAYLIST_SERVICE_URL=http://3.218.244.116:8082

# Start the production server
CMD ["npm", "start"]
