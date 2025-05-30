# -------- Build Stage --------
FROM node:22.1.0-alpine AS builder

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci

# Copy rest of the code and build
COPY . .
RUN npm run build

# -------- Runtime Stage --------
FROM node:22.1.0-alpine

WORKDIR /app

# Only production deps
COPY package*.json ./
RUN npm ci --only=production

# Copy built app
COPY --from=builder /app/dist ./dist

# Copy env file (for local, not production best practice)
COPY .env ./ 

EXPOSE 3000

CMD ["node", "dist/index.js"]
