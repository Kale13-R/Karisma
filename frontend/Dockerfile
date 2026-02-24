# Stage 1 — base image
FROM node:18-alpine AS base
WORKDIR /app

# Stage 2 — install dependencies
FROM base AS deps
COPY package.json package-lock.json* ./
RUN npm install

# Stage 3 — development
FROM base AS development
COPY --from=deps /app/node_modules ./node_modules
COPY . .
EXPOSE 3000
CMD ["npm", "run", "dev"]
